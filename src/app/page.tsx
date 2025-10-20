import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Briefcase, Building2, Users, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Platform Pencarian Kerja Resmi Pemerintah Indonesia
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 text-pretty">
              Membantu masyarakat mendapatkan pekerjaan dan perusahaan menemukan karyawan terbaik
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register?type=jobseeker">Cari Pekerjaan</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link href="/register?type=hrd">Pasang Lowongan</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-2">
                  <Briefcase className="h-10 w-10 text-primary" />
                  <p className="text-3xl font-bold">1,000+</p>
                  <p className="text-sm text-muted-foreground">Lowongan Aktif</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-2">
                  <Users className="h-10 w-10 text-primary" />
                  <p className="text-3xl font-bold">50,000+</p>
                  <p className="text-sm text-muted-foreground">Pencari Kerja</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-2">
                  <Building2 className="h-10 w-10 text-primary" />
                  <p className="text-3xl font-bold">500+</p>
                  <p className="text-sm text-muted-foreground">Perusahaan</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-2">
                  <TrendingUp className="h-10 w-10 text-primary" />
                  <p className="text-3xl font-bold">85%</p>
                  <p className="text-sm text-muted-foreground">Tingkat Keberhasilan</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Mengapa Memilih JobSeeker?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-3">Untuk Pencari Kerja</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Akses ribuan lowongan kerja dari berbagai perusahaan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Buat profil dan portofolio profesional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Lacak status lamaran secara real-time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Filter lowongan sesuai keahlian dan lokasi</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-3">Untuk Perusahaan</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Posting lowongan kerja dengan mudah</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Akses database kandidat berkualitas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Kelola lamaran dan kandidat efisien</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Dashboard analitik perekrutan</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Memulai?</h2>
          <p className="text-lg mb-8 text-primary-foreground/90">
            Bergabunglah dengan ribuan pencari kerja dan perusahaan di Indonesia
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">Daftar Sekarang</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 JobSeeker - Platform Pencarian Kerja Pemerintah Indonesia</p>
        </div>
      </footer>
    </div>
  )
}
