"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authService } from "@/lib/auth"
import { toast } from "sonner"
import { Briefcase } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authService.login(formData)
      console.log(response);
      router.push("/hrd/dashboard")
      toast.success("Login berhasil!")
      // Redirect based on user role
      if (response.role === "jobseeker") {
        router.push("/jobseeker/jobs")
      } else {
        console.log("ganti page woi niga")
        await new Promise((resolve) => setTimeout(resolve, 1000))
        // router.push("/hrd/dashboard")
        // router.push("/hrd/dashboard") is already the recommended way in Next.js for client-side navigation.
        // window.location.href = "/hrd/dashboard" will cause a full page reload.
        // If router.push is not working, make sure you are not inside a server component.
        // Alternatively, you can use router.replace("/hrd/dashboard") to replace the current history entry:
        router.replace("/hrd/dashboard")
      }
    } catch (error: any) {
        console.log(error);
        
      toast.error(error.response?.data?.message || `Login gagal. Periksa email dan password Anda. ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Masuk ke JobSeeker</CardTitle>
          <CardDescription>Masukkan email dan password Anda untuk melanjutkan</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Belum punya akun? </span>
            <Link href="/register" className="text-primary hover:underline font-medium">
              Daftar sekarang
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
