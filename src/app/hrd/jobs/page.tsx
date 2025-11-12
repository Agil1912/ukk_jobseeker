"use client";

import { useState, useEffect } from "react";
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
import { hrdService } from "@/lib/services/hrd.service";
import { toast } from "sonner";
import { Plus, Briefcase, MapPin, Calendar, Edit, Trash2 } from "lucide-react";
import type { AvailablePosition } from "@/lib/api";

export default function HRDJobsPage() {
  const [jobs, setJobs] = useState<AvailablePosition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await hrdService.getMyJobs();
      setJobs(data);
    } catch (error) {
      toast.error("Gagal memuat lowongan kerja");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus lowongan ini?")) return;

    try {
      await hrdService.deleteJob(id);
      toast.success("Lowongan berhasil dihapus");
      loadJobs();
    } catch (error) {
      toast.error("Gagal menghapus lowongan");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-blue-50 via-green-50 to-orange-50 min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-blue-200 rounded w-1/3"></div>
          <div className="h-64 bg-gradient-to-r from-blue-200 to-green-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-green-50 to-orange-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-orange-600  to-orange-600 bg-clip-text text-transparent mb-2">
                Kelola Lowongan
              </h1>
              <p className="text-gray-600 font-semibold">
                Kelola semua lowongan pekerjaan perusahaan Anda
              </p>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold shadow-lg"
            >
              <Link href="/hrd/jobs/new">
                <Plus className="mr-2 h-5 w-5" />
                Tambah Lowongan
              </Link>
            </Button>
          </div>

          {jobs.length === 0 ? (
            <Card className="border-2 border-blue-200 shadow-xl bg-white">
              <CardContent className="py-16 text-center">
                <Briefcase className="h-16 w-16 mx-auto mb-4 text-blue-400" />
                <p className="mb-6 text-gray-700 font-bold text-lg">
                  Belum ada lowongan kerja
                </p>
                <Button
                  asChild
                  className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold"
                >
                  <Link href="/hrd/jobs/new">Tambah Lowongan Pertama</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-5">
              {jobs.map((job) => {
                const endDate = new Date(job.submission_end_date);
                const isActive = endDate >= new Date();

                return (
                  <Card
                    key={job.id}
                    className="border-2 border-blue-300 shadow-xl hover:shadow-2xl transition-shadow bg-white overflow-hidden"
                  >
                    <div className="h-2 bg-gradient-to-r from-orange-700 to-orange-600"></div>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge
                              className={`font-bold text-sm ${
                                isActive
                                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                                  : "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                              }`}
                            >
                              {isActive ? "✓ Aktif" : "✗ Tidak Aktif"}
                            </Badge>
                          </div>
                          <CardTitle className="text-2xl mb-3 font-black text-blue-700">
                            {job.position_name}
                          </CardTitle>
                          <div className="flex flex-wrap gap-5 text-sm mb-4">
                            <div className="flex items-center gap-2 font-semibold text-gray-700 bg-blue-100 px-3 py-1 rounded-lg">
                              <MapPin className="h-5 w-5 text-blue-600" />
                              {job.company?.address || "Lokasi tidak tersedia"}
                            </div>
                            <div className="flex items-center gap-2 font-semibold text-gray-700 bg-green-100 px-3 py-1 rounded-lg">
                              <Calendar className="h-5 w-5 text-green-600" />
                              {new Date(
                                job.submission_start_date
                              ).toLocaleDateString("id-ID")}{" "}
                              -{" "}
                              {new Date(
                                job.submission_end_date
                              ).toLocaleDateString("id-ID")}
                            </div>
                            {job.salary && (
                              <div className="flex items-center gap-2 font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-1 rounded-lg">
                                💰 Rp {job.salary.toLocaleString("id-ID")}
                              </div>
                            )}
                          </div>
                          <CardDescription className="text-pretty font-semibold text-gray-600 leading-relaxed">
                            {job.description}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2 flex-col">
                          <Button
                            variant="outline"
                            size="icon"
                            asChild
                            className="border-2 border-blue-300 bg-white hover:bg-blue-100 font-bold"
                          >
                            <Link href={`/hrd/jobs/${job.id}/edit`}>
                              <Edit className="h-5 w-5 text-blue-600" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(job.id)}
                            className="border-2 border-orange-300 bg-white hover:bg-orange-100 font-bold"
                          >
                            <Trash2 className="h-5 w-5 text-orange-600" />
                          </Button>
                          <Button
                            asChild
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold"
                          >
                            <Link href={`/hrd/jobs/${job.id}`}>
                              Lihat Pelamar
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
