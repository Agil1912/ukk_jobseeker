"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userAPI } from "@/lib/api";
import { toast } from "sonner";
import { Briefcase, User, Building2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("jobseeker");

  const [jobSeekerData, setJobSeekerData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
    gender: "male" as "male" | "female",
    date_of_birth: "",
  });

  const [hrdData, setHRDData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyAddress: "",
    companyPhone: "",
    companyDescription: "",
  });

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "hrd") {
      setActiveTab("hrd");
    }
  }, [searchParams]);

  const handleJobSeekerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (jobSeekerData.password !== jobSeekerData.confirmPassword) {
      toast.error("Password dan konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", jobSeekerData.name);
      formData.append("email", jobSeekerData.email);
      formData.append("password", jobSeekerData.password);
      formData.append("role", "Society");
      formData.append("address", jobSeekerData.address);
      formData.append("phone", jobSeekerData.phone);
      formData.append("gender", jobSeekerData.gender);
      formData.append("date_of_birth", jobSeekerData.date_of_birth);

      await userAPI.register(formData);
      toast.success("Registrasi berhasil! Selamat datang di JobSeeker.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Registrasi gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleHRDSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hrdData.password !== hrdData.confirmPassword) {
      toast.error("Password dan konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", hrdData.companyName); // Backend expects 'name' field
      formData.append("companyName", hrdData.companyName); // Also send as companyName for Company table
      formData.append("email", hrdData.email);
      formData.append("password", hrdData.password);
      formData.append("role", "HRD");
      formData.append("address", hrdData.companyAddress);
      formData.append("phone", hrdData.companyPhone);
      if (hrdData.companyDescription) {
        formData.append("description", hrdData.companyDescription);
      }

      await userAPI.register(formData);
      toast.success("Registrasi berhasil! Selamat datang di JobSeeker.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Registrasi gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

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
          <CardDescription>
            Pilih jenis akun yang ingin Anda buat
          </CardDescription>
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
                    onChange={(e) =>
                      setJobSeekerData({
                        ...jobSeekerData,
                        name: e.target.value,
                      })
                    }
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
                    onChange={(e) =>
                      setJobSeekerData({
                        ...jobSeekerData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="js-phone">Nomor Telepon</Label>
                  <Input
                    id="js-phone"
                    type="tel"
                    placeholder="08123456789"
                    value={jobSeekerData.phone}
                    onChange={(e) =>
                      setJobSeekerData({
                        ...jobSeekerData,
                        phone: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="js-address">Alamat</Label>
                  <Textarea
                    id="js-address"
                    placeholder="Alamat lengkap Anda"
                    value={jobSeekerData.address}
                    onChange={(e) =>
                      setJobSeekerData({
                        ...jobSeekerData,
                        address: e.target.value,
                      })
                    }
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="js-gender">Jenis Kelamin</Label>
                    <select
                      id="js-gender"
                      value={jobSeekerData.gender}
                      onChange={(e) =>
                        setJobSeekerData({
                          ...jobSeekerData,
                          gender: e.target.value as "male" | "female",
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="male">Laki-laki</option>
                      <option value="female">Perempuan</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="js-dob">Tanggal Lahir</Label>
                    <Input
                      id="js-dob"
                      type="date"
                      value={jobSeekerData.date_of_birth}
                      onChange={(e) =>
                        setJobSeekerData({
                          ...jobSeekerData,
                          date_of_birth: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="js-password">Password {"(minimal 8 karakter & string)"}</Label>
                    <Input
                      id="js-password"
                      type="password"
                      placeholder="••••••••"
                      value={jobSeekerData.password}
                      onChange={(e) =>
                        setJobSeekerData({
                          ...jobSeekerData,
                          password: e.target.value,
                        })
                      }
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
                      onChange={(e) =>
                        setJobSeekerData({
                          ...jobSeekerData,
                          confirmPassword: e.target.value,
                        })
                      }
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
                    onChange={(e) =>
                      setHRDData({ ...hrdData, companyName: e.target.value })
                    }
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
                    onChange={(e) =>
                      setHRDData({ ...hrdData, email: e.target.value })
                    }
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
                      onChange={(e) =>
                        setHRDData({ ...hrdData, password: e.target.value })
                      }
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
                      onChange={(e) =>
                        setHRDData({
                          ...hrdData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hrd-phone">Telepon Perusahaan</Label>
                  <Input
                    id="hrd-phone"
                    type="tel"
                    placeholder="02112345678"
                    value={hrdData.companyPhone}
                    onChange={(e) =>
                      setHRDData({ ...hrdData, companyPhone: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hrd-address">Alamat Perusahaan</Label>
                  <Input
                    id="hrd-address"
                    placeholder="Jl. Contoh No. 123, Jakarta"
                    value={hrdData.companyAddress}
                    onChange={(e) =>
                      setHRDData({ ...hrdData, companyAddress: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hrd-description">
                    Deskripsi Perusahaan (Opsional)
                  </Label>
                  <Textarea
                    id="hrd-description"
                    placeholder="Ceritakan tentang perusahaan Anda..."
                    value={hrdData.companyDescription}
                    onChange={(e) =>
                      setHRDData({
                        ...hrdData,
                        companyDescription: e.target.value,
                      })
                    }
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
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Masuk sekarang
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
