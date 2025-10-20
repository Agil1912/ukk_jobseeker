"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { jobSeekerService } from "@/lib/services/jobseeker.service"
import { toast } from "sonner"
import { User, Briefcase, Plus, ExternalLink, Trash2, Edit } from "lucide-react"
import type { JobSeeker, Portfolio } from "@/lib/types"

export default function ProfilePage() {
  const [profile, setProfile] = useState<JobSeeker | null>(null)
  const [portfolio, setPortfolio] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false)

  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    address: "",
    bio: "",
    skills: [] as string[],
  })

  const [portfolioForm, setPortfolioForm] = useState({
    title: "",
    description: "",
    link: "",
  })

  const [skillInput, setSkillInput] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [profileData, portfolioData] = await Promise.all([
        jobSeekerService.getProfile(),
        jobSeekerService.getPortfolio(),
      ])
      setProfile(profileData)
      setPortfolio(portfolioData)
      setProfileForm({
        name: profileData.name,
        phone: profileData.phone || "",
        address: profileData.address || "",
        bio: profileData.bio || "",
        skills: profileData.skills || [],
      })
    } catch (error) {
      toast.error("Gagal memuat data profil")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await jobSeekerService.updateProfile(profileForm)
      toast.success("Profil berhasil diperbarui")
      setIsEditingProfile(false)
      loadData()
    } catch (error) {
      toast.error("Gagal memperbarui profil")
    } finally {
      setSaving(false)
    }
  }

  const handleAddSkill = () => {
    if (skillInput.trim() && !profileForm.skills.includes(skillInput.trim())) {
      setProfileForm({
        ...profileForm,
        skills: [...profileForm.skills, skillInput.trim()],
      })
      setSkillInput("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setProfileForm({
      ...profileForm,
      skills: profileForm.skills.filter((s) => s !== skill),
    })
  }

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await jobSeekerService.addPortfolio(portfolioForm)
      toast.success("Portfolio berhasil ditambahkan")
      setIsAddingPortfolio(false)
      setPortfolioForm({ title: "", description: "", link: "" })
      loadData()
    } catch (error) {
      toast.error("Gagal menambahkan portfolio")
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePortfolio = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus portfolio ini?")) return

    try {
      await jobSeekerService.deletePortfolio(id)
      toast.success("Portfolio berhasil dihapus")
      loadData()
    } catch (error) {
      toast.error("Gagal menghapus portfolio")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Profil Saya</h1>
          <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
            <DialogTrigger asChild>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profil
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Profil</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Input
                    id="address"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    rows={4}
                    placeholder="Ceritakan tentang diri Anda..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Keahlian</Label>
                  <div className="flex gap-2">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                      placeholder="Tambah keahlian..."
                    />
                    <Button type="button" onClick={handleAddSkill}>
                      Tambah
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profileForm.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="gap-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsEditingProfile(false)}>
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
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">{profile?.name}</CardTitle>
                <CardDescription>{profile?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile?.phone && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Telepon</p>
                <p>{profile.phone}</p>
              </div>
            )}
            {profile?.address && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alamat</p>
                <p>{profile.address}</p>
              </div>
            )}
            {profile?.bio && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bio</p>
                <p className="text-pretty">{profile.bio}</p>
              </div>
            )}
            {profile?.skills && profile.skills.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Keahlian</p>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Briefcase className="h-6 w-6" />
              Portfolio
            </h2>
            <Dialog open={isAddingPortfolio} onOpenChange={setIsAddingPortfolio}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Portfolio
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Portfolio</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddPortfolio} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Judul</Label>
                    <Input
                      id="title"
                      value={portfolioForm.title}
                      onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi</Label>
                    <Textarea
                      id="description"
                      value={portfolioForm.description}
                      onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link">Link (Opsional)</Label>
                    <Input
                      id="link"
                      type="url"
                      value={portfolioForm.link}
                      onChange={(e) => setPortfolioForm({ ...portfolioForm, link: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setIsAddingPortfolio(false)}>
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

          {portfolio.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada portfolio. Tambahkan portfolio pertama Anda!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {portfolio.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription className="mt-2 text-pretty">{item.description}</CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeletePortfolio(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  {item.link && (
                    <CardContent>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        Lihat Project
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
