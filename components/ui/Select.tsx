"use client";

import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, placeholder, options, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-[var(--foreground)]/60">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-sm text-[var(--foreground)] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 appearance-none ${
            error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-xs text-red-400 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
