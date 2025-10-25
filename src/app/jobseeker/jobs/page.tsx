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

    // Check if the position is still open
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
          <h1 className="text-3xl font-bold mb-2">Cari Pekerjaan</h1>
          <p className="text-muted-foreground">
            Temukan pekerjaan impian Anda dari ribuan lowongan tersedia
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari posisi, perusahaan, atau deskripsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan {filteredJobs.length} lowongan{" "}
            {searchTerm ? "yang sesuai" : ""}
          </p>
        </div>

        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Tidak ada lowongan yang sesuai dengan pencarian Anda</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">Aktif</Badge>
                        <Badge variant="outline">
                          Kapasitas: {job.capacity}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">
                        {job.position_name}
                      </CardTitle>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {job.company?.name || "Perusahaan"}
                        </div>
                        {job.company?.address && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.company.address}
                          </div>
                        )}
                        {job.salary && (
                          <div className="flex items-center gap-1">
                            <span className="font-semibold">💰</span>
                            Rp {job.salary.toLocaleString("id-ID")}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button onClick={() => handleApply(job.id)}>
                      Lamar Sekarang
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-pretty">
                    {job.description}
                  </CardDescription>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
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
  );
}
