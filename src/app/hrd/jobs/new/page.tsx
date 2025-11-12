"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { ArrowLeft, Briefcase } from "lucide-react";
import Link from "next/link";

export default function NewJobPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    position_name: "",
    description: "",
    capacity: "",
    salary: "",
    submission_start_date: "",
    submission_end_date: "",
  });

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

      await hrdService.createJob(jobData);
      toast.success("Lowongan berhasil ditambahkan");
      router.push("/hrd/jobs");
    } catch (error) {
      toast.error("Gagal menambahkan lowongan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="space-y-4">
            <Button
              variant="ghost"
              asChild
              className="mb-4 text-blue-600 hover:bg-blue-100 font-bold hover:text-blue-700"
            >
              <Link href="/hrd/jobs">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Kembali
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-orange-600">
                  Tambah Lowongan Baru
                </h1>
                <p className="text-orange-600 font-semibold mt-1">
                  Buat lowongan pekerjaan baru untuk perusahaan Anda
                </p>
              </div>
            </div>
          </div>

          <Card className="border-0 shadow-xl bg-white">
            <CardHeader className="bg-gradient-to-r from-orange-500  to-orange-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-black">
                Informasi Lowongan
              </CardTitle>
              <CardDescription className="text-blue-50 font-semibold">
                Isi detail lowongan pekerjaan yang akan dipublikasikan
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="position"
                    className="text-orange-600 font-bold text-base"
                  >
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
                    required
                    className="border-2 border-blue-200 focus:border-orange-500 focus:ring-orange-500 font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-orange-600 font-bold text-base"
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
                    required
                    className="border-2 border-blue-200 focus:border-orange-500 focus:ring-orange-500 font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="capacity"
                    className="text-orange-600 font-bold text-base"
                  >
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
                    required
                    className="border-2 border-blue-200 focus:border-orange-500 focus:ring-orange-500 font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="salary"
                    className="text-orange-600 font-bold text-base"
                  >
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
                    className="border-2 border-blue-200 focus:border-orange-500 focus:ring-orange-500 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="startDate"
                      className="text-orange-600 font-bold text-base"
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
                      required
                      className="border-2 border-blue-200 focus:border-orange-500 focus:ring-orange-500 font-semibold"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="endDate"
                      className="text-orange-600 font-bold text-base"
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
                      required
                      className="border-2 border-blue-200 focus:border-orange-500 focus:ring-orange-500 font-semibold"
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="border-2 bg-blue-600 border-blue-300 text-white hover:bg-blue-50 font-bold"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-black text-base px-6"
                  >
                    {saving ? "Menyimpan..." : "Simpan Lowongan"}
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
