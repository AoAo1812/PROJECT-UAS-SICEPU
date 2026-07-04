"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/(dashboard)/layout";
import Topbar from "@/components/layout/Topbar";
import MultiStepForm from "@/components/reports/MultiStepForm";
import { useTranslation } from "@/lib/i18n";

export default function BuatLaporanPage() {
  const { t } = useTranslation();
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
      <Topbar title={t("reports.createNew")} />
      <MultiStepForm />
    </div>
  );
}
