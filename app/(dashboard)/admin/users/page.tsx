"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Topbar from "@/components/layout/Topbar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Avatar from "@/components/ui/Avatar";
import DataTable from "@/components/ui/DataTable";
import { useTranslation } from "@/lib/i18n";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [search, setSearch] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    fetch("/api/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.users || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const openAdd = () => {
    setForm({ name: "", email: "", password: "", role: "user" });
    setEditId(null);
    setModal("add");
  };

  const openEdit = (u: User) => {
    setForm({ name: u.name, email: u.email, password: "", role: u.role });
    setEditId(u.id);
    setModal("edit");
  };

  const save = async () => {
    const url = editId ? `/api/users/${editId}` : "/api/users";
    const method = editId ? "PUT" : "POST";
    const body = editId && !form.password
      ? { name: form.name, email: form.email, role: form.role }
      : form;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || t("common.error"));
      return;
    }
    toast.success(editId ? t("common.success") : t("common.success"));
    setModal(null);
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success(t("common.success"));
      fetchUsers();
    } else {
      const data = await res.json();
      toast.error(data.error || t("common.error"));
    }
  };

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Topbar
        title={t("admin.manageUsersTitle")}
        actions={
          <Button onClick={openAdd}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t("admin.addUser")}
          </Button>
        }
      />

      <Card className="p-6">
        <div className="mb-4 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("admin.searchUser")}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">{t("admin.userHeader")}</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">{t("admin.emailHeader")}</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">{t("admin.roleHeader")}</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-400">{t("admin.actionHeader")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-12 text-center text-slate-500">{t("admin.noUser")}</td></tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} size="sm" />
                        <span className="font-medium text-slate-900 dark:text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${u.role === "admin" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"}`}>
                        {u.role === "admin" ? t("admin.adminRole") : t("admin.userRole")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(u)}>{t("common.edit")}</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-700">{t("common.delete")}</Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === "edit" ? t("admin.editUserTitle") : t("admin.addUserTitle")}>
        <div className="space-y-4">
          <Input
            label={t("admin.nameLabel")}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label={t("admin.emailLabel")}
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label={modal === "edit" ? t("admin.passwordNew") : t("admin.passwordLabel")}
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Select
            label={t("admin.roleLabel")}
            options={[
              { value: "user", label: t("admin.userRole") },
              { value: "admin", label: t("admin.adminRole") },
            ]}
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setModal(null)}>{t("common.cancel")}</Button>
            <Button onClick={save}>{t("admin.saveButton")}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
