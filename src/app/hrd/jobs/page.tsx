"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { hrdService } from "@/lib/services/hrd.service"
import { toast } from "sonner"
import { Plus, Briefcase, MapPin, Calendar, Edit, Trash2 } from "lucide-react"
import type { Job } from "@/lib/types"

export default function HRDJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const data = await hrdService.getMyJobs()
      setJobs(data)
    } catch (error) {
      toast.error("Gagal memuat lowongan kerja")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus lowongan ini?")) return

    try {
      await hrdService.deleteJob(id)
      toast.success("Lowongan berhasil dihapus")
      loadJobs()
    } catch (error) {
      toast.error("Gagal menghapus lowongan")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Kelola Lowongan</h1>
            <p className="text-muted-foreground">Kelola semua lowongan pekerjaan perusahaan Anda</p>
          </div>
          <Button asChild>
            <Link href="/hrd/jobs/new">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Lowongan
            </Link>
          </Button>
        </div>

        {jobs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-4">Belum ada lowongan kerja</p>
              <Button asChild>
                <Link href="/hrd/jobs/new">Tambah Lowongan Pertama</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={job.isActive ? "secondary" : "outline"}>
                          {job.isActive ? "Aktif" : "Tidak Aktif"}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">{job.position}</CardTitle>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(job.startDate).toLocaleDateString("id-ID")} -{" "}
                          {new Date(job.endDate).toLocaleDateString("id-ID")}
                        </div>
                      </div>
                      <CardDescription className="text-pretty">{job.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/hrd/jobs/${job.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(job.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      <Button asChild>
                        <Link href={`/hrd/jobs/${job.id}`}>Lihat Pelamar</Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
