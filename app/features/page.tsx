"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

const features = [
  {
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    title: "Laporan Cepat & Mudah",
    desc: "Buat laporan kerusakan dalam hitungan menit dengan form multi-step yang intuitif. Isi nama fasilitas, lokasi, kategori, deskripsi, dan upload foto bukti — semuanya dalam satu alur yang simpel.",
    color: "from-blue-500 to-blue-600",
    details: [
      "Form multi-step intuitif",
      "Drag & drop upload foto",
      "Validasi form real-time",
      "Auto-save draft",
    ],
  },
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Real-Time Tracking",
    desc: "Pantau status laporan Anda secara real-time. Dari Menunggu hingga Diproses hingga Selesai — setiap perubahan status tercatat dan Anda mendapat notifikasi otomatis.",
    color: "from-amber-500 to-orange-500",
    details: [
      "Status update real-time",
      "Timeline visual",
      "Notifikasi otomatis",
      "Riwayat lengkap",
    ],
  },
  {
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    title: "Dashboard Analitik",
    desc: "Visualisasi data laporan dengan grafik interaktif. Lihat tren laporan per bulan, distribusi status, dan statistik lengkap untuk pengambilan keputusan yang lebih baik.",
    color: "from-purple-500 to-purple-600",
    details: [
      "Grafik interaktif Chart.js",
      "Statistik lengkap",
      "Tren laporan per bulan",
      "Distribusi status",
    ],
  },
  {
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    title: "Keamanan Data",
    desc: "Autentikasi JWT dengan enkripsi password bcrypt menjaga keamanan data Anda. Setiap sesi terenkripsi dan data tidak akan dibagikan ke pihak ketiga.",
    color: "from-rose-500 to-rose-600",
    details: [
      "JWT authentication",
      "Bcrypt password hashing",
      "HTTP-only cookies",
      "Role-based access",
    ],
  },
  {
    icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z",
    title: "Upload Foto Bukti",
    desc: "Sertakan bukti foto kerusakan dengan drag-and-drop upload yang mendukung preview instan. Mendukung format JPG, PNG, WebP, dan GIF hingga 5MB per foto.",
    color: "from-emerald-500 to-emerald-600",
    details: [
      "Drag & drop upload",
      "Preview instan",
      "Multi-file support",
      "Max 5MB per foto",
    ],
  },
  {
    icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
    title: "Mobile Friendly",
    desc: "Akses SICEPU dari perangkat apapun dengan desain responsif yang optimal untuk semua ukuran layar. Baik di desktop, tablet, maupun smartphone.",
    color: "from-cyan-500 to-cyan-600",
    details: [
      "Responsive design",
      "Touch-friendly UI",
      "Fast loading",
      "PWA-ready",
    ],
  },
  {
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    title: "Manajemen User",
    desc: "Admin dapat mengelola seluruh pengguna sistem. Buat akun baru, edit profil, ubah role, dan hapus user — semua dari satu panel kontrol yang intuitif.",
    color: "from-indigo-500 to-indigo-600",
    details: [
      "CRUD user lengkap",
      "Role management",
      "Search & filter",
      "Bulk operations",
    ],
  },
  {
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    title: "Status Workflow",
    desc: "Sistem status berjenjang yang jelas: Menunggu → Diproses → Selesai (atau Ditolak). Admin dapat menambahkan catatan pada setiap perubahan status.",
    color: "from-amber-500 to-yellow-500",
    details: [
      "4 status workflow",
      "Admin notes",
      "Status history",
      "Auto-notify pelapor",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden aurora-bg">
        <div className="absolute inset-0 noise pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/30"
          >
            Fitur Lengkap
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight mb-6"
          >
            Semua yang Anda Butuhkan{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              dalam Satu Platform
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Dari pelaporan hingga penyelesaian, SICEPU menyediakan semua tools yang Anda butuhkan untuk mengelola kerusakan fasilitas kampus secara efisien.
          </motion.p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative">
        <div className="absolute inset-0 noise pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group p-8 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {f.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {f.details.map((d, j) => (
                        <span
                          key={j}
                          className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50/80 dark:from-slate-950 dark:to-slate-900/50" />
        <div className="absolute inset-0 noise pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-6"
          >
            Siap Mencoba SICEPU?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400 mb-8"
          >
            Daftar sekarang dan mulai laporkan kerusakan fasilitas kampus dengan mudah.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="/register">
              <Button size="lg" variant="primary">Daftar Gratis</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="secondary">Masuk</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
