"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useTranslation, getAvailableLocales, getLocaleLabel } from "@/lib/i18n";

export default function Navbar() {
  const { dark, toggle } = useTheme();
  const { t, locale, setLocale } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => {});
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { href: "/features", label: t("nav.features") },
    { href: "/about", label: t("nav.about") },
    { href: "/faq", label: t("nav.faq") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-[var(--foreground)]">
              SIC<span className="text-primary">EPU</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-lg text-sm text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-all text-xs font-medium"
              >
                {locale.toUpperCase()}
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    className="absolute right-0 mt-2 w-40 bg-[var(--surface)] border border-[var(--border-color)] rounded-lg shadow-xl overflow-hidden z-50"
                  >
                    {getAvailableLocales().map((loc) => (
                      <button
                        key={loc.value}
                        onClick={() => { setLocale(loc.value); setLangOpen(false); }}
                        className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                          locale === loc.value
                            ? "bg-primary/10 text-primary"
                            : "text-[var(--foreground)]/60 hover:bg-[var(--background)]"
                        }`}
                      >
                        {loc.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggle}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-all"
              aria-label="Toggle theme"
            >
              {dark ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="hidden sm:block text-sm text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors px-3 py-1.5 rounded-lg hover:bg-[var(--surface)]"
                >
                  {t("nav.dashboard")}
                </Link>
                <Link href="/profil" className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold hover:ring-2 hover:ring-primary/50 transition-all">
                  {user.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors px-3 py-1.5 rounded-lg hover:bg-[var(--surface)]">
                  {t("nav.login")}
                </Link>
                <Link href="/register" className="text-sm font-medium text-white bg-gradient-to-r from-primary to-accent px-4 py-1.5 rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all">
                  {t("nav.register")}
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-[var(--border-color)]"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-all"
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <div className="flex gap-2 pt-2">
                  <Link href="/login" className="flex-1 text-center px-3 py-2 rounded-lg text-sm text-[var(--foreground)]/60 border border-[var(--border-color)] hover:border-primary/50 transition-all">
                    {t("nav.login")}
                  </Link>
                  <Link href="/register" className="flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-primary to-accent transition-all">
                    {t("nav.register")}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
