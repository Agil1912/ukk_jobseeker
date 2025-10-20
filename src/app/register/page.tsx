"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { authService } from "@/lib/auth"
import { toast } from "sonner"
import { Briefcase, User, Building2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("jobseeker")

  const [jobSeekerData, setJobSeekerData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [hrdData, setHRDData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyAddress: "",
    companyDescription: "",
  })

  useEffect(() => {
    const type = searchParams.get("type")
    if (type === "hrd") {
      setActiveTab("hrd")
    }
  }, [searchParams])

  const handleJobSeekerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (jobSeekerData.password !== jobSeekerData.confirmPassword) {
      toast.error("Password dan konfirmasi password tidak cocok")
      return
    }

    setLoading(true)
    try {
      await authService.registerJobSeeker(jobSeekerData)
      console.log(jobSeekerData);
      toast.success("Registrasi berhasil! Selamat datang di JobSeeker.")
      router.push("/jobseeker/jobs")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registrasi gagal. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  const handleHRDSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (hrdData.password !== hrdData.confirmPassword) {
      toast.error("Password dan konfirmasi password tidak cocok")
      return
    }

    setLoading(true)
    try {
      await authService.registerHRD(hrdData)
      toast.success("Registrasi berhasil! Selamat datang di JobSeeker.")
      console.log(hrdData);
      router.push("/hrd/dashboard")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registrasi gagal. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Daftar di JobSeeker</CardTitle>
          <CardDescription>Pilih jenis akun yang ingin Anda buat</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="jobseeker" className="gap-2">
                <User className="h-4 w-4" />
                Pencari Kerja
              </TabsTrigger>
              <TabsTrigger value="hrd" className="gap-2">
                <Building2 className="h-4 w-4" />
                Perusahaan (HRD)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="jobseeker">
              <form onSubmit={handleJobSeekerSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="js-name">Nama Lengkap</Label>
                  <Input
                    id="js-name"
                    placeholder="John Doe"
                    value={jobSeekerData.name}
                    onChange={(e) => setJobSeekerData({ ...jobSeekerData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="js-email">Email</Label>
                  <Input
                    id="js-email"
                    type="email"
                    placeholder="nama@email.com"
                    value={jobSeekerData.email}
                    onChange={(e) => setJobSeekerData({ ...jobSeekerData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="js-password">Password</Label>
                    <Input
                      id="js-password"
                      type="password"
                      placeholder="••••••••"
                      value={jobSeekerData.password}
                      onChange={(e) => setJobSeekerData({ ...jobSeekerData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="js-confirm">Konfirmasi Password</Label>
                    <Input
                      id="js-confirm"
                      type="password"
                      placeholder="••••••••"
                      value={jobSeekerData.confirmPassword}
                      onChange={(e) => setJobSeekerData({ ...jobSeekerData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Memproses..." : "Daftar sebagai Pencari Kerja"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="hrd">
              <form onSubmit={handleHRDSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="hrd-company">Nama Perusahaan</Label>
                  <Input
                    id="hrd-company"
                    placeholder="PT. Contoh Indonesia"
                    value={hrdData.companyName}
                    onChange={(e) => setHRDData({ ...hrdData, companyName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hrd-email">Email Perusahaan</Label>
                  <Input
                    id="hrd-email"
                    type="email"
                    placeholder="hr@perusahaan.com"
                    value={hrdData.email}
                    onChange={(e) => setHRDData({ ...hrdData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hrd-password">Password</Label>
                    <Input
                      id="hrd-password"
                      type="password"
                      placeholder="••••••••"
                      value={hrdData.password}
                      onChange={(e) => setHRDData({ ...hrdData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hrd-confirm">Konfirmasi Password</Label>
                    <Input
                      id="hrd-confirm"
                      type="password"
                      placeholder="••••••••"
                      value={hrdData.confirmPassword}
                      onChange={(e) => setHRDData({ ...hrdData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hrd-address">Alamat Perusahaan (Opsional)</Label>
                  <Input
                    id="hrd-address"
                    placeholder="Jl. Contoh No. 123, Jakarta"
                    value={hrdData.companyAddress}
                    onChange={(e) => setHRDData({ ...hrdData, companyAddress: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hrd-description">Deskripsi Perusahaan (Opsional)</Label>
                  <Textarea
                    id="hrd-description"
                    placeholder="Ceritakan tentang perusahaan Anda..."
                    value={hrdData.companyDescription}
                    onChange={(e) => setHRDData({ ...hrdData, companyDescription: e.target.value })}
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Memproses..." : "Daftar sebagai Perusahaan"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Sudah punya akun? </span>
            <Link href="/login" className="text-primary hover:underline font-medium">
              Masuk sekarang
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
