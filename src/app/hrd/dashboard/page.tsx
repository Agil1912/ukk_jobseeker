"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { hrdService } from "@/lib/services/hrd.service"
import { toast } from "sonner"
import { Briefcase, FileText, Clock, Building2, Plus, TrendingUp } from "lucide-react"
import { withAuth } from "@/components/with-auth"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import type { HRD, Job } from "@/lib/types"

function HRDDashboardPage() {
  // Auth guard to ensure only HRD users can access this page
  const { isAuthorized, loading: authLoading } = useAuthGuard({ requiredRole: "HRD" })
  
  const [profile, setProfile] = useState<HRD | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [profileData, jobsData, statsData] = await Promise.all([
        hrdService.getProfile(),
        hrdService.getMyJobs(),
        hrdService.getDashboardStats(),
      ])
      setProfile(profileData)
      setJobs(jobsData)
      setStats(statsData)
    } catch (error) {
      toast.error("Gagal memuat data dashboard")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard HRD</h1>
            <p className="text-muted-foreground">Selamat datang, {profile?.companyName}</p>
          </div>
          <Button asChild>
            <Link href="/hrd/jobs/new">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Lowongan
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Lowongan</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalJobs}</p>
                </div>
                <Briefcase className="h-10 w-10 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Lowongan Aktif</p>
                  <p className="text-3xl font-bold mt-2">{stats.activeJobs}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-success opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Pelamar</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalApplications}</p>
                </div>
                <FileText className="h-10 w-10 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Menunggu Review</p>
                  <p className="text-3xl font-bold mt-2">{stats.pendingApplications}</p>
                </div>
                <Clock className="h-10 w-10 text-warning opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Company Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>{profile?.companyName}</CardTitle>
                <CardDescription>{profile?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          {(profile?.companyAddress || profile?.companyDescription) && (
            <CardContent className="space-y-3">
              {profile?.companyAddress && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Alamat</p>
                  <p>{profile.companyAddress}</p>
                </div>
              )}
              {profile?.companyDescription && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Deskripsi</p>
                  <p className="text-pretty">{profile.companyDescription}</p>
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Recent Jobs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Lowongan Terbaru</h2>
            <Button variant="outline" asChild>
              <Link href="/hrd/jobs">Lihat Semua</Link>
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
              {jobs.slice(0, 5).map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={job.isActive ? "secondary" : "outline"}>
                            {job.isActive ? "Aktif" : "Tidak Aktif"}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl">{job.position}</CardTitle>
                        <CardDescription className="mt-2 text-pretty">{job.description}</CardDescription>
                      </div>
                      <Button variant="outline" asChild>
                        <Link href={`/hrd/jobs/${job.id}`}>Lihat Detail</Link>
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Export the component wrapped with auth protection
export default withAuth(HRDDashboardPage, { requiredRole: "HRD" })
