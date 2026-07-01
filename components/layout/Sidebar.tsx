"use client";

import { useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useTranslation } from "@/lib/i18n";
import Avatar from "@/components/ui/Avatar";
import { UserContext } from "@/app/(dashboard)/layout";

export default function Sidebar({ collapsed, onToggle, onClose }: { collapsed: boolean; onToggle: () => void; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toggle } = useTheme();
  const { t } = useTranslation();
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
          <Link href={user?.role === "admin" ? "/admin" : "/dashboard"} className="flex items-center gap-2" onClick={onClose}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-[var(--foreground)]">
              SIC<span className="text-primary">EPU</span>
            </span>
          </Link>
        )}
        <div className="flex items-center gap-1">
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-[var(--surface)] transition-colors text-[var(--foreground)]/40">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button onClick={onToggle} className="p-1.5 rounded-lg hover:bg-[var(--surface)] transition-colors text-[var(--foreground)]/40">
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
          <p className="text-[10px] font-medium text-primary">Admin Mode</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
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
                  : "text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:bg-[var(--surface)]"
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
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          {!collapsed && <span>Mode Gelap</span>}
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
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
              <p className="text-xs font-medium text-[var(--foreground)] truncate">{user.name}</p>
              <p className="text-[10px] text-[var(--foreground)]/30 truncate">
                {user.role === "admin" ? "Administrator" : "User"}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
