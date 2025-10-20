"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { hrdService } from "@/lib/services/hrd.service"
import { toast } from "sonner"
import { Building2, Edit } from "lucide-react"
import type { HRD } from "@/lib/types"

export default function HRDProfilePage() {
  const [profile, setProfile] = useState<HRD | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    companyName: "",
    companyAddress: "",
    companyDescription: "",
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const data = await hrdService.getProfile()
      setProfile(data)
      setFormData({
        companyName: data.companyName,
        companyAddress: data.companyAddress || "",
        companyDescription: data.companyDescription || "",
      })
    } catch (error) {
      toast.error("Gagal memuat profil perusahaan")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await hrdService.updateProfile(formData)
      toast.success("Profil perusahaan berhasil diperbarui")
      setIsEditing(false)
      loadProfile()
    } catch (error) {
      toast.error("Gagal memperbarui profil")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Profil Perusahaan</h1>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profil
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Profil Perusahaan</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nama Perusahaan</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Alamat Perusahaan</Label>
                  <Input
                    id="companyAddress"
                    value={formData.companyAddress}
                    onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyDescription">Deskripsi Perusahaan</Label>
                  <Textarea
                    id="companyDescription"
                    value={formData.companyDescription}
                    onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
                    rows={5}
                    placeholder="Ceritakan tentang perusahaan Anda..."
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Menyimpan..." : "Simpan"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                <Building2 className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">{profile?.companyName}</CardTitle>
                <CardDescription>{profile?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
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
            {!profile?.companyAddress && !profile?.companyDescription && (
              <p className="text-muted-foreground text-center py-8">
                Lengkapi profil perusahaan Anda untuk menarik lebih banyak kandidat
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
