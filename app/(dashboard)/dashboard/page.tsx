"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Topbar from "@/components/layout/Topbar";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import ReportsChart from "@/components/charts/ReportsChart";
import StatusChart from "@/components/charts/StatusChart";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { useTranslation } from "@/lib/i18n";

interface Stats {
  total: number;
  menunggu: number;
  diproses: number;
  selesai: number;
  ditolak: number;
  thisMonth: number;
}

interface Report {
  id: string;
  facilityName: string;
  location: string;
  status: "Menunggu" | "Diproses" | "Selesai" | "Ditolak";
  createdAt: string;
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<Stats | null>(null);
  const [monthly, setMonthly] = useState<{ month: string; count: number }[]>([]);
  const [recent, setRecent] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">("monthly");

  useEffect(() => {
    Promise.all([
      fetch(`/api/reports/stats?period=${period}`).then((r) => r.json()),
      fetch("/api/reports?limit=5").then((r) => r.json()),
    ]).then(([statsData, reportsData]) => {
      setStats(statsData.stats);
      setMonthly(statsData.monthly || []);
      setRecent(reportsData.reports || []);
    }).finally(() => setLoading(false));
  }, [period]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 lg:col-span-2" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Topbar
        title={t("nav.dashboard")}
        subtitle={t("dashboard.welcomeBack") + " " + t("dashboard.summary")}
        actions={
          <Link href="/laporan/baru">
            <Button>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t("reports.create")}
            </Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title={t("dashboard.totalReports")} value={stats?.total || 0} color="blue"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
        <StatCard title={t("dashboard.pending")} value={stats?.menunggu || 0} color="amber" trend={stats?.menunggu ? `${stats.menunggu} ${t("dashboard.pendingTrend")}` : undefined}
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard title={t("dashboard.processing")} value={stats?.diproses || 0} color="purple" trend={stats?.diproses ? `${stats.diproses} ${t("dashboard.processingTrend")}` : undefined}
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>} />
        <StatCard title={t("dashboard.completed")} value={stats?.selesai || 0} color="green" trend={stats?.selesai ? `${stats.selesai} ${t("dashboard.completedTrend")}` : undefined}
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
      </div>

      {/* Quick Status Banner */}
      {stats && stats.menunggu > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200/80 dark:border-amber-800/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                {t("dashboard.pendingAlert").replace("{n}", String(stats.menunggu))}
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400/70">
                {t("dashboard.pendingAlertDesc")}
              </p>
            </div>
            <Link href="/laporan?status=Menunggu">
              <Button variant="secondary" size="sm" className="shrink-0">{t("dashboard.view")}</Button>
            </Link>
          </div>
        </motion.div>
      )}

      {stats && stats.diproses > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/80 dark:border-blue-800/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                {t("dashboard.processingAlert").replace("{n}", String(stats.diproses))}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400/70">
                {t("dashboard.processingAlertDesc")}
              </p>
            </div>
            <Link href="/laporan?status=Diproses">
              <Button variant="secondary" size="sm" className="shrink-0">{t("dashboard.view")}</Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t("dashboard.chartTitle")}</h3>
            <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              {(["weekly", "monthly", "yearly"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    period === p
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {t(`dashboard.period.${p}`)}
                </button>
              ))}
            </div>
          </div>
          {monthly.length > 0 ? (
            <ReportsChart data={monthly} />
          ) : (
            <div className="h-64 flex items-center justify-center text-sm text-slate-400">{t("dashboard.noData")}</div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">{t("dashboard.statusChart")}</h3>
          {stats && (stats.menunggu + stats.diproses + stats.selesai + stats.ditolak) > 0 ? (
            <StatusChart
              data={[
                { label: t("dashboard.pending"), value: stats.menunggu || 0, color: "#F59E0B" },
                { label: t("dashboard.processing"), value: stats.diproses || 0, color: "#3B82F6" },
                { label: t("dashboard.completed"), value: stats.selesai || 0, color: "#10B981" },
                { label: t("dashboard.rejected"), value: stats.ditolak || 0, color: "#EF4444" },
              ]}
            />
          ) : (
            <div className="h-56 flex items-center justify-center text-sm text-slate-400">{t("dashboard.noData")}</div>
          )}
        </Card>
      </div>

      {/* Recent Reports + Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t("dashboard.recentReports")}</h3>
            <Link href="/laporan">
              <Button variant="ghost" size="sm">{t("dashboard.viewAll")}</Button>
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">{t("dashboard.noReports")}</p>
              <Link href="/laporan/baru">
                <Button size="sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {t("dashboard.createFirst")}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recent.map((r) => (
                <Link
                  key={r.id}
                  href={`/laporan/${r.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                      <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{r.facilityName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{r.location}</p>
                    </div>
                  </div>
                  <Badge status={r.status} />
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Activity Timeline */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t("dashboard.recentActivity")}</h3>
          </div>
          {recent.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t("dashboard.noActivity")}</p>
            </div>
          ) : (
            <div className="space-y-0">
              {recent.map((r, i) => {
                const statusColors: Record<string, string> = {
                  Menunggu: "bg-amber-500",
                  Diproses: "bg-blue-500",
                  Selesai: "bg-emerald-500",
                  Ditolak: "bg-red-500",
                };
                const statusText: Record<string, string> = {
                  Menunggu: t("dashboard.createdReport"),
                  Diproses: t("dashboard.reportProcessing"),
                  Selesai: t("dashboard.reportCompleted"),
                  Ditolak: t("dashboard.reportRejected"),
                };

                return (
                  <Link key={r.id} href={`/laporan/${r.id}`} className="flex gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-xl p-1 -mx-1 transition-colors">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${statusColors[r.status]} mt-1.5 shrink-0`} />
                      {i < recent.length - 1 && (
                        <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-800 mt-1" />
                      )}
                    </div>
                    <div className="pb-5 pt-0.5">
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        <span className="font-medium text-slate-900 dark:text-white">{r.facilityName}</span>
                        {" "}{statusText[r.status]}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {new Date(r.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
