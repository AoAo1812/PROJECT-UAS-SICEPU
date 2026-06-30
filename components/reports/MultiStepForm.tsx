"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import FileUpload from "@/components/ui/FileUpload";

const steps = ["Fasilitas", "Lokasi", "Detail", "Foto"];

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

const priorities = [
  { value: "Rendah", label: "Rendah" },
  { value: "Sedang", label: "Sedang" },
  { value: "Tinggi", label: "Tinggi" },
  { value: "Darurat", label: "Darurat" },
];

export default function MultiStepForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    facilityName: "",
    location: "",
    category: "",
    priority: "Sedang",
    description: "",
    date: new Date().toISOString().split("T")[0],
    photos: [] as string[],
  });

  const update = (field: string, value: string | string[]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const next = () => {
    if (step === 0 && !form.facilityName) return toast.error("Nama fasilitas harus diisi");
    if (step === 1 && (!form.location || !form.category)) return toast.error("Lokasi dan kategori harus diisi");
    if (step === 2 && !form.description) return toast.error("Deskripsi harus diisi");
    setStep((s) => Math.min(s + 1, 3));
  };

  const submit = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("facilityName", form.facilityName);
      fd.append("location", form.location);
      fd.append("category", form.category);
      fd.append("priority", form.priority);
      fd.append("description", form.description);
      fd.append("date", form.date);
      form.photos.forEach((p) => fd.append("photos", p));

      const res = await fetch("/api/reports", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);
      toast.success("Laporan berhasil dikirim!");
      router.push("/laporan");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal membuat laporan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                i <= step ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
              }`}>
                {i < step ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${i < step ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {step === 0 && (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Informasi Fasilitas</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Masukkan nama fasilitas yang rusak</p>
                </div>
                <Input
                  label="Nama Fasilitas"
                  placeholder="Contoh: AC Ruangan 301"
                  value={form.facilityName}
                  onChange={(e) => update("facilityName", e.target.value)}
                />
              </>
            )}

            {step === 1 && (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Lokasi & Kategori</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tentukan lokasi dan jenis kerusakan</p>
                </div>
                <Input
                  label="Lokasi"
                  placeholder="Contoh: Gedung A, Lantai 3, Ruang 301"
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                />
                <Select
                  label="Kategori"
                  options={categories}
                  placeholder="Pilih kategori kerusakan"
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                />
                <Select
                  label="Prioritas"
                  options={priorities}
                  value={form.priority}
                  onChange={(e) => update("priority", e.target.value)}
                />
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Detail Kerusakan</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Jelaskan kerusakan secara detail</p>
                </div>
                <Textarea
                  label="Deskripsi"
                  placeholder="Jelaskan kerusakan yang terjadi secara detail..."
                  rows={5}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                />
                <Input
                  label="Tanggal Kejadian"
                  type="date"
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                />
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Foto Bukti</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Upload foto sebagai bukti kerusakan (opsional)</p>
                </div>
                <FileUpload
                  onUpload={(urls) => update("photos", urls)}
                  maxFiles={5}
                />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(s - 1, 0))}
            disabled={step === 0}
          >
            Sebelumnya
          </Button>
          {step < 3 ? (
            <Button onClick={next}>Selanjutnya</Button>
          ) : (
            <Button onClick={submit} loading={loading}>
              Kirim Laporan
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
