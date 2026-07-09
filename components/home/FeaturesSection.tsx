"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

const featureRoutes = [
  "/laporan/baru",
  "/laporan/tracking",
  "/laporan/baru#upload-foto",
  "/dashboard",
  "/profil/keamanan",
  "/tentang-aplikasi",
];

export default function FeaturesSection() {
  const { t } = useTranslation();

  const featureKeys = ["fastReport", "tracking", "photo", "analytics", "security", "mobile"];
  const featureIcons = [
    "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    "M13 10V3L4 14h7v7l9-11h-7z",
    "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z",
    "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
  ];
  const featureColors = [
    "from-primary to-accent",
    "from-amber-500 to-orange-500",
    "from-emerald-500 to-emerald-600",
    "from-purple-500 to-purple-600",
    "from-rose-500 to-rose-600",
    "from-cyan-500 to-cyan-600",
  ];

  return (
    <section id="fitur" className="py-24 relative">
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
            {t("features.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] tracking-tight">
            {t("features.title")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              {t("features.titleHighlight")}
            </span>
          </h2>
          <p className="mt-4 text-[var(--foreground)]/60 max-w-lg mx-auto">
            {t("features.subtitle")}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Link href={featureRoutes[i]} className="block group">
                <div className="h-full p-5 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${featureColors[i]} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={featureIcons[i]} />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1.5 group-hover:text-primary transition-colors duration-300">
                    {t(`features.items.${key}.title`)}
                  </h3>
                  <p className="text-xs text-[var(--foreground)]/60 leading-relaxed">
                    {t(`features.items.${key}.desc`)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
