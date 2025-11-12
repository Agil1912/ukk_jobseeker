"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { hrdService } from "@/lib/services/hrd.service";
import { toast } from "sonner";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  ExternalLink,
  FileText,
} from "lucide-react";
import type {
  AvailablePosition,
  PositionApplied,
  Society,
  Portfolio,
  User as UserType,
} from "@/lib/api";

interface SocietyWithDetails extends Society {
  user?: UserType;
  portfolios?: Portfolio[];
}

interface ApplicationWithDetails extends PositionApplied {
  society?: SocietyWithDetails;
}

export default function JobApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<AvailablePosition | null>(null);
  const [applications, setApplications] = useState<ApplicationWithDetails[]>(
    []
  );
  const [selectedApplicant, setSelectedApplicant] =
    useState<SocietyWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [jobId]);

  const loadData = async () => {
    try {
      const applicationsData = await hrdService.getJobApplications(jobId);
      setApplications(applicationsData as ApplicationWithDetails[]);

      if (
        applicationsData.length > 0 &&
        applicationsData[0].available_position
      ) {
        setJob(applicationsData[0].available_position);
      }
    } catch (error) {
      toast.error("Gagal memuat data pelamar");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    applicationId: string,
    status: "pending" | "accepted" | "rejected"
  ) => {
    setUpdating(applicationId);
    try {
      await hrdService.updateApplicationStatus(applicationId, status);
      toast.success("Status lamaran berhasil diperbarui");
      loadData();
    } catch (error) {
      toast.error("Gagal memperbarui status lamaran");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case "ACCEPTED":
        return (
          <Badge className="bg-green-500 text-white font-bold">Diterima</Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-500 text-white font-bold">Ditolak</Badge>
        );
      default:
        return (
          <Badge className="bg-orange-500 text-white font-bold">Menunggu</Badge>
        );
    }
  };

  const viewApplicantDetails = (applicant: SocietyWithDetails) => {
    setSelectedApplicant(applicant);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-blue-50 via-orange-50 to-green-50 min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-blue-200 rounded w-1/3"></div>
          <div className="h-64 bg-orange-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <Button
              variant="ghost"
              asChild
              className="mb-4 font-bold text-blue-600 hover:bg-blue-100"
            >
              <Link href="/hrd/jobs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Link>
            </Button>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-orange-600 to-green-600 bg-clip-text text-transparent">
              Pelamar: {job?.position_name}
            </h1>
            <p className="text-muted-foreground text-gray-600 font-semibold text-lg">
              Kelola pelamar untuk posisi ini
            </p>
          </div>

          {job && (
            <Card className="border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold">
                  {job.position_name}
                </CardTitle>
                <CardDescription className="text-blue-100 text-pretty font-semibold">
                  {job.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-6 text-sm font-semibold">
                  <div className="flex items-center gap-2 text-blue-700">
                    <MapPin className="h-5 w-5" />
                    <span>
                      {job.company?.address || "Lokasi tidak tersedia"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-orange-700">
                    <Briefcase className="h-5 w-5" />
                    <span>Kapasitas: {job.capacity} orang</span>
                  </div>
                  {job.salary && (
                    <div className="flex items-center gap-2 text-green-700 font-bold">
                      <span className="text-lg">💰</span>
                      <span>Rp {job.salary.toLocaleString("id-ID")}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-blue-600">
              Daftar Pelamar ({applications.length})
            </h2>
          </div>

          {applications.length === 0 ? (
            <Card className="border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-orange-100">
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-orange-500" />
                <p className="text-orange-700 font-bold text-lg">
                  Belum ada pelamar untuk posisi ini
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-5">
              {applications.map((application, index) => (
                <Card
                  key={application.id}
                  className="border-2 border-green-300 bg-gradient-to-r from-white to-green-50 shadow-md hover:shadow-xl transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                            <User className="h-7 w-7 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl font-bold text-blue-700">
                              {application.society?.name}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1 font-semibold text-orange-600">
                              <Mail className="h-4 w-4" />
                              {application.society?.user?.email}
                            </CardDescription>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-6 text-sm mb-4 font-semibold">
                          {application.society?.phone && (
                            <div className="flex items-center gap-2 text-blue-700">
                              <Phone className="h-4 w-4" />
                              {application.society.phone}
                            </div>
                          )}
                          {application.society?.address && (
                            <div className="flex items-center gap-2 text-green-700">
                              <MapPin className="h-4 w-4" />
                              {application.society.address}
                            </div>
                          )}
                        </div>

                        {application.society?.portfolios &&
                          application.society.portfolios.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm font-bold text-orange-600 mb-2">
                                Portfolio:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {application.society.portfolios.map(
                                  (portfolio) => (
                                    <Badge
                                      key={portfolio.id}
                                      className="bg-green-500 text-white font-bold"
                                    >
                                      {portfolio.skill}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
                          <span className="text-blue-700">
                            Dilamar:{" "}
                            {new Date(
                              application.apply_date
                            ).toLocaleDateString("id-ID")}
                          </span>
                          <span className="text-green-700">
                            Status: {getStatusBadge(application.status)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <Button
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                          size="sm"
                          onClick={() =>
                            viewApplicantDetails(application.society!)
                          }
                        >
                          <Briefcase className="mr-2 h-4 w-4" />
                          Lihat Portfolio
                        </Button>
                        <Select
                          value={application.status.toLowerCase()}
                          onValueChange={(
                            value: "pending" | "accepted" | "rejected"
                          ) => handleStatusChange(application.id, value)}
                          disabled={updating === application.id}
                        >
                          <SelectTrigger className="w-[180px] border-2 bg-orange-500 border-orange-400 font-bold text-white">
                            <SelectValue placeholder="Ubah Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Menunggu</SelectItem>
                            <SelectItem value="accepted">Terima</SelectItem>
                            <SelectItem value="rejected">Tolak</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}

          {/* Applicant Details Dialog */}
          <Dialog
            open={!!selectedApplicant}
            onOpenChange={() => setSelectedApplicant(null)}
          >
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50 to-green-50">
              <DialogHeader className=" bg-orange-500  text-white rounded-lg p-4 -m-6 mb-4">
                <DialogTitle className="text-2xl font-bold">
                  Detail Pelamar
                </DialogTitle>
                <DialogDescription className="text-blue-100 font-semibold">
                  Informasi lengkap dan portfolio pelamar
                </DialogDescription>
              </DialogHeader>

              {selectedApplicant && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-lg border-2 border-blue-300">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-blue-700">
                        {selectedApplicant.name}
                      </h3>
                      <p className="text-orange-600 font-semibold">
                        {selectedApplicant.user?.email ||
                          "Email tidak tersedia"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedApplicant.phone && (
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p className="text-sm font-bold text-blue-700">
                          Telepon
                        </p>
                        <p className="font-semibold text-gray-700">
                          {selectedApplicant.phone}
                        </p>
                      </div>
                    )}
                    {selectedApplicant.address && (
                      <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                        <p className="text-sm font-bold text-green-700">
                          Alamat
                        </p>
                        <p className="font-semibold text-gray-700">
                          {selectedApplicant.address}
                        </p>
                      </div>
                    )}
                    {selectedApplicant.date_of_birth && (
                      <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                        <p className="text-sm font-bold text-orange-700">
                          Tanggal Lahir
                        </p>
                        <p className="font-semibold text-gray-700">
                          {new Date(
                            selectedApplicant.date_of_birth
                          ).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    )}
                    {selectedApplicant.gender && (
                      <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                        <p className="text-sm font-bold text-green-700">
                          Jenis Kelamin
                        </p>
                        <p className="font-semibold text-gray-700">
                          {selectedApplicant.gender}
                        </p>
                      </div>
                    )}
                  </div>

                  {selectedApplicant.portfolios &&
                    selectedApplicant.portfolios.length > 0 && (
                      <div>
                        <p className="text-lg font-bold text-orange-600 mb-4">
                          Portfolio
                        </p>
                        <div className="space-y-3">
                          {selectedApplicant.portfolios.map((item) => (
                            <Card
                              key={item.id}
                              className="border-2 border-green-300 bg-gradient-to-r from-green-50 to-green-100"
                            >
                              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                                <CardTitle className="text-base font-bold">
                                  {item.skill}
                                </CardTitle>
                                {item.description && (
                                  <CardDescription className="text-green-100 text-pretty font-semibold">
                                    {item.description}
                                  </CardDescription>
                                )}
                              </CardHeader>
                              {item.file && (
                                <CardContent className="pt-4">
                                  <a
                                    href={item.file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 text-sm font-bold"
                                  >
                                    Lihat File
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </CardContent>
                              )}
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
