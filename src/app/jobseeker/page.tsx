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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-muted-foreground">Mengalihkan...</p>
        </div>
      </div>
    </div>
  );
}
