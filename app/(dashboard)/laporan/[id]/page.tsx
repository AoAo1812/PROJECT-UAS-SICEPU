"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import ChatPanel from "@/components/chat/ChatPanel";

interface Report {
  id: string;
  facilityName: string;
  location: string;
  category: string;
  priority: string;
  description: string;
  photos: string[];
  date: string;
  status: "Menunggu" | "Diproses" | "Selesai" | "Ditolak";
  adminNote: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

const statusFlow = [
  { key: "Menunggu", label: "Menunggu", desc: "Laporan diterima, menunggu verifikasi admin", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "amber" },
  { key: "Diproses", label: "Diproses", desc: "Tim teknis sedang menangani laporan", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", color: "blue" },
  { key: "Selesai", label: "Selesai", desc: "Kerusakan telah diperbaiki", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "emerald" },
];

const priorityColors: Record<string, string> = {
  Rendah: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
  Sedang: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Tinggi: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Darurat: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function LaporanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/reports/${params.id}`)
      .then((r) => r.json())
      .then((d) => setReport(d.report))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus laporan ini?")) return;
    const res = await fetch(`/api/reports/${params.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Laporan berhasil dihapus");
      router.push("/laporan");
    } else {
      toast.error("Gagal menghapus laporan");
    }
  };

  const getStatusIndex = (status: string) => {
    if (status === "Ditolak") return -1;
    return statusFlow.findIndex((s) => s.key === status);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Laporan Tidak Ditemukan</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Laporan yang Anda cari mungkin sudah dihapus.</p>
        <Link href="/laporan">
          <Button>Kembali ke Daftar Laporan</Button>
        </Link>
      </div>
    );
  }

  const currentIdx = getStatusIndex(report.status);

  return (
    <div>
      <Topbar
        title="Detail Laporan"
        actions={
          <div className="flex gap-2">
            <Link href="/laporan">
              <Button variant="secondary" size="sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali
              </Button>
            </Link>
            {report.status === "Menunggu" && (
              <Link href={`/laporan/${report.id}/edit`}>
                <Button variant="secondary" size="sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Button>
              </Link>
            )}
            <Button variant="danger" size="sm" onClick={handleDelete}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Hapus
            </Button>
          </div>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid lg:grid-cols-3 gap-6"
      >
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Header */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{report.facilityName}</h2>
                  <Badge status={report.status} />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {report.location}
                </p>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${priorityColors[report.priority] || priorityColors.Sedang}`}>
                {report.priority || "Sedang"}
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Deskripsi Kerusakan</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{report.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Kategori</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{report.category}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Tanggal Kejadian</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {new Date(report.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Dibuat Pada</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {new Date(report.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Timeline Status */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-wider">Timeline Status</h3>

            {report.status === "Ditolak" ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30">
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-500/25">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-red-700 dark:text-red-400">Laporan Ditolak</p>
                    <p className="text-xs text-red-600 dark:text-red-400/70">{report.adminNote || "Tidak ada catatan dari admin"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-0">
                {statusFlow.map((s, i) => {
                  const isCompleted = currentIdx > i;
                  const isCurrent = currentIdx === i;
                  const isFuture = currentIdx < i;

                  return (
                    <div key={s.key} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.15 }}
                          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all ${
                            isCompleted
                              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                              : isCurrent
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 animate-pulse-glow"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                          }`}
                        >
                          {isCompleted ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                            </svg>
                          )}
                        </motion.div>
                        {i < statusFlow.length - 1 && (
                          <div className={`w-0.5 flex-1 min-h-[3rem] ${
                            isCompleted ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
                          }`} />
                        )}
                      </div>

                      <div className={`pb-6 pt-2 ${isFuture ? "opacity-40" : ""}`}>
                        <p className={`text-sm font-semibold ${
                          isCurrent ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white"
                        }`}>
                          {s.label}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.desc}</p>
                        {isCompleted && (
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Selesai</p>
                        )}
                        {isCurrent && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">Status saat ini</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Photos */}
          {report.photos && report.photos.length > 0 && (
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Foto Bukti ({report.photos.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {report.photos.map((photo, i) => (
                  <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img
                      src={photo}
                      alt={`Bukti ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium bg-black/50 px-2 py-1 rounded-lg">
                        Foto {i + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Chat Panel */}
          <Card className="overflow-hidden">
            <ChatPanel reportId={report.id} reportName={report.facilityName} />
          </Card>
        </div>

        {/* Right Column - Info Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Status Laporan</h3>
            <div className="flex items-center gap-3 mb-4">
              <Badge status={report.status} />
            </div>
            {report.status === "Menunggu" && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30">
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Laporan Anda sedang menunggu verifikasi dari admin. Admin akan segera memproses laporan Anda.
                </p>
              </div>
            )}
            {report.status === "Diproses" && (
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  Laporan Anda sedang ditangani oleh tim teknis. Perbaikan sedang dalam proses.
                </p>
              </div>
            )}
            {report.status === "Selesai" && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30">
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Kerusakan telah berhasil diperbaiki oleh tim teknis. Terima kasih telah melaporkan!
                </p>
              </div>
            )}
          </Card>

          {/* Admin Notes */}
          {report.adminNote && (
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Catatan Admin</h3>
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/30">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{report.adminNote}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Info Card */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Informasi</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <span className="text-sm text-slate-500 dark:text-slate-400">ID Laporan</span>
                <span className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{report.id.slice(0, 8)}...</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <span className="text-sm text-slate-500 dark:text-slate-400">Pelapor</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{report.userName}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <span className="text-sm text-slate-500 dark:text-slate-400">Dibuat</span>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {new Date(report.createdAt).toLocaleDateString("id-ID")}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Terakhir Update</span>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {new Date(report.updatedAt).toLocaleDateString("id-ID")}
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Aksi Cepat</h3>
            <div className="space-y-2">
              <Link href="/laporan/baru" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Buat Laporan Baru</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Laporkan kerusakan lain</p>
                </div>
              </Link>
              <Link href="/laporan" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Lihat Semua Laporan</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Kembali ke daftar</p>
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
