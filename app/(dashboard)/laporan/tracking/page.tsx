"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { useTranslation } from "@/lib/i18n";
import Link from "next/link";

interface TrackingReport {
  id: string;
  facilityName: string;
  location: string;
  category: string;
  status: "Menunggu" | "Diproses" | "Selesai" | "Ditolak";
  createdAt: string;
  updatedAt: string;
  description: string;
  adminNote: string;
  timeline: { status: string; date: string; note?: string }[];
}

const dummyReports: TrackingReport[] = [
  {
    id: "RPT-001",
    facilityName: "Proyektor Ruang 301",
    location: "Gedung Teknik Lantai 3",
    category: "Peralatan",
    status: "Diproses",
    createdAt: "2026-07-01T08:30:00Z",
    updatedAt: "2026-07-03T14:20:00Z",
    description: "Proyektor tidak menampilkan gambar dengan jelas, gambar buram dan berkedip.",
    adminNote: "Tim teknis sudah dihubungi, pengecekan dijadwalkan besok.",
    timeline: [
      { status: "Menunggu", date: "2026-07-01T08:30:00Z", note: "Laporan diterima sistem" },
      { status: "Diproses", date: "2026-07-03T14:20:00Z", note: "Tim teknis ditugaskan" },
    ],
  },
  {
    id: "RPT-002",
    facilityName: "AC Ruang Dosen",
    location: "Gedung Fakultas Lantai 2",
    category: "Fasilitas Ruangan",
    status: "Menunggu",
    createdAt: "2026-07-05T10:15:00Z",
    updatedAt: "2026-07-05T10:15:00Z",
    description: "AC tidak dingin dan mengeluarkan suara bising.",
    adminNote: "",
    timeline: [
      { status: "Menunggu", date: "2026-07-05T10:15:00Z", note: "Laporan diterima sistem" },
    ],
  },
  {
    id: "RPT-003",
    facilityName: "Lampu Koridor",
    location: "Gedung Utama Lantai 1",
    category: "Listrik & Air",
    status: "Selesai",
    createdAt: "2026-06-20T09:00:00Z",
    updatedAt: "2026-06-25T16:00:00Z",
    description: "3 lampu di koridor lantai 1 mati total.",
    adminNote: "Lampu sudah diganti. Mohon dicek kembali.",
    timeline: [
      { status: "Menunggu", date: "2026-06-20T09:00:00Z", note: "Laporan diterima sistem" },
      { status: "Diproses", date: "2026-06-21T08:00:00Z", note: "Tim listrik ditugaskan" },
      { status: "Selesai", date: "2026-06-25T16:00:00Z", note: "Lampu sudah diganti" },
    ],
  },
  {
    id: "RPT-004",
    facilityName: "WiFi Lab Komputer",
    location: "Lab Komputer Lantai 2",
    category: "Jaringan & Internet",
    status: "Selesai",
    createdAt: "2026-06-15T13:45:00Z",
    updatedAt: "2026-06-18T11:30:00Z",
    description: "Koneksi WiFi sangat lambat dan sering putus.",
    adminNote: "Router sudah di-restart dan firmware di-update.",
    timeline: [
      { status: "Menunggu", date: "2026-06-15T13:45:00Z", note: "Laporan diterima sistem" },
      { status: "Diproses", date: "2026-06-16T09:00:00Z", note: "Tim IT mengecek jaringan" },
      { status: "Selesai", date: "2026-06-18T11:30:00Z", note: "Router di-restart, firmware di-update" },
    ],
  },
  {
    id: "RPT-005",
    facilityName: "Kursi Ruang Seminar",
    location: "Gedung Serbaguna",
    category: "Furniture",
    status: "Ditolak",
    createdAt: "2026-06-28T07:20:00Z",
    updatedAt: "2026-06-29T09:10:00Z",
    description: "Beberapa kursi rusak dan tidak bisa dilipat.",
    adminNote: "Kerusakan dikategorikan sebagai normal wear, tidak termasuk cakupan perbaikan.",
    timeline: [
      { status: "Menunggu", date: "2026-06-28T07:20:00Z", note: "Laporan diterima sistem" },
      { status: "Ditolak", date: "2026-06-29T09:10:00Z", note: "Normal wear, di luar cakupan" },
    ],
  },
];

export default function TrackingPage() {
  const { t } = useTranslation();
  const [reports] = useState<TrackingReport[]>(dummyReports);
  const [selected, setSelected] = useState<TrackingReport | null>(dummyReports[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const statusColors: Record<string, string> = {
    Menunggu: "bg-amber-500",
    Diproses: "bg-blue-500",
    Selesai: "bg-emerald-500",
    Ditolak: "bg-red-500",
  };

  const statusDotColors: Record<string, string> = {
    Menunggu: "bg-amber-500",
    Diproses: "bg-blue-500",
    Selesai: "bg-emerald-500",
    Ditolak: "bg-red-500",
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28" />)}
          </div>
          <Skeleton className="lg:col-span-3 h-96" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Topbar
        title={t("tracking.title")}
        subtitle={t("tracking.subtitle")}
        actions={
          <Link href="/laporan/baru">
            <Button>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t("reports.createNew")}
            </Button>
          </Link>
        }
      />

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Report List */}
        <div className="lg:col-span-2 space-y-2">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 px-1">
            {t("tracking.totalReports").replace("{n}", String(reports.length))}
          </p>
          {reports.map((r) => (
            <motion.div
              key={r.id}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
              onClick={() => setSelected(r)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                selected?.id === r.id
                  ? "bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700 shadow-md shadow-blue-500/10"
                  : "bg-white dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800/80 hover:border-blue-200 dark:hover:border-blue-800"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{r.facilityName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{r.location}</p>
                </div>
                <Badge status={r.status} />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <span className="font-mono">{r.id}</span>
                <span>&middot;</span>
                <span>{new Date(r.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mb-1">{selected.id}</p>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selected.facilityName}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{selected.location}</p>
                    </div>
                    <Badge status={selected.status} />
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t("tracking.category")}</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{selected.category}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t("tracking.createdAt")}</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                        {new Date(selected.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">{t("tracking.description")}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{selected.description}</p>
                  </div>

                  {/* Admin Note */}
                  {selected.adminNote && (
                    <div className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-800/30">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">{t("tracking.adminNote")}</p>
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-400">{selected.adminNote}</p>
                    </div>
                  )}

                  {/* Timeline */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">{t("tracking.timeline")}</h4>
                    <div className="space-y-0">
                      {selected.timeline.map((item, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${statusDotColors[item.status]} mt-1.5 shrink-0`} />
                            {i < selected.timeline.length - 1 && (
                              <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-800 mt-1" />
                            )}
                          </div>
                          <div className="pb-6 pt-0.5">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge status={item.status as "Menunggu" | "Diproses" | "Selesai" | "Ditolak"} />
                              <span className="text-xs text-slate-400 dark:text-slate-500">
                                {new Date(item.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                            {item.note && (
                              <p className="text-sm text-slate-600 dark:text-slate-400">{item.note}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <Link href={`/laporan/${selected.id}`}>
                      <Button variant="secondary" size="sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {t("reports.detailButton")}
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t("tracking.selectReport")}</p>
              </Card>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
