"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="id">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0C0A09",
          color: "#FAFAF9",
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            padding: "24px",
            textAlign: "center",
          }}
        >
          {/* Shield icon */}
          <svg
            width="64"
            height="64"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="shieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4A853" />
                <stop offset="50%" stopColor="#E8C76A" />
                <stop offset="100%" stopColor="#B8922E" />
              </linearGradient>
              <linearGradient id="shieldDark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1C1917" />
                <stop offset="100%" stopColor="#292524" />
              </linearGradient>
            </defs>
            <path
              d="M24 4L6 12V22C6 33.1 13.84 43.36 24 46C34.16 43.36 42 33.1 42 22V12L24 4Z"
              fill="url(#shieldGold)"
            />
            <path
              d="M24 7L9 14V22C9 31.5 15.5 40.26 24 42.82C32.5 40.26 39 31.5 39 22V14L24 7Z"
              fill="url(#shieldDark)"
            />
            <circle cx="24" cy="22" r="6" stroke="#EF4444" strokeWidth="2" fill="none" />
            <line x1="24" y1="18" x2="24" y2="22" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
            <circle cx="24" cy="25" r="0.5" fill="#EF4444" />
          </svg>

          <h1
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
            }}
          >
            Aplikasi Mengalami Gangguan
          </h1>

          <p
            style={{
              fontSize: "0.875rem",
              color: "#FAFAF999",
              maxWidth: "360px",
              lineHeight: 1.6,
            }}
          >
            Terjadi kesalahan kritis yang tidak dapat dipulihkan secara
            otomatis. Silakan muat ulang halaman.
          </p>

          <button
            onClick={() => reset()}
            style={{
              marginTop: "8px",
              padding: "12px 32px",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "0.875rem",
              background: "linear-gradient(to right, #D4A853, #C9A84C)",
              color: "#1C1917",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            Muat Ulang
          </button>
        </div>
      </body>
    </html>
  );
}
