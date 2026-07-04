"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import { useTranslation } from "@/lib/i18n";

function ResetPasswordForm() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      return toast.error(t("auth.passwordMismatch"));
    }
    if (form.newPassword.length < 6) {
      return toast.error(t("auth.passwordMinLength"));
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: form.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSubmitted(true);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center aurora-bg bg-[var(--background)] p-4">
        <div className="absolute inset-0 noise pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm relative text-center"
        >
          <div className="mb-8">
            <div className="mx-auto mb-4">
              <Logo size="lg" showText={false} />
            </div>
            <h1 className="text-lg font-bold text-[var(--foreground)]">{t("auth.invalidLink")}</h1>
            <p className="text-sm text-[var(--foreground)]/60 mt-1">{t("auth.invalidLinkDesc")}</p>
          </div>
          <Link
            href="/forgot-password"
            className="inline-block text-sm text-primary hover:text-primary-light font-medium transition-colors"
          >
            {t("auth.forgotPassword")}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center aurora-bg bg-[var(--background)] p-4">
      <div className="absolute inset-0 noise pointer-events-none" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/[0.06] blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -20, 30, 0], y: [0, 20, -30, 0], scale: [1, 0.95, 1.1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-accent/[0.05] blur-[100px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative"
      >
        <div className="text-center mb-8">
          <div className="mx-auto mb-4">
            <Logo size="lg" showText={false} />
          </div>
          <h1 className="text-lg font-bold text-[var(--foreground)]">{t("auth.resetPasswordTitle")}</h1>
          <p className="text-sm text-[var(--foreground)]/60 mt-1">{t("auth.resetPasswordSubtitle")}</p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-xl p-6">
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-[var(--foreground)]/70">{t("auth.resetPasswordSuccess")}</p>
              <Link
                href="/login"
                className="inline-block text-sm text-primary hover:text-primary-light font-medium transition-colors"
              >
                {t("nav.login")}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label={t("auth.newPassword")}
                type="password"
                placeholder="••••••••"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                required
              />
              <Input
                label={t("auth.confirmPassword")}
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
              />
              <Button type="submit" loading={loading} className="w-full">
                {t("auth.resetPasswordButton")}
              </Button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-[var(--foreground)]/60">
          {t("auth.hasAccount")}{" "}
          <Link href="/login" className="text-primary hover:text-primary-light font-medium transition-colors">
            {t("nav.login")}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
          <div className="text-sm text-[var(--foreground)]/60">Loading...</div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
