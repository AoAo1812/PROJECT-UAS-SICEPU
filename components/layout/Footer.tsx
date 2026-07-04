"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-[var(--border-color)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo size="sm" showText={false} />
              <span className="text-sm font-bold">
                <span className="text-[var(--foreground)]">SI</span>
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">CEPU</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--foreground)]/60 leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[var(--foreground)]/40 uppercase tracking-wider mb-4">{t("footer.navigation")}</h4>
            <ul className="space-y-2">
              {[
                { label: t("nav.home"), href: "/" },
                { label: t("nav.features"), href: "/features" },
                { label: t("nav.faq"), href: "/faq" },
                { label: t("nav.contact"), href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[var(--foreground)]/40 uppercase tracking-wider mb-4">{t("footer.contact")}</h4>
            <ul className="space-y-2 text-sm text-[var(--foreground)]/60">
              <li>sicepu@university.ac.id</li>
              <li>Kampus Universitas, Kota</li>
              <li>(021) 1234-5678</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border-color)]">
          <p className="text-xs text-[var(--foreground)]/30">
            &copy; {new Date().getFullYear()} SICEPU. {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
