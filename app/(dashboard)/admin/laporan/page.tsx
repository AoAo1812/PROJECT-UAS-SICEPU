"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import Topbar from "@/components/layout/Topbar";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import DataTable from "@/components/ui/DataTable";
import Skeleton from "@/components/ui/Skeleton";
import { useTranslation } from "@/lib/i18n";

interface Report {
  id: string;
  facilityName: string;
  location: string;
  category: string;
  priority: string;
  status: "Menunggu" | "Diproses" | "Selesai" | "Ditolak";
  userName: string;
  createdAt: string;
}

export default function AdminLaporanPage() {
  const { t } = useTranslation();
  const [reports, setReports] = useState<Report[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<Report | null>(null);
  const [editForm, setEditForm] = useState({ status: "Menunggu", adminNote: "" });
  const [saving, setSaving] = useState(false);

  const categoryKey: Record<string, string> = {
    Listrik: "reports.categories.electrical",
    Plumbing: "reports.categories.plumbing",
    Furniture: "reports.categories.furniture",
    "IT/Komputer": "reports.categories.it",
    Bangunan: "reports.categories.building",
    Lainnya: "reports.categories.other",
  };

  const priorityKey: Record<string, string> = {
    Rendah: "reports.priorities.low",
    Sedang: "reports.priorities.medium",
    Tinggi: "reports.priorities.high",
    Darurat: "reports.priorities.urgent",
  };

  const fetchReports = () => {
    if (reports.length === 0) setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "10" });
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    fetch(`/api/reports?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setReports(d.reports || []);
        setTotal(d.total || 0);
        setTotalPages(d.totalPages || 1);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReports(); }, [page, statusFilter]);

  useEffect(() => {
    const timeout = setTimeout(() => { setPage(1); fetchReports(); }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const openEdit = (report: Report) => {
    setEditModal(report);
    setEditForm({ status: report.status, adminNote: "" });
  };

  const saveEdit = async () => {
    if (!editModal) return;
    setSaving(true);
    const res = await fetch(`/api/reports/${editModal.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      toast.success(t("common.success"));
      setEditModal(null);
      fetchReports();
    } else {
      const data = await res.json();
      toast.error(data.error || t("common.error"));
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus laporan "${name}"?`)) return;
    const res = await fetch(`/api/reports/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success(t("common.success"));
      fetchReports();
    } else {
      toast.error(t("common.error"));
    }
  };

  const columns = [
    {
      key: "facilityName",
      label: t("reports.facility"),
      render: (r: Report) => (
        <div>
          <p className="font-medium text-slate-900 dark:text-white">{r.facilityName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{r.location}</p>
        </div>
      ),
    },
    { key: "userName", label: t("reports.reporter"), render: (r: Report) => <span className="text-slate-600 dark:text-slate-400 text-sm">{r.userName}</span> },
    { key: "category", label: t("reports.category"), render: (r: Report) => <span className="text-slate-600 dark:text-slate-400 text-sm">{t(categoryKey[r.category] || "reports.categories.other")}</span> },
    {
      key: "priority",
      label: t("reports.priority"),
      render: (r: Report) => {
        const colors: Record<string, string> = {
          Rendah: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
          Sedang: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
          Tinggi: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
          Darurat: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        };
        return <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${colors[r.priority] || colors.Sedang}`}>{t(priorityKey[r.priority] || "reports.priorities.medium")}</span>;
      },
    },
    { key: "status", label: t("reports.status"), render: (r: Report) => <Badge status={r.status} /> },
    {
      key: "createdAt",
      label: t("reports.date"),
      render: (r: Report) => <span className="text-sm text-slate-500 dark:text-slate-400">{new Date(r.createdAt).toLocaleDateString("id-ID")}</span>,
    },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (r: Report) => (
        <div className="flex justify-end gap-1">
          <Link href={`/admin/laporan/${r.id}`}>
            <Button variant="ghost" size="sm">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              {t("reports.detailButton")}
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => openEdit(r)}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            {t("admin.updateStatus")}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(r.id, r.facilityName)} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            {t("common.delete")}
          </Button>
        </div>
      ),
    },
  ];

  if (loading && reports.length === 0) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div>
      <Topbar
        title={t("admin.manageReports")}
        subtitle={t("reports.subtitle")}
      />

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { value: "", label: t("reports.all"), dot: "" },
          { value: "Menunggu", label: t("dashboard.pending"), dot: "bg-amber-500" },
          { value: "Diproses", label: t("dashboard.processing"), dot: "bg-blue-500" },
          { value: "Selesai", label: t("dashboard.completed"), dot: "bg-emerald-500" },
          { value: "Ditolak", label: t("dashboard.rejected"), dot: "bg-red-500" },
        ].map((s) => (
          <button
            key={s.value}
            onClick={() => { setStatusFilter(s.value); setPage(1); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              statusFilter === s.value
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                : "bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-700"
            }`}
          >
            {s.dot && <span className={`w-2 h-2 rounded-full ${s.dot}`} />}
            {s.label}
          </button>
        ))}
      </div>

      <Card className="p-6">
        <DataTable
          columns={columns}
          data={reports}
          total={total}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          searchPlaceholder={t("admin.searchPlaceholder")}
          paginationLabels={{
            previous: t("pagination.previous"),
            next: t("pagination.next"),
            page: t("pagination.page"),
            of: t("pagination.of"),
          }}
        />
      </Card>

      {/* Edit Status Modal */}
      <Modal open={!!editModal} onClose={() => setEditModal(null)} title={t("admin.changeStatus").replace("{name}", editModal?.facilityName || "")}>
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm">
            <p className="text-slate-500 dark:text-slate-400">{t("admin.reporterLabel")} <span className="font-medium text-slate-900 dark:text-white">{editModal?.userName}</span></p>
            <p className="text-slate-500 dark:text-slate-400">{t("admin.locationLabel")} <span className="font-medium text-slate-900 dark:text-white">{editModal?.location}</span></p>
          </div>
          <Select
            label={t("admin.statusLabel")}
            options={[
              { value: "Menunggu", label: t("admin.statusPending") },
              { value: "Diproses", label: t("admin.statusProcessing") },
              { value: "Selesai", label: t("admin.statusCompleted") },
              { value: "Ditolak", label: t("admin.statusRejected") },
            ]}
            value={editForm.status}
            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
          />
          <Textarea
            label={t("admin.adminNoteLabel")}
            placeholder={t("admin.adminNotePlaceholder")}
            rows={3}
            value={editForm.adminNote}
            onChange={(e) => setEditForm({ ...editForm, adminNote: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setEditModal(null)}>{t("common.cancel")}</Button>
            <Button onClick={saveEdit} loading={saving}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              {t("admin.saveStatus")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
