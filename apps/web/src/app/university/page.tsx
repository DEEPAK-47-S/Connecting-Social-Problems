"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UniversityRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/college");
  }, [router]);

  return null;
}
