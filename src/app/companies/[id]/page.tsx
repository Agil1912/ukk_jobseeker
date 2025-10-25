"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  Phone,
  Briefcase,
  ArrowLeft,
  Calendar,
  Users,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { companyService } from "@/lib/services/company.service";
import { toast } from "sonner";
import type { Company, AvailablePosition } from "@/lib/api";

interface CompanyWithDetails extends Company {
  user?: {
    image?: string;
  };
}

interface PositionWithCount extends AvailablePosition {
  company?: Company;
  _count?: {
    applications: number;
  };
}

export default function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [company, setCompany] = useState<CompanyWithDetails | null>(null);
  const [positions, setPositions] = useState<PositionWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch company details
        const companyData = await companyService.getById(resolvedParams.id);
        if (companyData) {
          setCompany(companyData);
        } else {
          toast.error("Perusahaan tidak ditemukan");
          router.push("/companies");
          return;
        }

        // Fetch positions using the dedicated endpoint
        const positionsData = await companyService.getCompanyPositions(
          resolvedParams.id
        );
        if (positionsData) {
          setPositions(positionsData as PositionWithCount[]);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
        toast.error("Gagal memuat detail perusahaan");
        router.push("/companies");
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [resolvedParams.id, router]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-center">Memuat detail perusahaan...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-center">Perusahaan tidak ditemukan</p>
      </div>
    );
  }

  const activePositions = positions.filter((pos) => {
    const endDate = new Date(pos.submission_end_date);
    return endDate >= new Date() && pos.submission_start_date;
  });

  const closedPositions = positions.filter((pos) => {
    const endDate = new Date(pos.submission_end_date);
    return endDate < new Date() || !pos.submission_start_date;
  });

  return (
    <div className="container mx-auto space-y-6 py-8 px-4">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/companies">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Daftar Perusahaan
        </Link>
      </Button>

      {/* Company Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Company Logo */}
            {company.user?.image ? (
              <img
                src={company.user.image}
                alt={company.name}
                className="h-24 w-24 rounded-lg object-cover"
              />
            ) : (
              <div className="bg-primary/10 flex h-24 w-24 items-center justify-center rounded-lg">
                <Building2 className="text-primary h-12 w-12" />
              </div>
            )}

            {/* Company Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
                <div className="flex flex-wrap gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{company.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{company.phone}</span>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground">{company.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Lowongan
            </CardTitle>
            <Briefcase className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positions.length}</div>
            <p className="text-muted-foreground text-xs">Posisi tersedia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lowongan Aktif
            </CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePositions.length}</div>
            <p className="text-muted-foreground text-xs">Masih bisa dilamar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pelamar</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {positions.reduce(
                (acc, pos) => acc + (pos._count?.applications ?? 0),
                0
              )}
            </div>
            <p className="text-muted-foreground text-xs">Pelamar terdaftar</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Positions */}
      <Card>
        <CardHeader>
          <CardTitle>Lowongan Aktif</CardTitle>
        </CardHeader>
        <CardContent>
          {activePositions.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              <Briefcase className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>Tidak ada lowongan aktif saat ini</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activePositions.map((position) => {
                const endDate = new Date(position.submission_end_date);
                const applicantCount = position._count?.applications ?? 0;

                return (
                  <Card
                    key={position.id}
                    className="border-l-4 border-l-green-500"
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <h3 className="text-lg font-semibold">
                              {position.position_name}
                            </h3>
                            <Badge
                              variant="outline"
                              className="border-green-200 bg-green-50 text-green-700"
                            >
                              Aktif
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-2 text-sm line-clamp-2">
                            {position.description}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{company.address}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Berakhir:{" "}
                                {endDate.toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{applicantCount} pelamar</span>
                            </div>
                          </div>
                        </div>
                        <Button asChild>
                          <Link href={`/jobseeker/jobs/${position.id}`}>
                            Lihat Detail
                            <ExternalLink className="ml-2 h-4 w-4" />
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

      {/* Closed Positions */}
      {closedPositions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Lowongan Ditutup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {closedPositions.map((position) => {
                const endDate = new Date(position.submission_end_date);
                const applicantCount = position._count?.applications ?? 0;

                return (
                  <Card
                    key={position.id}
                    className="border-l-4 border-l-gray-300 opacity-60"
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <h3 className="text-lg font-semibold">
                              {position.position_name}
                            </h3>
                            <Badge
                              variant="outline"
                              className="border-gray-200 bg-gray-50 text-gray-700"
                            >
                              Ditutup
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-2 text-sm line-clamp-2">
                            {position.description}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{company.address}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Berakhir:{" "}
                                {endDate.toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{applicantCount} pelamar</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
