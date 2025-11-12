"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { hrdService } from "@/lib/services/hrd.service";
import { toast } from "sonner";
import { Building2, Edit, MapPin, Phone, FileText } from "lucide-react";
import type { User, Company } from "@/lib/api";

export default function HRDProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    description: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await hrdService.getProfile();
      setUser(data.user);
      setCompany(data.company);
      if (data.company) {
        setFormData({
          name: data.company.name,
          address: data.company.address || "",
          phone: data.company.phone || "",
          description: data.company.description || "",
        });
      }
    } catch (error) {
      toast.error("Gagal memuat profil perusahaan");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) {
      toast.error("Data perusahaan tidak ditemukan");
      return;
    }
    setSaving(true);
    try {
      await hrdService.updateCompany(company.id, formData);
      toast.success("Profil perusahaan berhasil diperbarui");
      setIsEditing(false);
      loadProfile();
    } catch (error) {
      toast.error("Gagal memperbarui profil");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-green-50 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gradient-to-r from-blue-200 to-orange-200 rounded w-1/3"></div>
            <div className="h-96 bg-gradient-to-r from-blue-100 to-green-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-green-50 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-orange-500 to-green-600 bg-clip-text text-transparent">
              Profil Perusahaan
            </h1>
            <p className="text-gray-600 font-semibold mt-2">
              Kelola informasi perusahaan Anda
            </p>
          </div>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold shadow-lg">
                <Edit className="mr-2 h-5 w-5" />
                Edit Profil
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                  Edit Profil Perusahaan
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="companyName"
                    className="font-bold text-gray-700"
                  >
                    Nama Perusahaan
                  </Label>
                  <Input
                    id="companyName"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="border-2 border-blue-200 focus:border-blue-500 rounded-lg font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="companyPhone"
                    className="font-bold text-gray-700"
                  >
                    Telepon Perusahaan
                  </Label>
                  <Input
                    id="companyPhone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    className="border-2 border-orange-200 focus:border-orange-500 rounded-lg font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="companyAddress"
                    className="font-bold text-gray-700"
                  >
                    Alamat Perusahaan
                  </Label>
                  <Input
                    id="companyAddress"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="border-2 border-green-200 focus:border-green-500 rounded-lg font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="companyDescription"
                    className="font-bold text-gray-700"
                  >
                    Deskripsi Perusahaan
                  </Label>
                  <Textarea
                    id="companyDescription"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={5}
                    placeholder="Ceritakan tentang perusahaan Anda..."
                    className="border-2 border-blue-200 focus:border-blue-500 rounded-lg font-semibold"
                  />
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="font-bold border-2 border-gray-300"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold"
                  >
                    {saving ? "Menyimpan..." : "Simpan"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Profile Card */}
        <Card className="border-0 shadow-xl overflow-hidden bg-white">
          {/* Header Gradient */}
          <div className="h-32 bg-gradient-to-r from-blue-600 via-orange-500 to-green-500"></div>

          <CardHeader className="relative pb-8">
            <div className="flex items-end gap-6">
              <div className="h-32 w-32 rounded-xl bg-gradient-to-br from-blue-500 to-orange-400 flex items-center justify-center shadow-lg -mt-20 border-4 border-white">
                <Building2 className="h-16 w-16 text-white" />
              </div>
              <div className="flex-1 pb-4">
                <CardTitle className="text-4xl font-extrabold text-gray-800">
                  {company?.name || "Perusahaan"}
                </CardTitle>
                <CardDescription className="text-base font-semibold text-gray-600 mt-2">
                  {user?.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            {company?.phone && (
              <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500">
                <Phone className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-extrabold text-blue-700">
                    TELEPON
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    {company.phone}
                  </p>
                </div>
              </div>
            )}

            {company?.address && (
              <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500">
                <MapPin className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-extrabold text-orange-700">
                    ALAMAT
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    {company.address}
                  </p>
                </div>
              </div>
            )}

            {company?.description && (
              <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500">
                <FileText className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-extrabold text-green-700">
                    DESKRIPSI
                  </p>
                  <p className="text-base font-semibold text-gray-800 text-pretty leading-relaxed mt-1">
                    {company.description}
                  </p>
                </div>
              </div>
            )}

            {!company?.address && !company?.description && (
              <div className="p-8 rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-dashed border-yellow-300 text-center">
                <p className="text-lg font-extrabold text-yellow-700">
                  📝 Lengkapi profil perusahaan Anda untuk menarik lebih banyak
                  kandidat
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
