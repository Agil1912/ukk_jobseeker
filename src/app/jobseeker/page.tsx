"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function JobSeekerPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to jobs page as default
    router.replace("/jobseeker/jobs");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-green-50">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-6">
          <div className="flex justify-center gap-3 mb-6">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
            <div
              className="w-4 h-4 bg-orange-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-4 h-4 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>

          <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-orange-500 to-green-600 bg-clip-text text-transparent">
            Mengalihkan...
          </p>

          <p className="text-sm font-semibold text-gray-600">
            Mempersiapkan dashboard Anda
          </p>
        </div>
      </div>
    </div>
  );
}
