"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-[var(--foreground)]/60">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/30 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none ${
            error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-400 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
