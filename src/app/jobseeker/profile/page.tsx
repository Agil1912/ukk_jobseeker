"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { jobSeekerService } from "@/lib/services/jobseeker.service";
import { toast } from "sonner";
import {
  User,
  Briefcase,
  Plus,
  ExternalLink,
  Trash2,
  Edit,
  Camera,
  Upload,
} from "lucide-react";
import type { JobSeeker, Portfolio } from "@/lib/types";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function ProfilePage() {
  const [user, setUser] = useState<JobSeeker | null>(null);
  const [society, setSociety] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    address: "",
    date_of_birth: "",
    gender: "male" as "male" | "female",
  });

  const [portfolioForm, setPortfolioForm] = useState({
    skill: "",
    description: "",
    file: null as File | null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileData, portfolioData] = await Promise.all([
        jobSeekerService.getProfile(),
        jobSeekerService.getPortfolio(),
      ]);
      setUser(profileData.user);
      setSociety(profileData.society);
      setPortfolio(portfolioData);

      if (profileData.society) {
        setProfileForm({
          name: profileData.society.name || "",
          phone: profileData.society.phone || "",
          address: profileData.society.address || "",
          date_of_birth: profileData.society.date_of_birth || "",
          gender: profileData.society.gender || "male",
        });
      }

      if (profileData.user.image) {
        setImagePreview(profileData.user.image);
      }
    } catch (error) {
      toast.error("Gagal memuat data profil");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file terlalu besar. Maksimal 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("File harus berupa gambar");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();

      // Only append name if it has a value
      if (user?.name) {
        formData.append("name", user.name);
      }

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const updatedUser = await jobSeekerService.updateProfile(formData);

      if (society) {
        await jobSeekerService.updateSociety(society.id, profileForm);
      }

      toast.success("Profil berhasil diperbarui");

      // Reload page to show updated data
      window.location.reload();
    } catch (error) {
      toast.error("Gagal memperbarui profil");
    } finally {
      setSaving(false);
    }
  };

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();

      // Pastikan skill dan description tidak kosong
      if (!portfolioForm.skill.trim() || !portfolioForm.description.trim()) {
        toast.error("Skill dan deskripsi harus diisi");
        setSaving(false);
        return;
      }

      formData.append("skill", portfolioForm.skill.trim());
      formData.append("description", portfolioForm.description.trim());
      if (portfolioForm.file) {
        formData.append("file", portfolioForm.file);
      }

      await jobSeekerService.addPortfolio(formData);

      toast.success("Portfolio berhasil ditambahkan");
      setIsAddingPortfolio(false);
      setPortfolioForm({
        skill: "",
        description: "",
        file: null,
      });

      // Reload page to show updated data
      window.location.reload();
    } catch (error: any) {
      console.error("Error adding portfolio:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Gagal menambahkan portfolio";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus portfolio ini?")) return;

    try {
      await jobSeekerService.deletePortfolio(id);

      toast.success("Portfolio berhasil dihapus");

      // Reload page to show updated data
      window.location.reload();
    } catch (error) {
      toast.error("Gagal menghapus portfolio");
    }
  };

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
    );
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
                  <Label>Foto Profil</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={imagePreview || undefined}
                        alt={user?.name || "User"}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                        {user?.name ? getInitials(user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {selectedImage ? "Ganti Foto" : "Upload Foto"}
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG atau GIF. Maksimal 5MB.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Textarea
                    id="address"
                    value={profileForm.address}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        address: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Tanggal Lahir</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={profileForm.date_of_birth}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        date_of_birth: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Jenis Kelamin</Label>
                  <select
                    id="gender"
                    value={profileForm.gender}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        gender: e.target.value as "male" | "female",
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditingProfile(false);
                      setSelectedImage(null);
                      setImagePreview(user?.image || null);
                    }}
                  >
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
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={user?.image || undefined}
                  alt={user?.name || "User"}
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {user?.name ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {society?.name || user?.name}
                </CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {society?.phone && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Telepon
                </p>
                <p>{society.phone}</p>
              </div>
            )}
            {society?.address && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Alamat
                </p>
                <p className="text-pretty">{society.address}</p>
              </div>
            )}
            {society?.date_of_birth && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tanggal Lahir
                </p>
                <p>
                  {new Date(society.date_of_birth).toLocaleDateString("id-ID")}
                </p>
              </div>
            )}
            {society?.gender && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Jenis Kelamin
                </p>
                <p>{society.gender === "male" ? "Laki-laki" : "Perempuan"}</p>
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
            <Dialog
              open={isAddingPortfolio}
              onOpenChange={setIsAddingPortfolio}
            >
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
                    <Label htmlFor="skill">Keahlian/Skill</Label>
                    <Input
                      id="skill"
                      value={portfolioForm.skill}
                      onChange={(e) =>
                        setPortfolioForm({
                          ...portfolioForm,
                          skill: e.target.value,
                        })
                      }
                      placeholder="Contoh: Web Development, Design, etc."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi</Label>
                    <Textarea
                      id="description"
                      value={portfolioForm.description}
                      onChange={(e) =>
                        setPortfolioForm({
                          ...portfolioForm,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      placeholder="Jelaskan tentang portfolio Anda..."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portfolio-file">
                      File Portfolio (Opsional)
                    </Label>
                    <Input
                      id="portfolio-file"
                      type="file"
                      onChange={(e) =>
                        setPortfolioForm({
                          ...portfolioForm,
                          file: e.target.files?.[0] || null,
                        })
                      }
                      accept="image/*,.pdf"
                    />
                    <p className="text-xs text-muted-foreground">
                      Gambar atau PDF. Maksimal 5MB.
                    </p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddingPortfolio(false);
                        setPortfolioForm({
                          skill: "",
                          description: "",
                          file: null,
                        });
                      }}
                    >
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
                        <CardTitle>{item.skill}</CardTitle>
                        <CardDescription className="mt-2 text-pretty">
                          {item.description}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePortfolio(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  {item.file && (
                    <CardContent>
                      <a
                        href={item.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        Lihat File
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
  );
}
