interface BadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  Menunggu:
    "bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/30",
  Diproses:
    "bg-blue-50 text-blue-700 border border-blue-200/60 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/30",
  Selesai:
    "bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/30",
  Ditolak:
    "bg-red-50 text-red-700 border border-red-200/60 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800/30",
};

const statusDots: Record<string, string> = {
  Menunggu: "bg-amber-500",
  Diproses: "bg-blue-500",
  Selesai: "bg-emerald-500",
  Ditolak: "bg-red-500",
};

export default function Badge({ status, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[status] || statusStyles.Menunggu} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${statusDots[status] || statusDots.Menunggu} animate-pulse`}
      />
      {status}
    </span>
  );
}
