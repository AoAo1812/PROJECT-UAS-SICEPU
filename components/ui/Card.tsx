import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
  gradient?: boolean;
}

export default function Card({
  children,
  className = "",
  glass = false,
  hover = false,
  gradient = false,
}: CardProps) {
  const base = `rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all duration-300`;
  const glassClass = glass
    ? "glass-card"
    : "";
  const hoverClass = hover
    ? "hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50"
    : "";
  const gradientClass = gradient
    ? "gradient-border relative overflow-hidden"
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${base} ${glassClass} ${hoverClass} ${gradientClass} ${className}`}
    >
      {children}
    </motion.div>
  );
}
