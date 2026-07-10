interface BadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  Menunggu: "bg-amber-500/10 text-amber-800 border border-amber-500/20",
  Diproses: "bg-primary/10 text-primary-dark border border-primary/20",
  Selesai: "bg-emerald-500/10 text-emerald-800 border border-emerald-500/20",
  Ditolak: "bg-red-500/10 text-red-800 border border-red-500/20",
};

const statusDots: Record<string, string> = {
  Menunggu: "bg-amber-400",
  Diproses: "bg-primary",
  Selesai: "bg-emerald-400",
  Ditolak: "bg-red-400",
};

export default function Badge({ status, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[status] || statusStyles.Menunggu} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${statusDots[status] || statusDots.Menunggu} animate-pulse`} />
      {status}
    </span>
  );
}
