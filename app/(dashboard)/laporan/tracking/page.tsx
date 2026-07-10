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
  priority: string;
  status: "Menunggu" | "Diproses" | "Selesai" | "Ditolak";
  description: string;
  adminNote: string;
  createdAt: string;
  updatedAt: string;
}

export default function TrackingPage() {
  const { t } = useTranslation();
  const [reports, setReports] = useState<TrackingReport[]>([]);
  const [selected, setSelected] = useState<TrackingReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports?limit=50")
      .then((r) => r.json())
      .then((data) => {
        const list = data.reports || [];
        setReports(list);
        if (list.length > 0) setSelected(list[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  const statusColors: Record<string, string> = {
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
                <span className="font-mono">{r.id.slice(0, 8)}</span>
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
                      <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mb-1">{selected.id.slice(0, 8)}</p>
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
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${statusColors["Menunggu"]} mt-1.5 shrink-0`} />
                          <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-800 mt-1" />
                        </div>
                        <div className="pb-6 pt-0.5">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge status="Menunggu" />
                            <span className="text-xs text-slate-400 dark:text-slate-500">
                              {new Date(selected.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Laporan diterima sistem</p>
                        </div>
                      </div>

                      {(selected.status === "Diproses" || selected.status === "Selesai" || selected.status === "Ditolak") && (
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${statusColors[selected.status]} mt-1.5 shrink-0`} />
                          </div>
                          <div className="pb-6 pt-0.5">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge status={selected.status} />
                              <span className="text-xs text-slate-400 dark:text-slate-500">
                                {new Date(selected.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {selected.status === "Diproses" && "Tim teknis ditugaskan"}
                              {selected.status === "Selesai" && "Laporan selesai ditangani"}
                              {selected.status === "Ditolak" && "Laporan ditolak oleh admin"}
                            </p>
                          </div>
                        </div>
                      )}
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
