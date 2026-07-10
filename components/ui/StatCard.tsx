"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color?: string;
  trend?: string;
  delay?: number;
}

export default function StatCard({
  title,
  value,
  icon,
  color = "primary",
  trend,
  delay = 0,
}: StatCardProps) {
  const colorMap: Record<string, { bg: string; glow: string; iconBg: string }> = {
    primary: {
      bg: "from-primary/5 to-transparent",
      glow: "shadow-primary/10",
      iconBg: "from-primary to-accent",
    },
    emerald: {
      bg: "from-emerald-500/5 to-transparent",
      glow: "shadow-emerald-500/10",
      iconBg: "from-emerald-500 to-emerald-600",
    },
    amber: {
      bg: "from-amber-500/5 to-transparent",
      glow: "shadow-amber-500/10",
      iconBg: "from-amber-500 to-amber-600",
    },
    red: {
      bg: "from-red-500/5 to-transparent",
      glow: "shadow-red-500/10",
      iconBg: "from-red-500 to-red-600",
    },
    purple: {
      bg: "from-purple-500/5 to-transparent",
      glow: "shadow-purple-500/10",
      iconBg: "from-purple-500 to-purple-600",
    },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="relative rounded-xl bg-[var(--surface)] border border-[var(--border-color)] p-5 hover:border-primary/30 transition-all duration-200 overflow-hidden group"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${c.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="relative flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-stone-700">{title}</p>
          <p className="text-2xl font-bold text-stone-900 tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {trend && (
            <p className="text-xs font-medium text-stone-600 dark:text-emerald-400">{trend}</p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${c.iconBg} flex items-center justify-center text-white shadow-lg ${c.glow} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
