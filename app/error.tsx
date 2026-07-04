"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-red-500/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center animate-fade-in">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#EF4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        {/* Title */}
        <h1
          className="text-xl sm:text-2xl font-semibold text-[var(--foreground)] animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          Terjadi Kesalahan
        </h1>

        {/* Description */}
        <p
          className="text-sm text-[var(--foreground)]/60 leading-relaxed animate-fade-in"
          style={{ animationDelay: "0.15s" }}
        >
          Sesuatu tidak berjalan sebagaimana mestinya. Silakan coba lagi atau
          hubungi administrator jika masalah berlanjut.
        </p>

        {/* Error digest for debugging */}
        {error.digest && (
          <p
            className="text-xs font-mono text-[var(--foreground)]/30 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            ID: {error.digest}
          </p>
        )}

        {/* Retry button */}
        <button
          onClick={() => reset()}
          className="mt-2 inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm
            bg-gradient-to-r from-primary to-accent text-[#1C1917]
            hover:shadow-[0_0_30px_rgba(212,168,83,0.3)]
            transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]
            animate-fade-in"
          style={{ animationDelay: "0.25s" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Coba Lagi
        </button>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.7s ease-out both;
        }
      `}</style>
    </div>
  );
}
