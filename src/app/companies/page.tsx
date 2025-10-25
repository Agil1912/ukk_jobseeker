"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  Phone,
  Briefcase,
  Search,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { companyService } from "@/lib/services/company.service";
import { toast } from "sonner";
import type { Company, Job } from "@/lib/types";

interface CompanyWithDetails extends Omit<Company, "available_positions"> {
  user?: {
    image?: string;
  };
  _count?: {
    available_positions?: number;
  };
  available_positions?: Job[];
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState<
    CompanyWithDetails[]
  >([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await companyService.getAll();
        console.log("Companies API Response:", response);

        if (response) {
          // Fetch positions count for each company using the dedicated endpoint
          const companiesWithCounts = await Promise.all(
            response.map(async (company) => {
              try {
                // Fetch positions for this company
                const positionsData = await companyService.getCompanyPositions(
                  company.id
                );

                console.log(`Positions for ${company.name}:`, positionsData);

                // Simply count the array length - how many positions this company has
                const positionsCount = Array.isArray(positionsData)
                  ? positionsData.length
                  : 0;

                console.log(
                  `Company ${company.name} has ${positionsCount} positions`
                );

                return {
                  ...company,
                  _count: {
                    available_positions: positionsCount,
                  },
                  available_positions: positionsData ?? [],
                } as CompanyWithDetails;
              } catch (error) {
                console.error(
                  `Error fetching positions for company ${company.id}:`,
                  error
                );
                return {
                  ...company,
                  _count: { available_positions: 0 },
                  available_positions: [],
                } as CompanyWithDetails;
              }
            })
          );

          console.log("Companies with counts:", companiesWithCounts);
          setCompanies(companiesWithCounts);
          setFilteredCompanies(companiesWithCounts);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
        toast.error(
          `Gagal memuat daftar perusahaan: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchCompanies();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCompanies(companies);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = companies.filter(
        (company) =>
          company.name.toLowerCase().includes(query) ||
          company.address.toLowerCase().includes(query) ||
          company.description.toLowerCase().includes(query)
      );
      setFilteredCompanies(filtered);
    }
  }, [searchQuery, companies]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-center">Memuat data perusahaan...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 py-8 px-4">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Daftar Perusahaan</h1>
        <p className="text-muted-foreground">
          Jelajahi perusahaan-perusahaan yang terdaftar di platform kami
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Cari perusahaan berdasarkan nama, lokasi, atau deskripsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Perusahaan
            </CardTitle>
            <Building2 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.length}</div>
            <p className="text-muted-foreground text-xs">
              Perusahaan terdaftar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hasil Pencarian
            </CardTitle>
            <Search className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredCompanies.length}</div>
            <p className="text-muted-foreground text-xs">
              Perusahaan ditemukan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lowongan Aktif
            </CardTitle>
            <Briefcase className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {companies.reduce((acc, company) => {
                // Try _count first, fallback to array length
                const count =
                  company._count?.available_positions ??
                  company.available_positions?.length ??
                  0;
                return acc + count;
              }, 0)}
            </div>
            <p className="text-muted-foreground text-xs">Posisi tersedia</p>
          </CardContent>
        </Card>
      </div>

      {/* Companies Grid */}
      {filteredCompanies.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-muted-foreground text-center">
              <Building2 className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p className="text-lg font-medium">
                Tidak ada perusahaan ditemukan
              </p>
              <p className="text-sm">Coba ubah kata kunci pencarian Anda</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => (
            <Card
              key={company.id}
              className="transition-shadow duration-200 hover:shadow-lg"
            >
              <CardContent className="p-6">
                {/* Company Header */}
                <div className="mb-4 flex items-start gap-4">
                  {company.user?.image ? (
                    <img
                      src={company.user.image}
                      alt={company.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-lg">
                      <Building2 className="text-primary h-8 w-8" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="mb-1 line-clamp-1 text-lg font-semibold">
                      {company.name}
                    </h3>
                    {(() => {
                      // Try _count first, fallback to array length
                      const positionCount =
                        company._count?.available_positions ??
                        company.available_positions?.length ??
                        0;

                      return positionCount > 0 ? (
                        <Badge
                          variant="outline"
                          className="border-green-200 bg-green-50 text-green-700"
                        >
                          <Briefcase className="mr-1 h-3 w-3" />
                          {positionCount} Lowongan
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-gray-200 bg-gray-50 text-gray-700"
                        >
                          Tidak ada lowongan
                        </Badge>
                      );
                    })()}
                  </div>
                </div>

                {/* Company Info */}
                <div className="mb-4 space-y-2">
                  <div className="text-muted-foreground flex items-start gap-2 text-sm">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span className="line-clamp-2">{company.address}</span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>{company.phone}</span>
                  </div>
                </div>

                {/* Company Description */}
                <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
                  {company.description}
                </p>

                {/* Action Button */}
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/companies/${company.id}`}>
                    Lihat Detail
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
