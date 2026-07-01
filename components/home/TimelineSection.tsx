"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

export default function TimelineSection() {
  const { t } = useTranslation();

  const stepKeys = ["register", "report", "track", "done"];
  const stepIcons = [
    "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
    "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  ];
  const stepColors = [
    "from-primary to-accent",
    "from-emerald-500 to-emerald-600",
    "from-amber-500 to-amber-600",
    "from-purple-500 to-purple-600",
  ];

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 noise pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-medium text-primary mb-3 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            {t("timeline.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] tracking-tight">
            {t("timeline.title")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              {t("timeline.titleHighlight")}
            </span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20" />

          {stepKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <Link href="/register" className="block group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`relative w-20 h-20 mx-auto rounded-xl bg-gradient-to-br ${stepColors[i]} flex items-center justify-center text-white shadow-lg mb-4 z-10 group-hover:shadow-xl transition-shadow duration-200`}
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stepIcons[i]} />
                  </svg>
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--surface)] border border-[var(--border-color)] flex items-center justify-center text-[10px] font-bold text-[var(--foreground)]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </motion.div>
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1 group-hover:text-primary transition-colors">{t(`timeline.steps.${key}.title`)}</h3>
                <p className="text-xs text-[var(--foreground)]/60 leading-relaxed max-w-[200px] mx-auto">{t(`timeline.steps.${key}.desc`)}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
