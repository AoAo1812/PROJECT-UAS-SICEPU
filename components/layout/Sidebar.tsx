"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useTranslation, getAvailableLocales } from "@/lib/i18n";
import Avatar from "@/components/ui/Avatar";
import Logo from "@/components/ui/Logo";
import { UserContext } from "@/app/(dashboard)/layout";

export default function Sidebar({ collapsed, onToggle, onClose }: { collapsed: boolean; onToggle: () => void; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toggle } = useTheme();
  const { t, locale, setLocale } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const user = useContext(UserContext);

  const userNav = [
    { href: "/dashboard", label: t("nav.dashboard"), icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { href: "/laporan/baru", label: t("reports.create"), icon: "M12 4v16m8-8H4" },
    { href: "/laporan", label: t("reports.list"), icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { href: "/profil", label: t("nav.profile"), icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ];

  const adminNav = [
    { href: "/admin", label: t("nav.dashboard"), icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { href: "/admin/laporan", label: t("admin.manageReports"), icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { href: "/admin/users", label: t("admin.manageUsers"), icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM12.75 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" },
    { href: "/profil", label: t("nav.profile"), icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ];

  const nav = user?.role === "admin" ? adminNav : userNav;

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <aside
      className={`h-screen bg-[var(--background)] border-r border-[var(--border-color)] flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-14 px-3 border-b border-[var(--border-color)]">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <Logo size="sm" showText={false} />
            <span className="text-sm font-bold">
              <span className="text-[var(--foreground)]">SI</span>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">CEPU</span>
            </span>
          </Link>
        )}
        <div className="flex items-center gap-1">
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-[var(--surface)] transition-colors text-[var(--foreground)]/60">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button onClick={onToggle} className="p-1.5 rounded-lg hover:bg-[var(--surface)] transition-colors text-[var(--foreground)]/60">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {collapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Admin Badge */}
      {user?.role === "admin" && !collapsed && (
        <div className="mx-2 mt-2 px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-[10px] font-medium text-primary">{t("sidebar.adminMode")}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {/* Home Link */}
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-stone-700 hover:text-stone-900 hover:bg-[var(--surface)] transition-all"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {!collapsed && <span>{t("nav.home")}</span>}
        </Link>
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-stone-700 hover:text-stone-900 hover:bg-[var(--surface)]"
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-[var(--border-color)] space-y-0.5">
        <button
          onClick={toggle}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-stone-700 hover:text-stone-900 hover:bg-[var(--surface)] transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          {!collapsed && <span>{t("sidebar.darkMode")}</span>}
        </button>

        {/* Language Selector */}
        {!collapsed && (
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-stone-700 hover:text-stone-900 hover:bg-[var(--surface)] transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span>{locale.toUpperCase()}</span>
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute bottom-full left-0 right-0 mb-1 bg-[var(--surface)] border border-[var(--border-color)] rounded-lg shadow-xl overflow-hidden z-50"
                >
                  {getAvailableLocales().map((loc) => (
                    <button
                      key={loc.value}
                      onClick={() => { setLocale(loc.value); setLangOpen(false); }}
                      className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                        locale === loc.value
                          ? "bg-primary/10 text-primary"
                          : "text-stone-700 hover:bg-[var(--background)]"
                      }`}
                    >
                      {loc.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!collapsed && <span>{t("nav.logout")}</span>}
        </button>

        {user && !collapsed && (
          <div className="flex items-center gap-2.5 px-2.5 py-2">
            <Avatar name={user.name} size="sm" src={user.avatar} />
            <div className="min-w-0">
              <p className="text-xs font-medium text-stone-900 truncate">{user.name}</p>
              <p className="text-[10px] text-stone-600 truncate">
                {user.role === "admin" ? t("sidebar.administrator") : t("sidebar.user")}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
