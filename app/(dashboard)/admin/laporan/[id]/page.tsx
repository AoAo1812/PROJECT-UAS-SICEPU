"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Skeleton from "@/components/ui/Skeleton";
import ChatPanel from "@/components/chat/ChatPanel";
import { useTranslation } from "@/lib/i18n";

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
  { key: "Menunggu", labelKey: "reports.statusPendingDesc", descKey: "reports.statusPendingInfo", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { key: "Diproses", labelKey: "reports.statusProcessingDesc", descKey: "reports.statusProcessingInfo", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
  { key: "Selesai", labelKey: "reports.statusCompletedDesc", descKey: "reports.statusCompletedInfo", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
];

const priorityColors: Record<string, string> = {
  Rendah: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
  Sedang: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Tinggi: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Darurat: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminLaporanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Menunggu");
  const [adminNote, setAdminNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const rejectRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (rejectMode && rejectRef.current) {
      rejectRef.current.focus();
    }
  }, [rejectMode]);

  const priorityKey: Record<string, string> = {
    Rendah: "reports.priorities.low",
    Sedang: "reports.priorities.medium",
    Tinggi: "reports.priorities.high",
    Darurat: "reports.priorities.urgent",
  };

  const categoryKey: Record<string, string> = {
    Listrik: "reports.categories.electrical",
    Plumbing: "reports.categories.plumbing",
    Furniture: "reports.categories.furniture",
    "IT/Komputer": "reports.categories.it",
    Bangunan: "reports.categories.building",
    Lainnya: "reports.categories.other",
  };

  useEffect(() => {
    fetch(`/api/reports/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        setReport(d.report);
        setStatus(d.report?.status || "Menunggu");
        setAdminNote(d.report?.adminNote || "");
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const save = async () => {
    setSaving(true);
    const res = await fetch(`/api/reports/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, adminNote }),
    });
    if (res.ok) {
      toast.success(t("common.success"));
      setReport((prev) => prev ? { ...prev, status: status as Report["status"], adminNote } : null);
    } else {
      toast.error(t("common.error"));
    }
    setSaving(false);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      return toast.error("Alasan penolakan harus diisi");
    }
    setSaving(true);
    const res = await fetch(`/api/reports/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Ditolak", adminNote: rejectReason }),
    });
    if (res.ok) {
      toast.success(t("admin.reportRejected"));
      setReport((prev) => prev ? { ...prev, status: "Ditolak", adminNote: rejectReason } : null);
      setStatus("Ditolak");
      setRejectMode(false);
      setRejectReason("");
    } else {
      toast.error(t("common.error"));
    }
    setSaving(false);
  };

  const handleProcess = async () => {
    setSaving(true);
    const res = await fetch(`/api/reports/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Diproses", adminNote: adminNote || "Laporan sedang diproses oleh tim teknis" }),
    });
    if (res.ok) {
      toast.success(t("admin.processReport"));
      setReport((prev) => prev ? { ...prev, status: "Diproses", adminNote: adminNote || "Laporan sedang diproses oleh tim teknis" } : null);
      setStatus("Diproses");
    } else {
      toast.error(t("common.error"));
    }
    setSaving(false);
  };

  const handleComplete = async () => {
    setSaving(true);
    const res = await fetch(`/api/reports/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Selesai", adminNote: adminNote || "Kerusakan telah diperbaiki" }),
    });
    if (res.ok) {
      toast.success(t("admin.reportComplete"));
      setReport((prev) => prev ? { ...prev, status: "Selesai", adminNote: adminNote || "Kerusakan telah diperbaiki" } : null);
      setStatus("Selesai");
    } else {
      toast.error(t("common.error"));
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus laporan ini?")) return;
    const res = await fetch(`/api/reports/${params.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success(t("common.success"));
      router.push("/admin/laporan");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">{t("reports.notFound")}</p>
        <Button onClick={() => router.push("/admin/laporan")} className="mt-4">{t("reports.backToListButton")}</Button>
      </div>
    );
  }

  const currentIdx = statusFlow.findIndex((s) => s.key === report.status);

  return (
    <div>
      <Topbar
        title={t("admin.manageReports")}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => router.push("/admin/laporan")}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              {t("common.back")}
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              {t("common.delete")}
            </Button>
          </div>
        }
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Info */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{report.facilityName}</h2>
                  <Badge status={report.status} />
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${priorityColors[report.priority] || priorityColors.Sedang}`}>
                    {t(priorityKey[report.priority] || "reports.priorities.medium")}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {report.location}
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 mb-4">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t("reports.damageDescription")}</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">{report.description}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs text-slate-500 dark:text-slate-400">{t("reports.reporter")}</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{report.userName}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs text-slate-500 dark:text-slate-400">{t("reports.category")}</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{t(categoryKey[report.category] || "reports.categories.other")}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs text-slate-500 dark:text-slate-400">{t("reports.date")}</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{new Date(report.date).toLocaleDateString("id-ID")}</p>
              </div>
            </div>
          </Card>

          {/* Photos */}
          {report.photos && report.photos.length > 0 && (
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">{t("reports.photoEvidence").replace("{n}", String(report.photos.length))}</h3>
              <div className="grid grid-cols-3 gap-3">
                {report.photos.map((photo, i) => (
                  <img key={i} src={photo} alt={`Bukti ${i + 1}`} className="w-full h-32 object-cover rounded-xl border border-slate-200 dark:border-slate-700" />
                ))}
              </div>
            </Card>
          )}

          {/* Timeline */}
          {report.status !== "Ditolak" && (
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-wider">{t("reports.timeline")}</h3>
              <div className="space-y-0">
                {statusFlow.map((s, i) => {
                  const isCompleted = currentIdx > i;
                  const isCurrent = currentIdx === i;
                  const isFuture = currentIdx < i;
                  return (
                    <div key={s.key} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.15 }}
                          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                            isCompleted ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25" :
                            isCurrent ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 animate-pulse-glow" :
                            "bg-slate-200 dark:bg-slate-800 text-slate-400"
                          }`}
                        >
                          {isCompleted ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} /></svg>
                          )}
                        </motion.div>
                        {i < statusFlow.length - 1 && (
                          <div className={`w-0.5 flex-1 min-h-[3rem] ${isCompleted ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"}`} />
                        )}
                      </div>
                      <div className={`pb-6 pt-2 ${isFuture ? "opacity-40" : ""}`}>
                        <p className={`text-sm font-semibold ${isCurrent ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white"}`}>{t(s.labelKey)}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t(s.descKey)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {report.status === "Ditolak" && (
            <Card className="p-6">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30">
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-700 dark:text-red-400">{t("admin.reportRejected")}</p>
                  <p className="text-xs text-red-600 dark:text-red-400/70">{report.adminNote || t("admin.noNote")}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Chat Panel */}
          <Card className="overflow-hidden">
            <ChatPanel reportId={report.id} reportName={report.facilityName} />
          </Card>
        </div>

        {/* Right Column - Action Panel */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">{t("reports.quickActions")}</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  const printWindow = window.open(`/laporan/${report.id}/print`, "_blank");
                  if (printWindow) printWindow.onload = () => printWindow.print();
                }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors w-full text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{t("reports.print")}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t("reports.downloadPdf")}</p>
                </div>
              </button>
              {report.status === "Menunggu" && (
                <>
                  <Button onClick={handleProcess} loading={saving} className="w-full" size="lg">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    {t("admin.processReport")}
                  </Button>
                  <Button onClick={() => setRejectMode(true)} variant="danger" className="w-full" size="lg">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    {t("admin.rejectReport")}
                  </Button>
                </>
              )}
              {report.status === "Diproses" && (
                <>
                  <Button onClick={handleComplete} loading={saving} className="w-full" size="lg">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {t("admin.markComplete")}
                  </Button>
                  <Button onClick={() => setRejectMode(true)} variant="danger" className="w-full" size="lg">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    {t("admin.rejectReport")}
                  </Button>
                </>
              )}
              {report.status === "Selesai" && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 text-center">
                  <svg className="w-8 h-8 text-emerald-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{t("admin.reportComplete")}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400/70">{t("admin.repairDone")}</p>
                </div>
              )}
              {report.status === "Ditolak" && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-center">
                  <svg className="w-8 h-8 text-red-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  <p className="text-sm font-semibold text-red-700 dark:text-red-400">{t("admin.reportRejected")}</p>
                  <p className="text-xs text-red-600 dark:text-red-400/70">{report.adminNote || t("admin.noNote")}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Reject Modal (inline) */}
          {rejectMode && (
            <Card className="p-6 border-red-200 dark:border-red-800/30">
              <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3">{t("admin.rejectReason")}</h3>
              <textarea
                ref={rejectRef}
                placeholder={t("admin.rejectReasonPlaceholder")}
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/30 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 resize-none"
              />
              <div className="flex gap-2 mt-3">
                <Button variant="ghost" size="sm" onClick={() => { setRejectMode(false); setRejectReason(""); }} className="flex-1">{t("common.cancel")}</Button>
                <Button variant="danger" size="sm" onClick={handleReject} loading={saving} className="flex-1">{t("admin.rejectButton")}</Button>
              </div>
            </Card>
          )}

          {/* Admin Notes */}
          {report.adminNote && !rejectMode && (
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">{t("admin.adminNoteLabel")}</h3>
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/30">
                <p className="text-sm text-slate-700 dark:text-slate-300">{report.adminNote}</p>
              </div>
            </Card>
          )}

          {/* Info */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">{t("reports.statusInfoTitle")}</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <span className="text-sm text-slate-500 dark:text-slate-400">{t("reports.reporter")}</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{report.userName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <span className="text-sm text-slate-500 dark:text-slate-400">{t("reports.createdAt")}</span>
                <span className="text-sm text-slate-700 dark:text-slate-300">{new Date(report.createdAt).toLocaleDateString("id-ID")}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">{t("reports.lastUpdate")}</span>
                <span className="text-sm text-slate-700 dark:text-slate-300">{new Date(report.updatedAt).toLocaleDateString("id-ID")}</span>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
