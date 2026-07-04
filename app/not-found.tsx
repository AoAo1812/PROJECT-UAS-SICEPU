"use client";

import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/10 to-accent/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* Logo */}
        <div className="animate-fade-in">
          <Logo size="lg" showText />
        </div>

        {/* 404 text */}
        <h1
          className="text-[8rem] sm:text-[10rem] font-black leading-none tracking-tighter bg-gradient-to-b from-primary via-primary-light to-accent bg-clip-text text-transparent animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          404
        </h1>

        {/* Message */}
        <div
          className="flex flex-col items-center gap-3 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--foreground)]">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-sm sm:text-base text-[var(--foreground)]/60 max-w-md">
            Sepertinya halaman yang kamu cari sudah dipindahkan, dihapus, atau
            tidak tersedia.
          </p>
        </div>

        {/* Button */}
        <Link
          href="/"
          className="mt-2 inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm
            bg-gradient-to-r from-primary to-accent text-[#1C1917]
            hover:shadow-[0_0_30px_rgba(212,168,83,0.3)]
            transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]
            animate-fade-in"
          style={{ animationDelay: "0.35s" }}
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
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Kembali ke Beranda
        </Link>
      </div>

      {/* Tailwind animation helpers */}
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
