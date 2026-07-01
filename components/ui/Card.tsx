import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
}

export default function Card({
  children,
  className = "",
  glass = false,
  hover = false,
}: CardProps) {
  const base = "rounded-xl bg-[var(--surface)] border border-[var(--border-color)] transition-all duration-200";
  const glassClass = glass ? "glass-card" : "";
  const hoverClass = hover ? "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5" : "";

  return (
    <div className={`${base} ${glassClass} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}
