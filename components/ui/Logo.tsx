"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function Logo({ size = "md", showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 28, text: "text-sm" },
    md: { icon: 36, text: "text-base" },
    lg: { icon: 48, text: "text-xl" },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={s.icon}
        height={s.icon}
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
          <linearGradient id="docGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBF5" />
            <stop offset="100%" stopColor="#FFF3E0" />
          </linearGradient>
        </defs>
        {/* Shield shape */}
        <path
          d="M24 4L6 12V22C6 33.1 13.84 43.36 24 46C34.16 43.36 42 33.1 42 22V12L24 4Z"
          fill="url(#shieldGold)"
        />
        {/* Inner shield */}
        <path
          d="M24 7L9 14V22C9 31.5 15.5 40.26 24 42.82C32.5 40.26 39 31.5 39 22V14L24 7Z"
          fill="url(#shieldDark)"
        />
        {/* Document icon */}
        <rect x="18" y="15" width="12" height="16" rx="2" fill="url(#docGold)" />
        <path d="M18 15H26V20H30V31H18V15Z" fill="url(#docGold)" />
        {/* Document lines */}
        <rect x="20.5" y="22.5" width="7" height="1.5" rx="0.75" fill="#D4A853" opacity="0.8" />
        <rect x="20.5" y="25.5" width="5" height="1.5" rx="0.75" fill="#D4A853" opacity="0.6" />
        <rect x="20.5" y="28.5" width="6" height="1.5" rx="0.75" fill="#D4A853" opacity="0.4" />
      </svg>
      {showText && (
        <span className={`font-bold ${s.text}`}>
          <span className="text-[var(--foreground)]">SI</span>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">CEPU</span>
        </span>
      )}
    </div>
  );
}
