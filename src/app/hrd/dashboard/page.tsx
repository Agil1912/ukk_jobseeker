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
  TrendingUp,
  Eye,
  Edit3,
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

        const companyResponse = await companyAPI.getById(companyId);
        const applicationsResponse =
          await applicationAPI.getCompanyApplications();
        const positionsResponse = await applicationAPI.getAll();

        if (companyResponse.success && companyResponse.data) {
          const company = companyResponse.data;

          if (applicationsResponse.success && applicationsResponse.data) {
            const applicationsData = applicationsResponse.data;
            setApplications(applicationsData);
          }

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

        const companyId = user?.company?.id;
        if (companyId) {
          const companyResponse = await companyAPI.getById(companyId);
          const applicationsResponse =
            await applicationAPI.getCompanyApplications();
          const positionsResponse = await applicationAPI.getAll();

          if (companyResponse.success && companyResponse.data) {
            const company = companyResponse.data;

            if (applicationsResponse.success && applicationsResponse.data) {
              const applicationsData = applicationsResponse.data;
              setApplications(applicationsData);
            }

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Memuat data...</p>
        </div>
      </div>
    );
  }

  const positions = companyData?.available_positions ?? [];
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {user?.image && (
                <Image
                  src={user.image}
                  alt={companyData?.name ?? "Company"}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {companyData?.name ?? "Dashboard"}
                </h1>
                <p className="text-sm text-gray-500">HRD Management System</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white"
                asChild
              >
                <Link href="/hrd/jobs/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Buat Lowongan
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="bg-white border border-gray-200 hover:border-blue-300 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Total Lowongan
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {positions.length}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Briefcase className="text-blue-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 hover:border-orange-300 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Lamaran Pending
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {pendingApplications.length}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Clock className="text-orange-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 hover:border-green-300 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Lamaran Diterima
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {acceptedApplications.length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="text-green-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 hover:border-red-300 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Lamaran Ditolak
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {rejectedApplications.length}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <XCircle className="text-red-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Positions Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">
                Lowongan Pekerjaan
              </h2>
            </div>

            {positions.length === 0 ? (
              <Card className="bg-white border border-gray-200 text-center py-12">
                <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-600 font-medium mb-4">
                  Belum ada lowongan pekerjaan
                </p>
                <Button
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                  asChild
                >
                  <Link href="/hrd/dashboard/post-job">
                    <Plus className="mr-2 h-4 w-4" />
                    Buat Lowongan Pertama
                  </Link>
                </Button>
              </Card>
            ) : (
              <div className="space-y-3">
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
                    <Card
                      key={position.id}
                      className="bg-white border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {position.position_name}
                              </h3>
                              <Badge
                                className={`text-xs font-medium ${
                                  isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {isActive ? "Aktif" : "Berakhir"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {apps.length} pelamar • {position.capacity} posisi
                              tersedia
                            </p>
                            <p className="text-xs text-gray-500">
                              Berakhir:{" "}
                              {endDate.toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Badge
                              variant="secondary"
                              className="bg-orange-100 text-orange-700"
                            >
                              <Clock className="mr-1 h-3 w-3" />
                              {pending}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-700"
                            >
                              <CheckCircle className="mr-1 h-3 w-3" />
                              {accepted}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="bg-red-100 text-red-700"
                            >
                              <XCircle className="mr-1 h-3 w-3" />
                              {rejected}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Applications Sidebar */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">
                Lamaran Terbaru
              </h2>
            </div>

            {applications.length === 0 ? (
              <Card className="bg-white border border-gray-200 text-center py-8">
                <Users className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                <p className="text-sm text-gray-600">Belum ada lamaran masuk</p>
              </Card>
            ) : (
              <div className="space-y-2">
                {applications
                  .sort(
                    (a, b) =>
                      new Date(b.apply_date).getTime() -
                      new Date(a.apply_date).getTime()
                  )
                  .slice(0, 8)
                  .map((application) => (
                    <Card
                      key={application.id}
                      className="bg-white border border-gray-200 hover:border-blue-300 transition-colors"
                    >
                      <CardContent className="p-3">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0">
                            {application.society?.user?.image ? (
                              <Image
                                src={application.society.user.image}
                                alt={application.society.name ?? "Applicant"}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="bg-gray-200 flex h-10 w-10 items-center justify-center rounded-full">
                                <Users className="text-gray-600 h-5 w-5" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">
                              {application.society?.name ?? "Unknown"}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {application.position?.position_name ??
                                "Unknown Position"}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                className={`text-xs ${
                                  application.status === "PENDING"
                                    ? "bg-orange-100 text-orange-700"
                                    : application.status === "ACCEPTED"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {application.status === "PENDING"
                                  ? "Pending"
                                  : application.status === "ACCEPTED"
                                  ? "Terima"
                                  : "Tolak"}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {application.status === "PENDING" && (
                          <div className="flex gap-1 mt-3 pt-3 border-t border-gray-200">
                            <Button
                              size="sm"
                              className="flex-1 h-7 text-xs bg-green-600 hover:bg-green-700 text-white"
                              onClick={() =>
                                handleStatusUpdate(application.id, "ACCEPTED")
                              }
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 h-7 text-xs bg-red-600 hover:bg-red-700 text-white"
                              onClick={() =>
                                handleStatusUpdate(application.id, "REJECTED")
                              }
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
