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
  color = "blue",
  trend,
  delay = 0,
}: StatCardProps) {
  const colorMap: Record<string, { bg: string; glow: string; iconBg: string }> = {
    blue: {
      bg: "from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent",
      glow: "shadow-blue-500/10",
      iconBg: "from-blue-500 to-blue-600",
    },
    green: {
      bg: "from-emerald-50/50 to-transparent dark:from-emerald-950/20 dark:to-transparent",
      glow: "shadow-emerald-500/10",
      iconBg: "from-emerald-500 to-emerald-600",
    },
    amber: {
      bg: "from-amber-50/50 to-transparent dark:from-amber-950/20 dark:to-transparent",
      glow: "shadow-amber-500/10",
      iconBg: "from-amber-500 to-amber-600",
    },
    red: {
      bg: "from-red-50/50 to-transparent dark:from-red-950/20 dark:to-transparent",
      glow: "shadow-red-500/10",
      iconBg: "from-red-500 to-red-600",
    },
    purple: {
      bg: "from-purple-50/50 to-transparent dark:from-purple-950/20 dark:to-transparent",
      glow: "shadow-purple-500/10",
      iconBg: "from-purple-500 to-purple-600",
    },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`relative rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group`}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${c.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      <div className="relative flex items-center justify-between">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {trend && (
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {trend}
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.iconBg} flex items-center justify-center text-white shadow-lg ${c.glow} group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
