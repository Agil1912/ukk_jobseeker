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

      // Fetch job details separately if needed
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
          <Badge className="bg-success text-success-foreground">Diterima</Badge>
        );
      case "REJECTED":
        return <Badge variant="destructive">Ditolak</Badge>;
      default:
        return <Badge variant="secondary">Menunggu</Badge>;
    }
  };

  const viewApplicantDetails = (applicant: SocietyWithDetails) => {
    setSelectedApplicant(applicant);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/hrd/jobs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mb-2">
            Pelamar: {job?.position_name}
          </h1>
          <p className="text-muted-foreground">
            Kelola pelamar untuk posisi ini
          </p>
        </div>

        {job && (
          <Card>
            <CardHeader>
              <CardTitle>{job.position_name}</CardTitle>
              <CardDescription className="text-pretty">
                {job.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{job.company?.address || "Lokasi tidak tersedia"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Kapasitas:</span>
                  <span>{job.capacity} orang</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">💰</span>
                    <span>Rp {job.salary.toLocaleString("id-ID")}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Daftar Pelamar ({applications.length})
          </h2>
        </div>

        {applications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada pelamar untuk posisi ini</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                          <User className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">
                            {application.society?.name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {application.society?.user?.email}
                          </CardDescription>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm mb-4">
                        {application.society?.phone && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            {application.society.phone}
                          </div>
                        )}
                        {application.society?.address && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {application.society.address}
                          </div>
                        )}
                      </div>

                      {application.society?.portfolios &&
                        application.society.portfolios.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium mb-2">
                              Portfolio:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {application.society.portfolios.map(
                                (portfolio) => (
                                  <Badge key={portfolio.id} variant="outline">
                                    {portfolio.skill}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          Dilamar:{" "}
                          {new Date(application.apply_date).toLocaleDateString(
                            "id-ID"
                          )}
                        </span>
                        <span>
                          Status: {getStatusBadge(application.status)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
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
                        <SelectTrigger className="w-[180px]">
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
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detail Pelamar</DialogTitle>
              <DialogDescription>
                Informasi lengkap dan portfolio pelamar
              </DialogDescription>
            </DialogHeader>

            {selectedApplicant && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedApplicant.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedApplicant.user?.email || "Email tidak tersedia"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedApplicant.phone && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Telepon
                      </p>
                      <p>{selectedApplicant.phone}</p>
                    </div>
                  )}
                  {selectedApplicant.address && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Alamat
                      </p>
                      <p>{selectedApplicant.address}</p>
                    </div>
                  )}
                  {selectedApplicant.date_of_birth && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Tanggal Lahir
                      </p>
                      <p>
                        {new Date(
                          selectedApplicant.date_of_birth
                        ).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  )}
                  {selectedApplicant.gender && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Jenis Kelamin
                      </p>
                      <p>{selectedApplicant.gender}</p>
                    </div>
                  )}
                </div>

                {selectedApplicant.portfolios &&
                  selectedApplicant.portfolios.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-3">
                        Portfolio
                      </p>
                      <div className="space-y-3">
                        {selectedApplicant.portfolios.map((item) => (
                          <Card key={item.id}>
                            <CardHeader>
                              <CardTitle className="text-base">
                                {item.skill}
                              </CardTitle>
                              {item.description && (
                                <CardDescription className="text-pretty">
                                  {item.description}
                                </CardDescription>
                              )}
                            </CardHeader>
                            {item.file && (
                              <CardContent>
                                <a
                                  href={item.file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline flex items-center gap-1 text-sm"
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
  );
}
