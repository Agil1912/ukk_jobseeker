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
      formData.append("name", hrdData.companyName);
      formData.append("companyName", hrdData.companyName);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-0 shadow-2xl">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600  to-blue-400 text-white rounded-t-lg">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl font-black">
            Daftar di JobSeeker
          </CardTitle>
          <CardDescription className="text-lg text-blue-100 font-semibold mt-2">
            Pilih jenis akun yang ingin Anda buat
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-800 p-0 rounded-md shadow-md">
              <TabsTrigger
                value="jobseeker"
                className=" scale-90 gap-2 font-bold text-base text-white data-[state=active]:bg-blue-700 data-[state=active]:shadow-lg data-[state=inactive]:text-gray-200 transition-all rounded-md"
              >
                <User className="h-5 w-5" />
                Pencari Kerja
              </TabsTrigger>
              <TabsTrigger
                value="hrd"
                className=" scale-90 gap-2 font-bold text-base text-white data-[state=active]:bg-orange-600 data-[state=active]:shadow-lg data-[state=inactive]:text-gray-200 transition-all rounded-md"
              >
                <Building2 className="h-5 w-5" />
                Perusahaan (HRD)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="jobseeker">
              <form onSubmit={handleJobSeekerSubmit} className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="js-name" className="font-bold text-blue-800">
                    Nama Lengkap
                  </Label>
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
                    className="border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="js-email" className="font-bold text-blue-800">
                    Email
                  </Label>
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
                    className="border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="js-phone" className="font-bold text-blue-800">
                    Nomor Telepon
                    <span className="text-gray-600">(Wajib +62)</span>
                  </Label>
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
                    className="border-2 border-green-200 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="js-address"
                    className="font-bold text-blue-800"
                  >
                    Alamat
                  </Label>
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
                    className="border-2 border-green-200 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="js-gender"
                      className="font-bold text-blue-800"
                    >
                      Jenis Kelamin
                    </Label>
                    <select
                      id="js-gender"
                      value={jobSeekerData.gender}
                      onChange={(e) =>
                        setJobSeekerData({
                          ...jobSeekerData,
                          gender: e.target.value as "male" | "female",
                        })
                      }
                      className="flex h-10 w-full rounded-md border-2 border-orange-200 bg-gray-950 px-3 py-2 text-sm font-semibold focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="male">Laki-laki</option>
                      <option value="female">Perempuan</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="js-dob" className="font-bold text-blue-800">
                      Tanggal Lahir
                    </Label>
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
                      className="border-2 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="js-password"
                      className="font-bold text-blue-800"
                    >
                      Password{" "}
                      <span className="text-gray-600">
                        (minimal 8 karakter & mengandung angka)
                      </span>
                    </Label>
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
                      className="border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="js-confirm"
                      className="font-bold text-blue-800"
                    >
                      Konfirmasi Password
                    </Label>
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
                      className="border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-400 to-blue-700 hover:from-blue-500 hover:to-blue-800  text-white font-bold text-lg py-6 rounded-lg shadow-lg transition-all"
                  disabled={loading}
                >
                  {loading ? "Memproses..." : "Daftar sebagai Pencari Kerja"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="hrd">
              <form onSubmit={handleHRDSubmit} className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="hrd-company"
                    className="font-bold text-orange-800"
                  >
                    Nama Perusahaan
                  </Label>
                  <Input
                    id="hrd-company"
                    placeholder="PT. Contoh Indonesia"
                    value={hrdData.companyName}
                    onChange={(e) =>
                      setHRDData({ ...hrdData, companyName: e.target.value })
                    }
                    className="border-2 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="hrd-email"
                    className="font-bold text-orange-800"
                  >
                    Email Perusahaan
                  </Label>
                  <Input
                    id="hrd-email"
                    type="email"
                    placeholder="hr@perusahaan.com"
                    value={hrdData.email}
                    onChange={(e) =>
                      setHRDData({ ...hrdData, email: e.target.value })
                    }
                    className="border-2 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="hrd-password"
                      className="font-bold text-orange-800"
                    >
                      Password
                    </Label>
                    <Input
                      id="hrd-password"
                      type="password"
                      placeholder="••••••••"
                      value={hrdData.password}
                      onChange={(e) =>
                        setHRDData({ ...hrdData, password: e.target.value })
                      }
                      className="border-2 border-green-200 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="hrd-confirm"
                      className="font-bold text-orange-800"
                    >
                      Konfirmasi Password
                    </Label>
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
                      className="border-2 border-green-200 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="hrd-phone"
                    className="font-bold text-orange-800"
                  >
                    Telepon Perusahaan
                    <span className="text-gray-600"> (Wajib +62)</span>
                  </Label>
                  <Input
                    id="hrd-phone"
                    type="tel"
                    placeholder="02112345678"
                    value={hrdData.companyPhone}
                    onChange={(e) =>
                      setHRDData({ ...hrdData, companyPhone: e.target.value })
                    }
                    className="border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="hrd-address"
                    className="font-bold text-orange-800"
                  >
                    Alamat Perusahaan
                  </Label>
                  <Input
                    id="hrd-address"
                    placeholder="Jl. Contoh No. 123, Jakarta"
                    value={hrdData.companyAddress}
                    onChange={(e) =>
                      setHRDData({ ...hrdData, companyAddress: e.target.value })
                    }
                    className="border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="hrd-description"
                    className="font-bold text-orange-800"
                  >
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
                    className="border-2 border-green-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg py-6 rounded-lg shadow-lg transition-all"
                  disabled={loading}
                >
                  {loading ? "Memproses..." : "Daftar sebagai Perusahaan"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center text-sm border-t-2 border-gray-200 pt-6">
            <span className="text-gray-600 font-semibold">
              Sudah punya akun?{" "}
            </span>
            <Link
              href="/login"
              className="bg-gradient-to-r bg-green-600 bg-clip-text text-transparent hover:underline font-bold text-base"
            >
              Masuk sekarang
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
