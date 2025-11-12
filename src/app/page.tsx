import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import {
  Briefcase,
  Building2,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-500">
      <Navbar />

      {/* Hero Section - Colorful Gradient */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-72 h-72 bg-orange-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-300 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-orange-400/30 rounded-full mb-6 border border-orange-200">
              <p className="text-sm font-black">
                🚀 Platform Terpercaya #1 di Indonesia
              </p>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              Temukan Karir Impianmu Hari Ini
            </h1>
            <p className="text-xl md:text-2xl mb-10 font-bold text-blue-100 max-w-2xl mx-auto">
              Hubungkan talenta terbaik dengan perusahaan impian. Proses
              rekrutmen yang mudah, cepat, dan efisien.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="gap-2 bg-orange-500 hover:bg-orange-600 font-bold text-white"
                asChild
              >
                <Link href="/register?type=jobseeker">
                  Cari Pekerjaan <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white font-bold border-0"
                asChild
              >
                <Link href="/register?type=hrd">Pasang Lowongan</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced Colors */}
      <section className="py-20 bg-gradient-to-r from-blue-100 to-green-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="pt-8">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Briefcase className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-4xl font-black text-blue-600">1,000+</p>
                  <p className="text-gray-700 font-bold">Lowongan Aktif</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="pt-8">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-3 bg-orange-500/20 rounded-lg">
                    <Users className="h-8 w-8 text-orange-600" />
                  </div>
                  <p className="text-4xl font-black text-orange-600">50,000+</p>
                  <p className="text-gray-700 font-bold">Pencari Kerja</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="pt-8">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Building2 className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-4xl font-black text-green-600">500+</p>
                  <p className="text-gray-700 font-bold">
                    Perusahaan Terdaftar
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="pt-8">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-4xl font-black text-blue-600">85%</p>
                  <p className="text-gray-700 font-bold">Tingkat Kepuasan</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section - Redesigned */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-600 to-orange-400">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-lg font-bold text-gray-700 max-w-2xl mx-auto">
              Solusi lengkap untuk kebutuhan karir dan rekrutmen Anda
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="pt-8">
                <h3 className="text-2xl font-black mb-8 text-blue-700">
                  Untuk Pencari Kerja
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1 font-bold" />
                    <span className="text-gray-700 font-bold">
                      Akses ribuan lowongan dari perusahaan terkemuka
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1 font-bold" />
                    <span className="text-gray-700 font-bold">
                      Buat profil dan portofolio profesional
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1 font-bold" />
                    <span className="text-gray-700 font-bold">
                      Lacak status lamaran secara real-time
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1 font-bold" />
                    <span className="text-gray-700 font-bold">
                      Filter lowongan sesuai keahlian dan lokasi
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="pt-8">
                <h3 className="text-2xl font-black mb-8 text-green-700">
                  Untuk Perusahaan
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1 font-bold" />
                    <span className="text-gray-700 font-bold">
                      Posting lowongan dengan cepat dan mudah
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1 font-bold" />
                    <span className="text-gray-700 font-bold">
                      Akses database kandidat berkualitas tinggi
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1 font-bold" />
                    <span className="text-gray-700 font-bold">
                      Kelola lamaran dan tim dengan efisien
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1 font-bold" />
                    <span className="text-gray-700 font-bold">
                      Dashboard analitik dan insights rekrutmen
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-20 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-400/20 rounded-full blur-3xl -ml-48 -mb-48"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Siap Memulai Karir Baru?
          </h2>
          <p className="text-xl mb-10 font-bold text-orange-50 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan profesional dan perusahaan yang sudah
            menemukan kesuksesan
          </p>
          <Button
            size="lg"
            className="gap-2 bg-blue-600 hover:bg-blue-700 font-black text-white"
            asChild
          >
            <Link href="/register">
              Daftar Gratis Sekarang <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-blue-500 py-12 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
            <div>
              <h4 className="font-black mb-2 text-orange-400 text-lg">
                Tentang Kami
              </h4>
              <p className="text-sm text-gray-300 font-bold">
                Platform pencarian kerja resmi Indonesia
              </p>
            </div>
            <div>
              <h4 className="font-black mb-2 text-green-400 text-lg">
                Layanan
              </h4>
              <p className="text-sm text-gray-300 font-bold">
                Rekrutmen & Pencarian Kerja
              </p>
            </div>
            <div>
              <h4 className="font-black mb-2 text-blue-400 text-lg">Kontak</h4>
              <p className="text-sm text-gray-300 font-bold">
                support@kerjain.id
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center text-gray-300 text-sm font-bold">
            <p>
              &copy; 2025 Kerjain - Platform Pencarian Kerja Pemerintah
              Indonesia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
