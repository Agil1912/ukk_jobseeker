"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { jobSeekerService } from "@/lib/services/jobseeker.service";
import { toast } from "sonner";
import { FileText, Building2, MapPin, Calendar, Clock } from "lucide-react";
import type {
  PositionApplied,
  AvailablePosition,
  Company,
  User,
} from "@/lib/api";

interface ApplicationWithDetails extends PositionApplied {
  position?: AvailablePosition & {
    company?: Company & {
      user?: User;
    };
  };
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationWithDetails[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await jobSeekerService.getMyApplications();
      setApplications(data);
    } catch (error) {
      toast.error("Gagal memuat histori lamaran");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <Badge className="bg-success text-success-foreground">Diterima</Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Ditolak</Badge>;
      default:
        return <Badge variant="secondary">Menunggu</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Histori Lamaran</h1>
          <p className="text-muted-foreground">
            Lacak status lamaran pekerjaan Anda
          </p>
        </div>

        {applications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Anda belum melamar pekerjaan apapun</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2">
                        {getStatusBadge(application.status)}
                      </div>
                      <CardTitle className="text-xl mb-2">
                        {application.position?.position_name ||
                          "Posisi tidak tersedia"}
                      </CardTitle>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {application.position?.company?.name || "Perusahaan"}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {application.position?.company?.address ||
                            "Lokasi tidak tersedia"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {application.position?.description && (
                    <CardDescription className="mb-4 text-pretty">
                      {application.position.description}
                    </CardDescription>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        Dilamar:{" "}
                        {new Date(application.apply_date).toLocaleDateString(
                          "id-ID"
                        )}
                      </span>
                    </div>
                    {application.position?.submission_end_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Berakhir:{" "}
                          {new Date(
                            application.position.submission_end_date
                          ).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
