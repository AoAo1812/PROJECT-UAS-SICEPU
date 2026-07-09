"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Topbar from "@/components/layout/Topbar";
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
  priority: string;
  userName: string;
  createdAt: string;
}

interface ChatInfo {
  totalMessages: number;
  unreadFromUsers: number;
}

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<Stats | null>(null);
  const [monthly, setMonthly] = useState<{ month: string; count: number }[]>([]);
  const [recent, setRecent] = useState<Report[]>([]);
  const [chatInfo, setChatInfo] = useState<ChatInfo>({ totalMessages: 0, unreadFromUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">("monthly");

  const priorityKey: Record<string, string> = {
    Rendah: "reports.priorities.low",
    Sedang: "reports.priorities.medium",
    Tinggi: "reports.priorities.high",
    Darurat: "reports.priorities.urgent",
  };

  useEffect(() => {
    Promise.all([
      fetch(`/api/reports/stats?period=${period}`).then((r) => r.json()),
      fetch("/api/reports?limit=15").then((r) => r.json()),
      fetch("/api/chats").then((r) => r.json()),
    ]).then(([statsData, reportsData, chatData]) => {
      setStats(statsData.stats);
      setMonthly(statsData.monthly || []);
      setRecent(reportsData.reports || []);
      const msgs = chatData.messages || [];
      setChatInfo({
        totalMessages: msgs.length,
        unreadFromUsers: msgs.filter((m: { senderRole: string }) => m.senderRole === "user").length,
      });
    }).finally(() => setLoading(false));
  }, [period]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div>
      <Topbar
        title={t("nav.dashboard")}
        subtitle={t("admin.overview")}
        actions={
          <Link href="/admin/laporan">
            <Button>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              {t("admin.manageReports")}
            </Button>
          </Link>
        }
      />

      {/* Urgent Alert */}
      {stats && stats.menunggu > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200/80 dark:border-amber-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                {t("admin.newReports").replace("{n}", String(stats.menunggu))}
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400/70">
                {t("admin.processNow")}
              </p>
            </div>
            <Link href="/admin/laporan?status=Menunggu">
              <Button size="sm" className="shrink-0">{t("admin.processNowButton")}</Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Laporan Masuk */}
        <motion.div whileHover={{ y: -2 }} className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{t("admin.total")}</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.total || 0}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t("admin.reportsIn")}</p>
        </motion.div>

        {/* Perlu Diproses */}
        <motion.div whileHover={{ y: -2 }} className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200/80 dark:border-amber-800/30 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/25">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            {stats && stats.menunggu > 0 && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
          </div>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats?.menunggu || 0}</p>
          <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">{t("admin.needsProcessing")}</p>
        </motion.div>

        {/* Sedang Dikerjakan */}
        <motion.div whileHover={{ y: -2 }} className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/80 dark:border-blue-800/30 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats?.diproses || 0}</p>
          <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">{t("admin.beingProcessed")}</p>
        </motion.div>

        {/* Chat Masuk */}
        <motion.div whileHover={{ y: -2 }} className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
            {chatInfo.unreadFromUsers > 0 && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
          </div>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{chatInfo.totalMessages}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t("admin.totalChat")}</p>
        </motion.div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <motion.div whileHover={{ y: -1 }} className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/30 text-center">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats?.selesai || 0}</p>
          <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">{t("dashboard.completed")}</p>
        </motion.div>
        <motion.div whileHover={{ y: -1 }} className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200/80 dark:border-red-800/30 text-center">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats?.ditolak || 0}</p>
          <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">{t("dashboard.rejected")}</p>
        </motion.div>
        <motion.div whileHover={{ y: -1 }} className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-800/30 text-center">
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats?.thisMonth || 0}</p>
          <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">{t("admin.thisMonth")}</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t("dashboard.monthlyChart")}</h3>
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
          {monthly.length > 0 ? <ReportsChart data={monthly} /> : <div className="h-64 flex items-center justify-center text-sm text-slate-400">{t("dashboard.noData")}</div>}
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">{t("admin.statusDistribution")}</h3>
          {stats && (stats.menunggu + stats.diproses + stats.selesai + stats.ditolak) > 0 ? (
            <StatusChart data={[
              { label: t("dashboard.pending"), value: stats.menunggu || 0, color: "#F59E0B" },
              { label: t("dashboard.processing"), value: stats.diproses || 0, color: "#3B82F6" },
              { label: t("dashboard.completed"), value: stats.selesai || 0, color: "#10B981" },
              { label: t("dashboard.rejected"), value: stats.ditolak || 0, color: "#EF4444" },
            ]} />
          ) : <div className="h-56 flex items-center justify-center text-sm text-slate-400">{t("dashboard.noData")}</div>}
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t("dashboard.recentReports")}</h3>
          <Link href="/admin/laporan"><Button variant="ghost" size="sm">{t("dashboard.viewAll")}</Button></Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-center text-slate-500 py-8">{t("dashboard.noReports")}</p>
        ) : (
          <div className="space-y-2">
            {recent.map((r) => {
              const priorityColors: Record<string, string> = { Rendah: "bg-slate-100 text-slate-600", Sedang: "bg-blue-100 text-blue-600", Tinggi: "bg-amber-100 text-amber-600", Darurat: "bg-red-100 text-red-600" };
              return (
                <Link key={r.id} href={`/admin/laporan/${r.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-8 rounded-full shrink-0 ${
                      r.status === "Menunggu" ? "bg-amber-500" :
                      r.status === "Diproses" ? "bg-blue-500" :
                      r.status === "Selesai" ? "bg-emerald-500" : "bg-red-500"
                    }`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{r.facilityName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{r.userName} &middot; {r.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${priorityColors[r.priority] || priorityColors.Sedang}`}>
                      {t(priorityKey[r.priority] || "reports.priorities.medium")}
                    </span>
                    <Badge status={r.status} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
