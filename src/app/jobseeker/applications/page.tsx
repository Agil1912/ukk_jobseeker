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
          <Badge className="bg-green-500 hover:bg-green-600 text-white font-bold">
            ✓ Diterima
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-bold">
            ✕ Ditolak
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-bold">
            ⏳ Menunggu
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-blue-50 via-green-50 to-orange-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-blue-200 rounded w-1/3"></div>
            <div className="h-64 bg-gradient-to-r from-blue-100 to-orange-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-blue-50 via-green-50 to-orange-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white shadow-lg">
          <h1 className="text-4xl font-black mb-2">Histori Lamaran</h1>
          <p className="text-blue-100 font-semibold text-lg">
            Lacak status lamaran pekerjaan Anda dengan mudah
          </p>
        </div>

        {applications.length === 0 ? (
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardContent className="py-12 text-center bg-gradient-to-b from-blue-50 to-white">
              <FileText className="h-16 w-16 mx-auto mb-4 text-blue-400" />
              <p className="text-lg font-bold text-gray-600">
                Anda belum melamar pekerjaan apapun
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Mulai jelajahi peluang karir yang tersedia
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {applications.map((application) => (
              <Card
                key={application.id}
                className="border-2 border-blue-200 shadow-lg hover:shadow-xl transition-shadow bg-white"
              >
                <CardHeader className="bg-gradient-to-r from-blue-50 via-green-50 to-orange-50 border-b-2 border-blue-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-3">{getStatusBadge(application.status)}</div>
                      <CardTitle className="text-2xl mb-3 font-black text-gray-800">
                        {application.position?.position_name ||
                          "Posisi tidak tersedia"}
                      </CardTitle>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 font-semibold text-blue-700">
                          <Building2 className="h-4 w-4" />
                          {application.position?.company?.name || "Perusahaan"}
                        </div>
                        <div className="flex items-center gap-2 font-semibold text-green-700">
                          <MapPin className="h-4 w-4" />
                          {application.position?.company?.address ||
                            "Lokasi tidak tersedia"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {application.position?.description && (
                    <CardDescription className="mb-4 text-pretty text-gray-700 font-medium text-base">
                      {application.position.description}
                    </CardDescription>
                  )}
                  <div className="flex flex-wrap items-center gap-6 text-sm bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 font-bold text-blue-700">
                      <Clock className="h-4 w-4" />
                      <span>
                        Dilamar:{" "}
                        {new Date(application.apply_date).toLocaleDateString(
                          "id-ID"
                        )}
                      </span>
                    </div>
                    {application.position?.submission_end_date && (
                      <div className="flex items-center gap-2 font-bold text-orange-700">
                        <Calendar className="h-4 w-4" />
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
