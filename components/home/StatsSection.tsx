"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const { t } = useTranslation();

  const stats = [
    { value: 4, suffix: "", label: t("stats.tracking"), color: "from-primary to-accent" },
    { value: 5, suffix: "", label: t("stats.photos"), color: "from-emerald-500 to-emerald-600" },
    { value: 24, suffix: " jam", label: t("stats.response"), color: "from-amber-500 to-amber-600" },
    { value: 100, suffix: "%", label: t("stats.free"), color: "from-purple-500 to-purple-600" },
  ];

  return (
    <section id="statistik" className="py-24 relative">
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
            {t("stats.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] tracking-tight">
            {t("stats.title")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              {t("stats.titleHighlight")}
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -2 }}
              className="text-center p-5 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] hover:border-primary/30 transition-all duration-200"
            >
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center text-white mx-auto mb-3`}>
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-xs text-[var(--foreground)]/60 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
