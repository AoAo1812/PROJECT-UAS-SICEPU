"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n";

export default function ProfilPage() {
  const { t } = useTranslation();
  const [user, setUser] = useState({ name: "", email: "", avatar: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser({ name: d.user.name, email: d.user.email, avatar: d.user.avatar || "" }));
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.error(t("profile.maxSizeToast"));
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const avatarUrl = data.url;
      const updateRes = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: user.name, email: user.email, avatar: avatarUrl }),
      });
      const updateData = await updateRes.json();
      if (!updateRes.ok) throw new Error(updateData.error);

      setUser({ ...user, avatar: avatarUrl });
      toast.success(t("profile.avatarUpdated"));
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : t("profile.avatarError"));
    } finally {
      setUploading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(t("profile.profileUpdated"));
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : t("profile.profileError"));
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error(t("profile.passwordMismatch"));
    }
    setLoading(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(t("profile.passwordChanged"));
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : t("profile.passwordError"));
    } finally {
      setLoading(false);
    }
  };

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div>
      <Topbar title={t("profile.myProfile")} />

      {/* Avatar Section */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{t("profile.photoSection")}</h3>
        <div className="flex items-center gap-6">
          <div className="relative group">
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover ring-2 ring-white dark:ring-slate-900 shadow-lg" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold ring-2 ring-white dark:ring-slate-900 shadow-lg">
                {initials}
              </div>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {uploading ? (
                <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()} loading={uploading}>
              {user.avatar ? t("profile.changeAvatar") : t("profile.uploadAvatar")}
            </Button>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{t("profile.maxSize")}</p>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">{t("profile.infoSection")}</h3>
          <form onSubmit={updateProfile} className="space-y-4">
            <Input
              label={t("profile.fullName")}
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
            <Input
              label={t("profile.emailLabel")}
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            <Button type="submit" loading={loading}>{t("profile.saveChanges")}</Button>
          </form>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">{t("profile.changePasswordSection")}</h3>
          <form onSubmit={changePassword} className="space-y-4">
            <Input
              label={t("profile.currentPassword")}
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            />
            <Input
              label={t("profile.newPassword")}
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            />
            <Input
              label={t("profile.confirmNewPassword")}
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            />
            <Button type="submit" loading={loading} variant="secondary">{t("profile.changePassword")}</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
