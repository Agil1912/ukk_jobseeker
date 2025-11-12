"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Briefcase, User, LogOut, Building2 } from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated, isJobSeeker, isHRD, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="border-b bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-2xl text-white hover:text-gray-700 transition-colors"
          >
            <Briefcase className="h-7 w-7 text-white" />
            <span>Kerjain</span>
          </Link>

          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  asChild
                  className="text-white font-bold text-base hover:bg-orange-400 hover:text-white transition-colors"
                >
                  <Link href="/login">Masuk</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-base"
                >
                  <Link href="/register">Daftar</Link>
                </Button>
              </>
            ) : (
              <>
                {isJobSeeker && (
                  <div className="hidden md:flex items-center gap-2">
                    <Button
                      variant="ghost"
                      asChild
                      className="text-white font-bold hover:bg-orange-700 hover:text-white transition-colors"
                    >
                      <Link href="/jobseeker/jobs">Cari Pekerjaan</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      asChild
                      className="text-white font-bold hover:bg-orange-700 hover:text-white transition-colors"
                    >
                      <Link href="/jobseeker/applications">Lamaran Saya</Link>
                    </Button>
                  </div>
                )}
                {isHRD && (
                  <div className="hidden md:flex items-center gap-2">
                    <Button
                      variant="ghost"
                      asChild
                      className="text-white font-bold hover:bg-orange-500 hover:text-white transition-colors"
                    >
                      <Link href="/hrd/dashboard">Dashboard</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      asChild
                      className="text-white font-bold hover:bg-orange-500 hover:text-white transition-colors"
                    >
                      <Link href="/hrd/jobs">Kelola Lowongan</Link>
                    </Button>
                  </div>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full p-0 ring-2 ring-orange-400 hover:ring-orange-300"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user?.image || undefined}
                          alt={user?.name || "User"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-orange-400 to-green-500 text-white font-bold">
                          {user?.name ? getInitials(user.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 border-blue-200 bg-white shadow-lg"
                  >
                    <DropdownMenuLabel>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold text-blue-700">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-600">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-blue-200" />
                    {isJobSeeker && (
                      <DropdownMenuItem asChild>
                        <Link
                          href="/jobseeker/profile"
                          className="font-bold text-blue-600 hover:text-orange-600"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Profil Saya
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {isHRD && (
                      <DropdownMenuItem asChild>
                        <Link
                          href="/hrd/profile"
                          className="font-bold text-blue-600 hover:text-orange-600"
                        >
                          <Building2 className="mr-2 h-4 w-4" />
                          Profil Perusahaan
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-blue-200" />
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-red-600 font-bold hover:bg-red-100 cursor-pointer"
                    >
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
  );
}
