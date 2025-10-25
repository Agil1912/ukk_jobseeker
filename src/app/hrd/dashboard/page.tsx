"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Building2,
} from "lucide-react";
import Link from "next/link";
import {
  companyAPI,
  applicationAPI,
  type Company,
  type AvailablePosition,
  type PositionApplied,
  type Society,
  type User,
  type Portfolio,
} from "@/lib/api";
import { toast } from "sonner";
import Image from "next/image";

interface CompanyWithDetails extends Company {
  available_positions?: Array<
    AvailablePosition & { position_applied?: PositionApplied[] }
  >;
  user?: User;
}

export default function HRDDashboard() {
  const { user } = useAuth();
  const [companyData, setCompanyData] = useState<CompanyWithDetails | null>(
    null
  );
  const [applications, setApplications] = useState<
    Array<
      PositionApplied & {
        position?: AvailablePosition & { company?: Company };
        society?: Society & { user?: User; portfolios?: Portfolio[] };
      }
    >
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        const companyId = user.company?.id;
        if (!companyId) {
          toast.error("Data perusahaan tidak ditemukan");
          setLoading(false);
          return;
        }

        // Fetch company profile
        const companyResponse = await companyAPI.getById(companyId);

        // Fetch all applications for this company
        const applicationsResponse =
          await applicationAPI.getCompanyApplications();

        // Fetch all available positions to get full position details
        const positionsResponse = await applicationAPI.getAll();

        if (companyResponse.success && companyResponse.data) {
          const company = companyResponse.data;

          // Set applications from the dedicated endpoint
          if (applicationsResponse.success && applicationsResponse.data) {
            const applicationsData = applicationsResponse.data;
            setApplications(applicationsData);
          }

          // Filter positions by company and attach applications
          if (positionsResponse.success && positionsResponse.data) {
            const applicationsData =
              applicationsResponse.success && applicationsResponse.data
                ? applicationsResponse.data
                : [];

            const companyPositions = positionsResponse.data
              .filter((pos) => pos.company_id === companyId)
              .map((pos) => ({
                ...pos,
                position_applied: applicationsData.filter(
                  (app) => app.available_position_id === pos.id
                ),
              }));

            setCompanyData({
              ...company,
              available_positions: companyPositions,
            });
          } else {
            setCompanyData(company);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Gagal memuat data dashboard");
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [user]);

  const handleStatusUpdate = async (
    applicationId: string,
    newStatus: "ACCEPTED" | "REJECTED"
  ) => {
    try {
      const response = await applicationAPI.updateStatus(
        applicationId,
        newStatus
      );
      if (response.success) {
        toast.success(
          `Status lamaran berhasil diubah menjadi ${
            newStatus === "ACCEPTED" ? "Diterima" : "Ditolak"
          }`
        );

        // Refresh data
        const companyId = user?.company?.id;
        if (companyId) {
          const companyResponse = await companyAPI.getById(companyId);
          const applicationsResponse =
            await applicationAPI.getCompanyApplications();
          const positionsResponse = await applicationAPI.getAll();

          if (companyResponse.success && companyResponse.data) {
            const company = companyResponse.data;

            // Update applications state
            if (applicationsResponse.success && applicationsResponse.data) {
              const applicationsData = applicationsResponse.data;
              setApplications(applicationsData);
            }

            // Update positions with refreshed applications
            if (positionsResponse.success && positionsResponse.data) {
              const applicationsData =
                applicationsResponse.success && applicationsResponse.data
                  ? applicationsResponse.data
                  : [];

              const companyPositions = positionsResponse.data
                .filter((pos) => pos.company_id === companyId)
                .map((pos) => ({
                  ...pos,
                  position_applied: applicationsData.filter(
                    (app) => app.available_position_id === pos.id
                  ),
                }));

              setCompanyData({
                ...company,
                available_positions: companyPositions,
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error("Gagal mengubah status lamaran");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-center">Memuat data...</p>
      </div>
    );
  }

  const positions = companyData?.available_positions ?? [];

  // Use applications from the dedicated endpoint
  const pendingApplications = (applications || []).filter(
    (app) => app.status === "PENDING"
  );
  const acceptedApplications = (applications || []).filter(
    (app) => app.status === "ACCEPTED"
  );
  const rejectedApplications = (applications || []).filter(
    (app) => app.status === "REJECTED"
  );

  return (
    <div className="container mx-auto space-y-6 py-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard HRD</h1>
          <p className="text-muted-foreground">
            Selamat datang, {companyData?.name ?? user?.name}!
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/hrd/dashboard/edit-company">
              <Building2 className="mr-2 h-4 w-4" />
              Edit Profil Perusahaan
            </Link>
          </Button>
          <Button asChild>
            <Link href="/hrd/dashboard/post-job">
              <Plus className="mr-2 h-4 w-4" />
              Buat Lowongan
            </Link>
          </Button>
        </div>
      </div>

      {/* Company Info Card */}
      {companyData && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              {user?.image && (
                <Image
                  src={user.image}
                  alt={companyData.name}
                  className="h-20 w-20 rounded-lg object-cover"
                  width={80}
                  height={80}
                />
              )}
              <div className="flex-1">
                <h2 className="text-xl font-bold">{companyData.name}</h2>
                <p className="text-muted-foreground mt-1">
                  {companyData.address}
                </p>
                <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                  {companyData.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Lowongan
            </CardTitle>
            <Briefcase className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positions.length}</div>
            <p className="text-muted-foreground text-xs">Posisi aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lamaran Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingApplications.length}
            </div>
            <p className="text-muted-foreground text-xs">Perlu direview</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lamaran Diterima
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {acceptedApplications.length}
            </div>
            <p className="text-muted-foreground text-xs">Kandidat lolos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lamaran Ditolak
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rejectedApplications.length}
            </div>
            <p className="text-muted-foreground text-xs">Tidak sesuai</p>
          </CardContent>
        </Card>
      </div>

      {/* Positions Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Lowongan Pekerjaan</CardTitle>
        </CardHeader>
        <CardContent>
          {positions.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              <Briefcase className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>Belum ada lowongan pekerjaan</p>
              <Button className="mt-4" asChild>
                <Link href="/hrd/dashboard/post-job">
                  <Plus className="mr-2 h-4 w-4" />
                  Buat Lowongan Pertama
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {positions.map((position) => {
                const apps = position.position_applied ?? [];
                const pending = apps.filter(
                  (a) => a.status === "PENDING"
                ).length;
                const accepted = apps.filter(
                  (a) => a.status === "ACCEPTED"
                ).length;
                const rejected = apps.filter(
                  (a) => a.status === "REJECTED"
                ).length;

                const endDate = new Date(position.submission_end_date);
                const isActive = endDate >= new Date();

                return (
                  <Card key={position.id}>
                    <CardContent className="p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <h3 className="text-lg font-semibold">
                              {position.position_name}
                            </h3>
                            {isActive ? (
                              <Badge
                                variant="outline"
                                className="border-blue-200 bg-blue-50 text-blue-700"
                              >
                                Aktif
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="border-gray-200 bg-gray-50 text-gray-700"
                              >
                                Berakhir
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {apps.length} pelamar • {position.capacity} posisi
                            tersedia
                          </p>
                          <p className="text-muted-foreground text-xs">
                            Berakhir:{" "}
                            {endDate.toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge
                            variant="outline"
                            className="border-yellow-200 bg-yellow-50 text-yellow-700"
                          >
                            <Clock className="mr-1 h-3 w-3" />
                            {pending}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-green-200 bg-green-50 text-green-700"
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            {accepted}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-red-200 bg-red-50 text-red-700"
                          >
                            <XCircle className="mr-1 h-3 w-3" />
                            {rejected}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/jobs/${position.id}`}>
                            Lihat Detail
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`/hrd/dashboard/positions/${position.id}/edit`}
                          >
                            Edit Lowongan
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Lamaran Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground mb-4 text-sm">
            Total lamaran: {applications.length}
          </div>
          {applications.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>Belum ada lamaran masuk</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications
                .sort(
                  (a, b) =>
                    new Date(b.apply_date).getTime() -
                    new Date(a.apply_date).getTime()
                )
                .slice(0, 10)
                .map((application) => (
                  <div
                    key={application.id}
                    className="hover:bg-muted/50 flex items-start gap-4 rounded-lg border p-4 transition-colors"
                  >
                    {/* Applicant Avatar */}
                    <div className="flex-shrink-0">
                      {application.society?.user?.image ? (
                        <Image
                          src={application.society.user.image}
                          alt={application.society.name ?? "Applicant"}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                          <Users className="text-primary h-6 w-6" />
                        </div>
                      )}
                    </div>

                    {/* Application Info */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">
                          {application.society?.name ?? "Unknown Applicant"}
                        </p>
                        {application.status === "PENDING" && (
                          <Badge
                            variant="outline"
                            className="border-yellow-200 bg-yellow-50 text-yellow-700"
                          >
                            <Clock className="mr-1 h-3 w-3" />
                            Menunggu
                          </Badge>
                        )}
                        {application.status === "ACCEPTED" && (
                          <Badge
                            variant="outline"
                            className="border-green-200 bg-green-50 text-green-700"
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Diterima
                          </Badge>
                        )}
                        {application.status === "REJECTED" && (
                          <Badge
                            variant="outline"
                            className="border-red-200 bg-red-50 text-red-700"
                          >
                            <XCircle className="mr-1 h-3 w-3" />
                            Ditolak
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Melamar sebagai:{" "}
                        <span className="font-medium">
                          {application.position?.position_name ??
                            "Unknown Position"}
                        </span>
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(application.apply_date).toLocaleDateString(
                          "id-ID",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    {application.status === "PENDING" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-600 text-green-600 hover:bg-green-50"
                          onClick={() =>
                            handleStatusUpdate(application.id, "ACCEPTED")
                          }
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Terima
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-600 hover:bg-red-50"
                          onClick={() =>
                            handleStatusUpdate(application.id, "REJECTED")
                          }
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Tolak
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
