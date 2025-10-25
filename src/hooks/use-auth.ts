"use client";

import { useAuth as useAuthContext } from "@/contexts/AuthContext";

export function useAuth() {
  const { user, isLoading, isAuthenticated, logout } = useAuthContext();

  return {
    user,
    loading: isLoading,
    isAuthenticated,
    isJobSeeker: user?.role === "Society",
    isHRD: user?.role === "HRD",
    logout,
  };
}
