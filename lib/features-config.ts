// Shared feature configuration - single source of truth for all feature cards
export interface FeatureConfig {
  key: string;
  icon: string;
  titleKey: string;
  descKey: string;
  route: string;
  color: string;
  details: string[];
}

export const SICEPU_FEATURES: FeatureConfig[] = [
  {
    key: "fastReport",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    titleKey: "features.items.fastReport.title",
    descKey: "features.items.fastReport.desc",
    route: "/laporan/baru",
    color: "from-blue-500 to-blue-600",
    details: [
      "Form multi-step intuitif",
      "Drag & drop upload foto",
      "Validasi form real-time",
      "Auto-save draft",
    ],
  },
  {
    key: "tracking",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    titleKey: "features.items.tracking.title",
    descKey: "features.items.tracking.desc",
    route: "/laporan/tracking",
    color: "from-amber-500 to-orange-500",
    details: [
      "Status update real-time",
      "Timeline visual",
      "Notifikasi otomatis",
      "Riwayat lengkap",
    ],
  },
  {
    key: "analytics",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    titleKey: "features.items.analytics.title",
    descKey: "features.items.analytics.desc",
    route: "/dashboard",
    color: "from-purple-500 to-purple-600",
    details: [
      "Grafik interaktif Chart.js",
      "Statistik lengkap",
      "Tren laporan per bulan",
      "Distribusi status",
    ],
  },
  {
    key: "security",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    titleKey: "features.items.security.title",
    descKey: "features.items.security.desc",
    route: "/profil/keamanan",
    color: "from-rose-500 to-rose-600",
    details: [
      "JWT authentication",
      "Bcrypt password hashing",
      "HTTP-only cookies",
      "Role-based access",
    ],
  },
  {
    key: "photo",
    icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z",
    titleKey: "features.items.photo.title",
    descKey: "features.items.photo.desc",
    route: "/laporan/baru#upload-foto",
    color: "from-emerald-500 to-emerald-600",
    details: [
      "Drag & drop upload",
      "Preview instan",
      "Multi-file support",
      "Max 5MB per foto",
    ],
  },
  {
    key: "mobile",
    icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
    titleKey: "features.items.mobile.title",
    descKey: "features.items.mobile.desc",
    route: "/tentang-aplikasi",
    color: "from-cyan-500 to-cyan-600",
    details: [
      "Responsive design",
      "Touch-friendly UI",
      "Fast loading",
      "PWA-ready",
    ],
  },
];
