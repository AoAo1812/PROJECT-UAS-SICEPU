"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Logo from "@/components/ui/Logo";
import { useTranslation } from "@/lib/i18n";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export const UserContext = createContext<UserData | null>(null);

export function useUser() {
  return useContext(UserContext);
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) throw new Error("Not authenticated");
        return r.json();
      })
      .then((d) => setUser(d.user))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[var(--background)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-pulse">
            <Logo size="md" showText={false} />
          </div>
          <p className="text-xs text-stone-600">{t("layout.loading")}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <UserContext.Provider value={user}>
      <div className="flex min-h-screen bg-[var(--background)]">
        {mobileOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
        )}

        <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:relative lg:transform-none ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} onClose={() => setMobileOpen(false)} />
        </div>

        <main className="flex-1 min-w-0 p-4 sm:p-6 overflow-x-hidden">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden fixed top-3 left-3 z-30 w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border-color)] shadow-lg flex items-center justify-center text-stone-700 hover:text-stone-900 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {children}
        </main>
      </div>
    </UserContext.Provider>
  );
}
