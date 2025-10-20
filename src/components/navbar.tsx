"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Briefcase, User, LogOut, Building2 } from "lucide-react"

export function Navbar() {
  const { user, isAuthenticated, isJobSeeker, isHRD, logout } = useAuth()

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Briefcase className="h-6 w-6" />
            <span>JobSeeker</span>
          </Link>

          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Masuk</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Daftar</Link>
                </Button>
              </>
            ) : (
              <>
                {isJobSeeker && (
                  <div className="hidden md:flex items-center gap-2">
                    <Button variant="ghost" asChild>
                      <Link href="/jobseeker/jobs">Cari Pekerjaan</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                      <Link href="/jobseeker/applications">Lamaran Saya</Link>
                    </Button>
                  </div>
                )}
                {isHRD && (
                  <div className="hidden md:flex items-center gap-2">
                    <Button variant="ghost" asChild>
                      <Link href="/hrd/dashboard">Dashboard</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                      <Link href="/hrd/jobs">Kelola Lowongan</Link>
                    </Button>
                  </div>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      {isJobSeeker ? <User className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isJobSeeker && (
                      <DropdownMenuItem asChild>
                        <Link href="/jobseeker/profile">
                          <User className="mr-2 h-4 w-4" />
                          Profil Saya
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {isHRD && (
                      <DropdownMenuItem asChild>
                        <Link href="/hrd/profile">
                          <Building2 className="mr-2 h-4 w-4" />
                          Profil Perusahaan
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Keluar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
