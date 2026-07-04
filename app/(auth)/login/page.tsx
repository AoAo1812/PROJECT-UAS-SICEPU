"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import { useTranslation } from "@/lib/i18n";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, remember }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(t("common.success") + "!");
      router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center aurora-bg bg-[var(--background)] p-4">
      <div className="absolute inset-0 noise pointer-events-none" />

      {/* Animated blobs */}
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
          <h1 className="text-lg font-bold text-[var(--foreground)]">{t("auth.loginTitle")}</h1>
          <p className="text-sm text-[var(--foreground)]/60 mt-1">{t("auth.loginSubtitle")}</p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t("auth.email")}
              type="email"
              placeholder="email@university.ac.id"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label={t("auth.password")}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--border-color)] bg-[var(--background)] text-primary focus:ring-primary/20"
              />
              <label htmlFor="remember" className="text-sm text-[var(--foreground)]/60 cursor-pointer">
                {t("auth.rememberMe")}
              </label>
            </div>
            <Button type="submit" loading={loading} className="w-full">
              {t("auth.loginButton")}
            </Button>
          </form>

          <div className="mt-3 text-center">
            <Link href="/forgot-password" className="text-xs text-primary/80 hover:text-primary transition-colors">
              {t("auth.forgotPassword")}
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-[var(--foreground)]/60">
          {t("auth.noAccount")}{" "}
          <Link href="/register" className="text-primary hover:text-primary-light font-medium transition-colors">
            {t("nav.register")}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
