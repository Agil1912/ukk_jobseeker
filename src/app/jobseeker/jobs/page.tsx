"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search, MapPin, Building2, Calendar, Briefcase } from "lucide-react";
import type { AvailablePosition } from "@/lib/api";

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<AvailablePosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await jobSeekerService.getJobs();
      setJobs(data);
    } catch (error) {
      toast.error("Gagal memuat lowongan kerja");
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.position_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    const now = new Date();
    const endDate = new Date(job.submission_end_date);
    const isOpen = endDate >= now;

    return matchesSearch && isOpen;
  });

  const handleApply = async (jobId: string) => {
    try {
      await jobSeekerService.applyToJob(jobId);
      toast.success("Lamaran berhasil dikirim!");
      router.push("/jobseeker/applications");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal mengirim lamaran");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-blue-50 via-orange-50 to-green-50 min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-blue-200 rounded w-1/3"></div>
          <div className="h-64 bg-orange-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-orange-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 shadow-lg">
            <h1 className="text-4xl font-black text-white mb-3">
              Cari Pekerjaan
            </h1>
            <p className="text-white font-semibold text-lg">
              Temukan pekerjaan impian Anda dari ribuan lowongan tersedia
            </p>
          </div>

          {/* Search Card */}
          <Card className="border-2 border-orange-300 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6 bg-gradient-to-r from-orange-50 to-orange-100">
              <div className="relative  bg-gradient-to-r from-orange-50 to-orange-100">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-600 font-bold" />
                <Input
                  placeholder="Cari posisi, perusahaan, atau deskripsi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-orange-400 focus:border-orange-600  bg-gradient-to-r from-orange-50 to-orange-100 font-semibold text-black py-6"
                />
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="flex items-center justify-between bg-green-100 rounded-lg p-4 border-2 border-green-400">
            <p className="text-base font-bold text-black">
              Menampilkan {filteredJobs.length} lowongan{" "}
              {searchTerm ? "yang sesuai" : ""}
            </p>
          </div>

          {/* No Results */}
          {filteredJobs.length === 0 ? (
            <Card className="border-2 border-red-300 shadow-lg">
              <CardContent className="py-12 text-center bg-red-50">
                <Briefcase className="h-16 w-16 mx-auto mb-4 opacity-60 text-red-600" />
                <p className="font-bold text-black text-lg">
                  Tidak ada lowongan yang sesuai dengan pencarian Anda
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  className="border-2 border-blue-300 hover:shadow-xl transition-all hover:border-blue-500 bg-white overflow-hidden"
                >
                  <div className="h-1  bg-blue-600"></div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-blue-500 hover:bg-blue-600 font-bold text-white">
                            Aktif
                          </Badge>
                          <Badge className="bg-orange-500 hover:bg-orange-600 font-bold text-white">
                            Kapasitas: {job.capacity}
                          </Badge>
                        </div>
                        <CardTitle className="text-2xl font-black text-black mb-3">
                          {job.position_name}
                        </CardTitle>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2 font-bold text-black">
                            <Building2 className="h-5 w-5 text-blue-600" />
                            {job.company?.name || "Perusahaan"}
                          </div>
                          {job.company?.address && (
                            <div className="flex items-center gap-2 font-bold text-black">
                              <MapPin className="h-5 w-5 text-orange-600" />
                              {job.company.address}
                            </div>
                          )}
                          {job.salary && (
                            <div className="flex items-center gap-2 font-bold text-black">
                              <span className="text-xl">💰</span>
                              Rp {job.salary.toLocaleString("id-ID")}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleApply(job.id)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-black text-base px-6 py-6 h-auto"
                      >
                        Lamar Sekarang
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="bg-blue-50">
                    <CardDescription className="mb-4 text-pretty font-semibold text-black text-base">
                      {job.description}
                    </CardDescription>
                    <div className="flex items-center gap-2 text-sm font-bold text-black bg-orange-100 p-3 rounded-lg border border-orange-300">
                      <Calendar className="h-5 w-5 text-orange-600" />
                      <span>
                        Periode Pendaftaran:{" "}
                        {new Date(job.submission_start_date).toLocaleDateString(
                          "id-ID"
                        )}{" "}
                        -{" "}
                        {new Date(job.submission_end_date).toLocaleDateString(
                          "id-ID"
                        )}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
