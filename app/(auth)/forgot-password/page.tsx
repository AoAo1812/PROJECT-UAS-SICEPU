"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import { useTranslation } from "@/lib/i18n";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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
          <h1 className="text-lg font-bold text-[var(--foreground)]">{t("auth.forgotPasswordTitle")}</h1>
          <p className="text-sm text-[var(--foreground)]/60 mt-1">{t("auth.forgotPasswordSubtitle")}</p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-xl p-6">
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-[var(--foreground)]/70">{t("auth.forgotPasswordSuccess")}</p>
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
                label={t("auth.email")}
                type="email"
                placeholder="email@university.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" loading={loading} className="w-full">
                {t("auth.forgotPasswordButton")}
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
