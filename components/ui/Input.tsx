"use client";

import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-[var(--foreground)]/60">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground)]/30">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/30 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ${
              icon ? "pl-9" : ""
            } ${error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""} ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-400 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
