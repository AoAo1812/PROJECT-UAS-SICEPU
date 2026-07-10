"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import FeatureCard from "@/components/ui/FeatureCard";
import { SICEPU_FEATURES } from "@/lib/features-config";

export default function FeaturesSection() {
  const { t } = useTranslation();

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
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white tracking-tight">
            {t("features.title")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              {t("features.titleHighlight")}
            </span>
          </h2>
          <p className="mt-4 text-stone-600 dark:text-slate-400 max-w-lg mx-auto">
            {t("features.subtitle")}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SICEPU_FEATURES.map((feature, i) => (
            <FeatureCard
              key={feature.key}
              icon={feature.icon}
              title={t(feature.titleKey)}
              description={t(feature.descKey)}
              route={feature.route}
              color={feature.color}
              index={i}
              variant="minimal"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
