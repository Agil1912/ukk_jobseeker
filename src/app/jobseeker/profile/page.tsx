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
      window.location.reload();
    } catch (error) {
      toast.error("Gagal menghapus portfolio");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-black text-blue-600">Profil Saya</h1>
            <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profil
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-blue-600">
                    Edit Profil
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-bold text-blue-600">
                      Foto Profil
                    </Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-24 w-24 border-4 border-blue-600">
                        <AvatarImage
                          src={imagePreview || undefined}
                          alt={user?.name || "User"}
                        />
                        <AvatarFallback className="bg-blue-600 text-white text-2xl font-black">
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
                          className="w-full border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-bold"
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
                    <Label htmlFor="name" className="font-bold text-blue-600">
                      Nama Lengkap
                    </Label>
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, name: e.target.value })
                      }
                      className="border-2 border-gray-300 focus:border-blue-500 font-bold"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-bold text-blue-600">
                      Nomor Telepon
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          phone: e.target.value,
                        })
                      }
                      className="border-2 border-gray-300 focus:border-blue-500 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="font-bold text-blue-600"
                    >
                      Alamat
                    </Label>
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
                      className="border-2 border-gray-300 focus:border-blue-500 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="date_of_birth"
                      className="font-bold text-blue-600"
                    >
                      Tanggal Lahir
                    </Label>
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
                      className="border-2 border-gray-300 focus:border-blue-500 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="font-bold text-blue-600">
                      Jenis Kelamin
                    </Label>
                    <select
                      id="gender"
                      value={profileForm.gender}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          gender: e.target.value as "male" | "female",
                        })
                      }
                      className="flex h-10 w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-sm font-bold focus:border-blue-500 focus:outline-none"
                    >
                      <option value="male">Laki-laki</option>
                      <option value="female">Perempuan</option>
                    </select>
                  </div>
                  <div className="flex gap-2 justify-end pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setSelectedImage(null);
                        setImagePreview(user?.image || null);
                      }}
                      className="font-bold border-2 border-gray-400"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold"
                    >
                      {saving ? "Menyimpan..." : "Simpan"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Profile Card */}
          <Card className="border-0 shadow-lg bg-white overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400"></div>
            <CardHeader className="pb-6 bg-gradient-to-b from-white to-blue-50">
              <div className="flex items-center gap-6 -mt-24 mb-4">
                <Avatar className="h-32 w-32 border-4 border-white shadow-xl bg-blue-600">
                  <AvatarImage
                    src={user?.image || undefined}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback className="bg-blue-600 text-white text-4xl font-black">
                    {user?.name ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-4xl font-black text-white mb-1 drop-shadow-sm">
                    {society?.name || user?.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 font-semibold text-base">
                    {user?.email}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {society?.phone && (
                <div className="pb-4 border-b-2 border-gray-200">
                  <p className="text-sm font-black text-blue-600 mb-1">
                    TELEPON
                  </p>
                  <p className="text-lg font-bold text-gray-700">
                    {society.phone}
                  </p>
                </div>
              )}
              {society?.address && (
                <div className="pb-4 border-b-2 border-gray-200">
                  <p className="text-sm font-black text-orange-600 mb-1">
                    ALAMAT
                  </p>
                  <p className="text-lg font-bold text-gray-700">
                    {society.address}
                  </p>
                </div>
              )}
              {society?.date_of_birth && (
                <div className="pb-4 border-b-2 border-gray-200">
                  <p className="text-sm font-black text-green-600 mb-1">
                    TANGGAL LAHIR
                  </p>
                  <p className="text-lg font-bold text-gray-700">
                    {new Date(society.date_of_birth).toLocaleDateString(
                      "id-ID"
                    )}
                  </p>
                </div>
              )}
              {society?.gender && (
                <div>
                  <p className="text-sm font-black text-green-600 mb-1">
                    JENIS KELAMIN
                  </p>
                  <p className="text-lg font-bold text-gray-700">
                    {society.gender === "male" ? "Laki-laki" : "Perempuan"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Portfolio Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black flex items-center gap-3 text-orange-600">
                <div className="bg-orange-600 p-2 rounded-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                Portfolio
              </h2>
              <Dialog
                open={isAddingPortfolio}
                onOpenChange={setIsAddingPortfolio}
              >
                <DialogTrigger asChild>
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Portfolio
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-orange-600">
                      Tambah Portfolio
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddPortfolio} className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="skill"
                        className="font-bold text-blue-600"
                      >
                        Keahlian/Skill
                      </Label>
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
                        className="border-2 border-gray-300 focus:border-orange-500 font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="font-bold text-blue-600"
                      >
                        Deskripsi
                      </Label>
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
                        className="border-2 border-gray-300 focus:border-orange-500 font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="portfolio-file"
                        className="font-bold text-blue-600"
                      >
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
                        className="border-2 border-gray-300 focus:border-orange-500 font-bold"
                      />
                      <p className="text-xs text-muted-foreground">
                        Gambar atau PDF. Maksimal 5MB.
                      </p>
                    </div>
                    <div className="flex gap-2 justify-end pt-4">
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
                        className="font-bold border-2 border-gray-400"
                      >
                        Batal
                      </Button>
                      <Button
                        type="submit"
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold"
                      >
                        {saving ? "Menyimpan..." : "Simpan"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {portfolio.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
                <CardContent className="py-16 text-center">
                  <div className="bg-blue-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-lg font-black text-blue-600">
                    Belum ada portfolio
                  </p>
                  <p className="text-gray-600 font-bold">
                    Tambahkan portfolio pertama Anda!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {portfolio.map((item) => (
                  <Card
                    key={item.id}
                    className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white"
                  >
                    <div className="h-1 bg-orange-600"></div>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-2xl font-black text-blue-600">
                            {item.skill}
                          </CardTitle>
                          <CardDescription className="mt-2 text-gray-700 font-bold">
                            {item.description}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePortfolio(item.id)}
                          className="hover:bg-red-100"
                        >
                          <Trash2 className="h-5 w-5 text-red-600 font-bold" />
                        </Button>
                      </div>
                    </CardHeader>
                    {item.file && (
                      <CardContent>
                        <a
                          href={item.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
                        >
                          Lihat File
                          <ExternalLink className="h-4 w-4" />
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
    </div>
  );
}
