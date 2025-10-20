"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { hrdService } from "@/lib/services/hrd.service"
import { toast } from "sonner"
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, ExternalLink, FileText } from "lucide-react"
import type { Job, Application, JobSeeker } from "@/lib/types"

export default function JobApplicationsPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string

  const [job, setJob] = useState<Job | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedApplicant, setSelectedApplicant] = useState<JobSeeker | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [jobId])

  const loadData = async () => {
    try {
      const applicationsData = await hrdService.getJobApplications(jobId)
      setApplications(applicationsData)
      if (applicationsData.length > 0 && applicationsData[0].job) {
        setJob(applicationsData[0].job)
      }
    } catch (error) {
      toast.error("Gagal memuat data pelamar")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (applicationId: string, status: "pending" | "accepted" | "rejected") => {
    setUpdating(applicationId)
    try {
      await hrdService.updateApplicationStatus(applicationId, status)
      toast.success("Status lamaran berhasil diperbarui")
      loadData()
    } catch (error) {
      toast.error("Gagal memperbarui status lamaran")
    } finally {
      setUpdating(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-success text-success-foreground">Diterima</Badge>
      case "rejected":
        return <Badge variant="destructive">Ditolak</Badge>
      default:
        return <Badge variant="secondary">Menunggu</Badge>
    }
  }

  const viewApplicantDetails = (applicant: JobSeeker) => {
    setSelectedApplicant(applicant)
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
        <div>
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/hrd/jobs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mb-2">Pelamar: {job?.position}</h1>
          <p className="text-muted-foreground">Kelola pelamar untuk posisi ini</p>
        </div>

        {job && (
          <Card>
            <CardHeader>
              <CardTitle>{job.position}</CardTitle>
              <CardDescription className="text-pretty">{job.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{job.location}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Gaji:</span>
                    <span>{job.salary}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Daftar Pelamar ({applications.length})</h2>
        </div>

        {applications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada pelamar untuk posisi ini</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                          <User className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{application.jobSeeker?.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {application.jobSeeker?.email}
                          </CardDescription>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm mb-4">
                        {application.jobSeeker?.phone && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            {application.jobSeeker.phone}
                          </div>
                        )}
                        {application.jobSeeker?.address && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {application.jobSeeker.address}
                          </div>
                        )}
                      </div>

                      {application.jobSeeker?.skills && application.jobSeeker.skills.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">Keahlian:</p>
                          <div className="flex flex-wrap gap-2">
                            {application.jobSeeker.skills.map((skill) => (
                              <Badge key={skill} variant="outline">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {application.jobSeeker?.bio && (
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-1">Bio:</p>
                          <p className="text-sm text-muted-foreground text-pretty">{application.jobSeeker.bio}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Dilamar: {new Date(application.appliedAt).toLocaleDateString("id-ID")}</span>
                        <span>Status: {getStatusBadge(application.status)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" onClick={() => viewApplicantDetails(application.jobSeeker!)}>
                        <Briefcase className="mr-2 h-4 w-4" />
                        Lihat Portfolio
                      </Button>
                      <Select
                        value={application.status}
                        onValueChange={(value: "pending" | "accepted" | "rejected") =>
                          handleStatusChange(application.id, value)
                        }
                        disabled={updating === application.id}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Ubah Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Menunggu</SelectItem>
                          <SelectItem value="accepted">Terima</SelectItem>
                          <SelectItem value="rejected">Tolak</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Applicant Details Dialog */}
        <Dialog open={!!selectedApplicant} onOpenChange={() => setSelectedApplicant(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detail Pelamar</DialogTitle>
              <DialogDescription>Informasi lengkap dan portfolio pelamar</DialogDescription>
            </DialogHeader>

            {selectedApplicant && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedApplicant.name}</h3>
                    <p className="text-muted-foreground">{selectedApplicant.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedApplicant.phone && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Telepon</p>
                      <p>{selectedApplicant.phone}</p>
                    </div>
                  )}
                  {selectedApplicant.address && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Alamat</p>
                      <p>{selectedApplicant.address}</p>
                    </div>
                  )}
                </div>

                {selectedApplicant.bio && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Bio</p>
                    <p className="text-pretty">{selectedApplicant.bio}</p>
                  </div>
                )}

                {selectedApplicant.skills && selectedApplicant.skills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Keahlian</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplicant.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedApplicant.portfolio && selectedApplicant.portfolio.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-3">Portfolio</p>
                    <div className="space-y-3">
                      {selectedApplicant.portfolio.map((item) => (
                        <Card key={item.id}>
                          <CardHeader>
                            <CardTitle className="text-base">{item.title}</CardTitle>
                            <CardDescription className="text-pretty">{item.description}</CardDescription>
                          </CardHeader>
                          {item.link && (
                            <CardContent>
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center gap-1 text-sm"
                              >
                                Lihat Project
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </CardContent>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
