"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { useTranslation } from "@/lib/i18n";

interface UserData {
  name: string;
  email: string;
  role: string;
  avatar?: string;
  backupEmail?: string;
}

interface Session {
  browser: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

const dummySessions: Session[] = [
  { browser: "Chrome 126 · Windows 11", ip: "192.168.1.105", lastActive: "2026-07-09T10:30:00Z", current: true },
  { browser: "Safari 19 · iPhone iOS 20", ip: "192.168.1.108", lastActive: "2026-07-08T14:20:00Z", current: false },
];

function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  if (name.length <= 2) return `${name[0]}***@${domain}`;
  return `${name[0]}${"*".repeat(Math.min(name.length - 2, 3))}${name.slice(-1)}@${domain}`;
}

export default function KeamananPage() {
  const { t } = useTranslation();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Password change state
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [step, setStep] = useState<"form" | "otp">("form");
  const [sendingOTP, setSendingOTP] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [otpEmail, setOtpEmail] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Backup email state
  const [backupForm, setBackupForm] = useState("");
  const [savingBackup, setSavingBackup] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        setUser(d.user);
        setBackupForm(d.user.backupEmail || "");
      })
      .finally(() => setLoading(false));
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOTPChange = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpCode];
    newOtp[index] = value.slice(-1);
    setOtpCode(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }, [otpCode]);

  const handleOTPKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }, [otpCode]);

  const handleOTPPaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtpCode(newOtp);
    const nextEmpty = newOtp.findIndex((c) => !c);
    otpRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  }, []);

  // Step 1: Submit password form → send OTP
  const requestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error(t("profile.passwordMismatch"));
    }
    if (passwordForm.newPassword.length < 6) {
      return toast.error(t("auth.passwordMinLength"));
    }
    if (!passwordForm.currentPassword) {
      return toast.error(t("profile.currentPassword") + " harus diisi");
    }

    setSendingOTP(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOtpEmail(user?.email || "");
      setStep("otp");
      setCountdown(60);
      toast.success(data.message);
      // In dev mode, show the code
      if (data.devCode) {
        toast.info(`[DEV] Kode OTP: ${data.devCode}`, { duration: 10000 });
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal mengirim kode");
    } finally {
      setSendingOTP(false);
    }
  };

  // Step 2: Verify OTP → change password
  const verifyAndChange = async () => {
    const code = otpCode.join("");
    if (code.length !== 6) {
      return toast.error("Masukkan kode OTP 6 digit");
    }

    setVerifying(true);
    try {
      // Verify OTP
      const verifyRes = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail, code }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error);

      // Change password
      const changeRes = await fetch("/api/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          otpCode: code,
          otpEmail,
        }),
      });
      const changeData = await changeRes.json();
      if (!changeRes.ok) throw new Error(changeData.error);

      toast.success(t("profile.passwordChanged"));
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setOtpCode(["", "", "", "", "", ""]);
      setStep("form");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal mengubah password");
    } finally {
      setVerifying(false);
    }
  };

  // Resend OTP
  const resendOTP = async () => {
    setSendingOTP(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCountdown(60);
      setOtpCode(["", "", "", "", "", ""]);
      toast.success(data.message);
      if (data.devCode) {
        toast.info(`[DEV] Kode OTP: ${data.devCode}`, { duration: 10000 });
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal mengirim ulang");
    } finally {
      setSendingOTP(false);
    }
  };

  // Save backup email
  const saveBackupEmail = async () => {
    if (!backupForm) {
      return toast.error("Email backup harus diisi");
    }
    if (backupForm.toLowerCase() === user?.email?.toLowerCase()) {
      return toast.error("Email backup harus berbeda dari email utama");
    }
    setSavingBackup(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: user?.name, email: user?.email, avatar: user?.avatar, backupEmail: backupForm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUser((prev) => prev ? { ...prev, backupEmail: backupForm } : prev);
      toast.success(t("security.backupEmailUpdated"));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSavingBackup(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div>
      <Topbar title={t("security.title")} subtitle={t("security.subtitle")} />

      {/* Account Info */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-primary/25">
            {user?.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{user?.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t("security.role")}</p>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white capitalize">{user?.role}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t("security.authMethod")}</p>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">JWT + Bcrypt</p>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Change Password with OTP */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/25">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">{t("security.changePassword")}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("security.changePasswordDesc")}</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === "form" ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={requestOTP}
                className="space-y-4"
              >
                <Input
                  label={t("profile.currentPassword")}
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                />
                <Input
                  label={t("profile.newPassword")}
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                />
                <Input
                  label={t("profile.confirmNewPassword")}
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                />
                <Button type="submit" loading={sendingOTP} variant="secondary" className="w-full">
                  {t("security.requestOTP")}
                </Button>
              </motion.form>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {/* OTP Info */}
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-800/30">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">{t("security.otpSent")}</p>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    {t("security.otpSentTo")} <span className="font-medium">{maskEmail(otpEmail)}</span>
                  </p>
                </div>

                {/* OTP Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">{t("security.otpCode")}</label>
                  <div className="flex gap-2 justify-center">
                    {otpCode.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOTPChange(i, e.target.value)}
                        onKeyDown={(e) => handleOTPKeyDown(i, e)}
                        onPaste={handleOTPPaste}
                        className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                      />
                    ))}
                  </div>
                </div>

                {/* Resend */}
                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t("security.resendIn")} <span className="font-medium text-slate-700 dark:text-slate-300">{countdown}s</span>
                    </p>
                  ) : (
                    <button
                      onClick={resendOTP}
                      disabled={sendingOTP}
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
                    >
                      {t("security.resendOTP")}
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => { setStep("form"); setOtpCode(["", "", "", "", "", ""]); }}
                    className="flex-1"
                  >
                    {t("common.back")}
                  </Button>
                  <Button
                    onClick={verifyAndChange}
                    loading={verifying}
                    className="flex-1"
                  >
                    {t("security.verifyAndChange")}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Security Info */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">{t("security.protectionTitle")}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("security.protectionDesc")}</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", title: "OTP Verification", desc: "Verifikasi 6 digit sebelum ubah password" },
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "JWT Authentication", desc: "Token autentikasi unik untuk setiap sesi login" },
              { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", title: "Bcrypt Hashing", desc: "Password dienkripsi dengan algoritma bcrypt" },
              { icon: "M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4", title: "HTTP-Only Cookies", desc: "Sesi login terproteksi dan tidak bisa diakses JavaScript" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{item.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Backup Email */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/25">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">{t("security.backupEmail")}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t("security.backupEmailDesc")}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-950/20 border border-violet-200/80 dark:border-violet-800/30 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-violet-800 dark:text-violet-300">{t("security.backupEmailInfo")}</p>
          </div>
          <p className="text-xs text-violet-600 dark:text-violet-400">{t("security.backupEmailInfoDesc")}</p>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              label={t("security.backupEmailLabel")}
              type="email"
              value={backupForm}
              onChange={(e) => setBackupForm(e.target.value)}
              placeholder="backup@email.com"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={saveBackupEmail} loading={savingBackup} variant="secondary">
              {t("security.saveBackupEmail")}
            </Button>
          </div>
        </div>
        {user?.backupEmail && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {t("security.currentBackup")}: <span className="font-medium text-slate-700 dark:text-slate-300">{user.backupEmail}</span>
          </p>
        )}
      </Card>

      {/* Active Sessions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">{t("security.activeSessions")}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("security.activeSessionsDesc")}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">
            {t("security.logoutAll")}
          </Button>
        </div>

        <div className="space-y-3">
          {dummySessions.map((session, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${session.current ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-slate-200 dark:bg-slate-700"}`}>
                  <svg className={`w-5 h-5 ${session.current ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{session.browser}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    IP: {session.ip} &middot; {new Date(session.lastActive).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
              {session.current ? (
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-full">{t("security.currentSession")}</span>
              ) : (
                <button className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors">{t("security.revoke")}</button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
