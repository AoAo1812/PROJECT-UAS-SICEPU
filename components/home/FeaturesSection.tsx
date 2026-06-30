"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    title: "Laporan Cepat",
    desc: "Buat laporan kerusakan dalam hitungan menit dengan form multi-step yang intuitif dan drag-and-drop upload foto.",
    color: "from-blue-500 to-blue-600",
    borderHover: "hover:border-blue-300 dark:hover:border-blue-700/50",
    href: "/features",
  },
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Real-Time Tracking",
    desc: "Pantau status laporan Anda secara real-time dari Menunggu hingga Selesai dengan notifikasi otomatis.",
    color: "from-amber-500 to-orange-500",
    borderHover: "hover:border-amber-300 dark:hover:border-amber-700/50",
    href: "/features",
  },
  {
    icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z",
    title: "Upload Foto",
    desc: "Sertakan bukti foto kerusakan dengan drag-and-drop upload yang mendukung preview instan.",
    color: "from-emerald-500 to-emerald-600",
    borderHover: "hover:border-emerald-300 dark:hover:border-emerald-700/50",
    href: "/features",
  },
  {
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    title: "Dashboard Analitik",
    desc: "Visualisasi data laporan dengan grafik interaktif, statistik lengkap, dan insight untuk pengambilan keputusan.",
    color: "from-purple-500 to-purple-600",
    borderHover: "hover:border-purple-300 dark:hover:border-purple-700/50",
    href: "/features",
  },
  {
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    title: "Keamanan Data",
    desc: "Autentikasi JWT dengan enkripsi password bcrypt menjaga keamanan data Anda secara maksimal.",
    color: "from-rose-500 to-rose-600",
    borderHover: "hover:border-rose-300 dark:hover:border-rose-700/50",
    href: "/features",
  },
  {
    icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
    title: "Mobile Friendly",
    desc: "Akses SICEPU dari perangkat apapun dengan desain responsif yang optimal untuk semua ukuran layar.",
    color: "from-cyan-500 to-cyan-600",
    borderHover: "hover:border-cyan-300 dark:hover:border-cyan-700/50",
    href: "/features",
  },
];

export default function FeaturesSection() {
  return (
    <section id="fitur" className="py-24 relative">
      <div className="absolute inset-0 noise pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/30"
          >
            Fitur Unggulan
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Solusi Lengkap untuk{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Pelaporan Kampus
            </span>
          </h2>
          <p className="mt-5 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Semua yang Anda butuhkan untuk melaporkan dan memantau kerusakan
            fasilitas kampus dalam satu platform terintegrasi.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link href={f.href} className="block group">
                <div
                  className={`relative p-7 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 ${f.borderHover} hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300 overflow-hidden hover:-translate-y-1`}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className={`absolute -inset-24 bg-gradient-to-br ${f.color} opacity-[0.03] blur-3xl`} />
                  </div>

                  <div className="relative">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {f.desc}
                    </p>

                    <span className="inline-flex items-center gap-1 mt-4 text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Selengkapnya
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
