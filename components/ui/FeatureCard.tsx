"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  route: string;
  color: string;
  details?: string[];
  index?: number;
  variant?: "default" | "compact" | "minimal";
  children?: ReactNode;
}

export default function FeatureCard({
  icon,
  title,
  description,
  route,
  color,
  details,
  index = 0,
  variant = "default",
  children,
}: FeatureCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(route);
  };

  if (variant === "minimal") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        onClick={handleClick}
        className="group p-5 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
      >
        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1.5 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-xs text-[var(--foreground)]/60 leading-relaxed">
          {description}
        </p>
        {children}
      </motion.div>
    );
  }

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        onClick={handleClick}
        className="group p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 cursor-pointer"
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-stone-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-stone-600 dark:text-slate-400 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        {children}
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={handleClick}
      className="group p-8 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start gap-5">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300`}>
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-stone-600 dark:text-slate-400 leading-relaxed mb-4">
            {description}
          </p>
          {details && details.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {details.map((d, j) => (
                <span
                  key={j}
                  className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-stone-600 dark:text-slate-400"
                >
                  {d}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {children}
    </motion.div>
  );
}
