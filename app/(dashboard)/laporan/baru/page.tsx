"use client";

import Topbar from "@/components/layout/Topbar";
import MultiStepForm from "@/components/reports/MultiStepForm";

export default function BuatLaporanPage() {
  return (
    <div>
      <Topbar title="Buat Laporan Baru" />
      <MultiStepForm />
    </div>
  );
}
