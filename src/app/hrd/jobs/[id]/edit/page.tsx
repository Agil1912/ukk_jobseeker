"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { hrdService } from "@/lib/services/hrd.service";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    position_name: "",
    description: "",
    capacity: "",
    salary: "",
    submission_start_date: "",
    submission_end_date: "",
  });

  useEffect(() => {
    loadJob();
  }, [jobId]);

  const loadJob = async () => {
    try {
      const jobs = await hrdService.getMyJobs();
      const job = jobs.find((j) => j.id === jobId);
      if (job) {
        setFormData({
          position_name: job.position_name,
          description: job.description,
          capacity: job.capacity.toString(),
          salary: job.salary ? job.salary.toString() : "",
          submission_start_date: job.submission_start_date.split("T")[0],
          submission_end_date: job.submission_end_date.split("T")[0],
        });
      }
    } catch (error) {
      toast.error("Gagal memuat data lowongan");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const jobData = {
        position_name: formData.position_name,
        description: formData.description,
        capacity: parseInt(formData.capacity),
        salary: formData.salary ? parseInt(formData.salary) : undefined,
        submission_start_date: formData.submission_start_date,
        submission_end_date: formData.submission_end_date,
      };

      await hrdService.updateJob(jobId, jobData);
      toast.success("Lowongan berhasil diperbarui");
      router.push("/hrd/jobs");
    } catch (error) {
      toast.error("Gagal memperbarui lowongan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-blue-200 rounded w-1/3"></div>
              <div className="h-96 bg-orange-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="space-y-3">
            <Button
              variant="ghost"
              asChild
              className="mb-4 text-blue-600 hover:text-blue-700 hover:bg-blue-100 font-bold"
            >
              <Link href="/hrd/jobs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Link>
            </Button>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-orange-600  bg-clip-text text-transparent">
              Edit Lowongan
            </h1>
            <p className="text-gray-600 font-semibold mt-2">
              Perbarui informasi lowongan pekerjaan
            </p>
          </div>

          <Card className="border-2 border-orange-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
              <CardTitle className="text-xl font-bold">
                Informasi Lowongan
              </CardTitle>
              <CardDescription className="text-blue-100 font-semibold">
                Edit detail lowongan pekerjaan
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="position" className="font-bold text-gray-700">
                    Posisi
                  </Label>
                  <Input
                    id="position"
                    placeholder="Contoh: Frontend Developer"
                    value={formData.position_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        position_name: e.target.value,
                      })
                    }
                    className="border-2 border-orange-300 focus:border-orange-500 font-semibold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="font-bold text-gray-700"
                  >
                    Deskripsi Pekerjaan
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Jelaskan tentang pekerjaan ini..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className="border-2 border-orange-300 focus:border-orange-500 font-semibold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity" className="font-bold text-gray-700">
                    Kapasitas/Jumlah Lowongan
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    placeholder="Contoh: 5"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                    className="border-2 border-orange-300 focus:border-orange-500 font-semibold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary" className="font-bold text-gray-700">
                    Gaji (Opsional)
                  </Label>
                  <Input
                    id="salary"
                    type="number"
                    placeholder="Contoh: 5000000"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData({ ...formData, salary: e.target.value })
                    }
                    min="0"
                    className="border-2 border-orange-300 focus:border-orange-500 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="startDate"
                      className="font-bold text-gray-700"
                    >
                      Tanggal Mulai Pendaftaran
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.submission_start_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          submission_start_date: e.target.value,
                        })
                      }
                      className="border-2 border-orange-300 focus:border-orange-500 font-semibold"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="endDate"
                      className="font-bold text-gray-700"
                    >
                      Tanggal Berakhir Pendaftaran
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.submission_end_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          submission_end_date: e.target.value,
                        })
                      }
                      className="border-2 border-orange-300 focus:border-orange-500 font-semibold"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="border-2 border-gray-400 bg-blue-700 text-white font-bold hover:bg-gray-100"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold disabled:opacity-50"
                  >
                    {saving ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
