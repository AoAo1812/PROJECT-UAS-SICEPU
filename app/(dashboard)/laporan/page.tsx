"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import Topbar from "@/components/layout/Topbar";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import Skeleton from "@/components/ui/Skeleton";

interface Report {
  id: string;
  facilityName: string;
  location: string;
  category: string;
  status: "Menunggu" | "Diproses" | "Selesai" | "Ditolak";
  createdAt: string;
  photos: string[];
}

interface Stats {
  total: number;
  menunggu: number;
  diproses: number;
  selesai: number;
  ditolak: number;
}

export default function LaporanPage() {
  return (
    <Suspense fallback={<div className="space-y-6"><Skeleton className="h-10 w-48" /><Skeleton className="h-96" /></div>}>
      <LaporanContent />
    </Suspense>
  );
}

function LaporanContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "";
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reports.length === 0) setLoading(true);
    Promise.all([
      fetch(`/api/reports?${new URLSearchParams({ page: String(page), limit: "10", ...(search ? { search } : {}), ...(statusFilter ? { status: statusFilter } : {}) })}`).then((r) => r.json()),
      fetch("/api/reports/stats").then((r) => r.json()),
    ]).then(([reportsData, statsData]) => {
      setReports(reportsData.reports || []);
      setTotal(reportsData.total || 0);
      setTotalPages(reportsData.totalPages || 1);
      setStats(statsData.stats);
    }).finally(() => setLoading(false));
  }, [page, statusFilter]);

  useEffect(() => {
    const timeout = setTimeout(() => { setPage(1); }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const columns = [
    {
      key: "facilityName",
      label: t("reports.facility"),
      render: (r: Report) => (
        <div className="flex items-center gap-3">
          {r.photos && r.photos.length > 0 ? (
            <img src={r.photos[0]} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          )}
          <div>
            <p className="font-medium text-slate-900 dark:text-white">{r.facilityName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{r.location}</p>
          </div>
        </div>
      ),
    },
    { key: "category", label: t("reports.category"), render: (r: Report) => <span className="text-slate-600 dark:text-slate-400 text-sm">{r.category}</span> },
    {
      key: "status",
      label: t("reports.status"),
      render: (r: Report) => <Badge status={r.status} />,
    },
    {
      key: "createdAt",
      label: t("reports.date"),
      render: (r: Report) => (
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {new Date(r.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (r: Report) => (
        <Link href={`/laporan/${r.id}`}>
          <Button variant="ghost" size="sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {t("reports.detailButton")}
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <Topbar
        title={t("reports.list")}
        subtitle={t("reports.subtitle")}
        actions={
          <Link href="/laporan/baru">
            <Button>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {"+ " + t("reports.createNew")}
            </Button>
          </Link>
        }
      />

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}
          className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 ${
            statusFilter === "Menunggu"
              ? "bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700 shadow-md shadow-amber-500/10"
              : "bg-white dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800/80 hover:border-amber-300 dark:hover:border-amber-700"
          }`}
          onClick={() => { setStatusFilter(statusFilter === "Menunggu" ? "" : "Menunggu"); setPage(1); }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t("dashboard.pending")}</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats?.menunggu || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/25">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}
          className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 ${
            statusFilter === "Diproses"
              ? "bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700 shadow-md shadow-blue-500/10"
              : "bg-white dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800/80 hover:border-blue-300 dark:hover:border-blue-700"
          }`}
          onClick={() => { setStatusFilter(statusFilter === "Diproses" ? "" : "Diproses"); setPage(1); }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t("dashboard.processing")}</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats?.diproses || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}
          className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 ${
            statusFilter === "Selesai"
              ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700 shadow-md shadow-emerald-500/10"
              : "bg-white dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-300 dark:hover:border-emerald-700"
          }`}
          onClick={() => { setStatusFilter(statusFilter === "Selesai" ? "" : "Selesai"); setPage(1); }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t("dashboard.completed")}</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats?.selesai || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}
          className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 ${
            statusFilter === "Ditolak"
              ? "bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-700 shadow-md shadow-red-500/10"
              : "bg-white dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800/80 hover:border-red-300 dark:hover:border-red-700"
          }`}
          onClick={() => { setStatusFilter(statusFilter === "Ditolak" ? "" : "Ditolak"); setPage(1); }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t("dashboard.rejected")}</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{stats?.ditolak || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-red-500/25">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Status Info */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-medium text-slate-900 dark:text-white">{t("reports.totalCount").replace("{total}", String(total))}</span> — {t("reports.clickCard")} <span className="font-medium text-blue-600 dark:text-blue-400">{t("reports.detailButton")}</span> {t("reports.forDetails")}
          </div>
        </div>
      </Card>

      {/* Reports Table */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { value: "", label: t("reports.all") },
            { value: "Menunggu", label: t("dashboard.pending"), color: "amber" },
            { value: "Diproses", label: t("dashboard.processing"), color: "blue" },
            { value: "Selesai", label: t("dashboard.completed"), color: "emerald" },
            { value: "Ditolak", label: t("dashboard.rejected"), color: "red" },
          ].map((s) => (
            <button
              key={s.value}
              onClick={() => { setStatusFilter(s.value); setPage(1); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === s.value
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <DataTable
          columns={columns}
          data={reports}
          total={total}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          searchPlaceholder={t("reports.searchPlaceholder")}
          paginationLabels={{
            previous: t("pagination.previous"),
            next: t("pagination.next"),
            page: t("pagination.page"),
            of: t("pagination.of"),
          }}
        />
      </Card>
    </div>
  );
}
