"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/(dashboard)/layout";
import Topbar from "@/components/layout/Topbar";
import MultiStepForm from "@/components/reports/MultiStepForm";

export default function BuatLaporanPage() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role === "admin") {
      router.push("/admin");
    }
  }, [user, router]);

  if (user?.role === "admin") return null;

  return (
    <div>
      <Topbar title="Buat Laporan Baru" />
      <MultiStepForm />
    </div>
  );
}
