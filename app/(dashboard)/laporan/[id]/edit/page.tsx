"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";

const categories = [
  { value: "Fasilitas Ruangan", label: "Fasilitas Ruangan" },
  { value: "Peralatan", label: "Peralatan" },
  { value: "Listrik & Air", label: "Listrik & Air" },
  { value: "Jaringan & Internet", label: "Jaringan & Internet" },
  { value: "Furniture", label: "Furniture" },
  { value: "Kebersihan", label: "Kebersihan" },
  { value: "Keamanan", label: "Keamanan" },
  { value: "Lainnya", label: "Lainnya" },
];

interface Report {
  id: string;
  facilityName: string;
  location: string;
  category: string;
  description: string;
  date: string;
  status: string;
}

export default function EditLaporanPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [form, setForm] = useState({
    facilityName: "",
    location: "",
    category: "",
    description: "",
    date: "",
  });

  useEffect(() => {
    fetch(`/api/reports/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.report) {
          setReport(d.report);
          setForm({
            facilityName: d.report.facilityName,
            location: d.report.location,
            category: d.report.category,
            description: d.report.description,
            date: d.report.date,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/reports/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Laporan berhasil diperbarui!");
      router.push(`/laporan/${params.id}`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal memperbarui laporan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 dark:text-slate-400">Laporan tidak ditemukan</p>
      </div>
    );
  }

  if (report.status !== "Menunggu") {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Tidak Bisa Diedit</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Laporan yang sudah diproses tidak dapat diedit.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Topbar title="Edit Laporan" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                Informasi Fasilitas
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Perbarui detail laporan Anda
              </p>
            </div>

            <Input
              label="Nama Fasilitas"
              placeholder="Contoh: AC Ruangan 301"
              value={form.facilityName}
              onChange={(e) => setForm({ ...form, facilityName: e.target.value })}
              required
            />

            <Input
              label="Lokasi"
              placeholder="Contoh: Gedung A, Lantai 3, Ruang 301"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />

            <Select
              label="Kategori"
              options={categories}
              placeholder="Pilih kategori kerusakan"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />

            <Textarea
              label="Deskripsi"
              placeholder="Jelaskan kerusakan yang terjadi secara detail..."
              rows={5}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />

            <Input
              label="Tanggal Kejadian"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
              >
                Batal
              </Button>
              <Button type="submit" loading={saving}>
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
