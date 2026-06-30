"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const team = [
  {
    name: "Dr. Ahmad Ridwan",
    role: "Project Advisor",
    initials: "AR",
    color: "from-blue-500 to-blue-600",
    desc: "Dosen Pembimbing Sistem Informasi",
  },
  {
    name: "Tim Pengembang SICEPU",
    role: "Development Team",
    initials: "TD",
    color: "from-emerald-500 to-emerald-600",
    desc: "Mahasiswa Teknik Informatika",
  },
];

const values = [
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Cepat & Efisien",
    desc: "Kami percaya setiap masalah fasilitas harus ditangani dengan cepat. SICEPU dirancang untuk mempercepat proses pelaporan dari hari menjadi hitungan menit.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Transparan & Akuntabel",
    desc: "Setiap laporan dapat dipantau secara real-time. Dari status Menunggu hingga Selesai, semuanya tercatat dan dapat diakses oleh pelapor.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    title: "Aman & Terpercaya",
    desc: "Data pengguna dilindungi dengan autentikasi JWT dan enkripsi bcrypt. Privasi Anda adalah prioritas kami.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
    title: "Mobile-First",
    desc: "Akses SICEPU dari perangkat apapun. Desain responsif kami memastikan pengalaman optimal di desktop, tablet, maupun mobile.",
    color: "from-purple-500 to-purple-600",
  },
];

const milestones = [
  { year: "2026", title: "Pendirian Proyek", desc: "SICEPU dimulai sebagai proyek Tugas Akhir untuk menyelesaikan masalah pelaporan fasilitas kampus." },
  { year: "2026", title: "Prototype Selesai", desc: "Versi pertama berhasil dibangun dengan fitur lengkap: pelaporan, dashboard, dan manajemen admin." },
  { year: "2026", title: "Uji Coba Internal", desc: "Diuji coba oleh mahasiswa dan staf kampus untuk validasi kebutuhan dan fitur." },
  { year: "2026", title: "Peluncuran Publik", desc: "SICEPU siap digunakan oleh seluruh civitas akademika universitas." },
];

export default function AboutPage() {
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
            Tentang Kami
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight mb-6"
          >
            Membangun Kampus{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              yang Lebih Baik
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            SICEPU (Sistem Informasi Cepat Pelaporan Kerusakan Fasilitas Kampus) adalah platform digital yang dirancang untuk memudahkan mahasiswa dan staf dalam melaporkan kerusakan fasilitas kampus secara cepat, transparan, dan terpantau.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 relative">
        <div className="absolute inset-0 noise pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/30 inline-block">
                Misi Kami
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">
                Solusi Digital untuk Masalah Nyata
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Kami percaya bahwa setiap masalah fasilitas kampus harus ditangani dengan cepat dan akuntabel. Sebelum SICEPU, pelaporan kerusakan masih dilakukan secara manual melalui WhatsApp atau langsung ke bagian sarana — proses yang lambat dan sulit dipantau.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Dengan SICEPU, proses tersebut berubah menjadi digital, transparan, dan real-time. Setiap laporan tercatat, setiap status terpantau, dan setiap penyelesaan terdokumentasi.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {values.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center text-white mb-3`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={v.icon} />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{v.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 to-white dark:from-slate-900/50 dark:to-slate-950" />
        <div className="absolute inset-0 noise pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/30 inline-block">
              Perjalanan Kami
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Timeline Proyek
            </h2>
          </motion.div>

          <div className="space-y-0">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/25 shrink-0">
                    {m.year}
                  </div>
                  {i < milestones.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gradient-to-b from-blue-300 to-blue-100 dark:from-blue-700 dark:to-blue-900 min-h-[3rem]" />
                  )}
                </div>
                <div className="pb-10">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{m.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 relative">
        <div className="absolute inset-0 noise pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/30 inline-block">
              Tim Kami
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Dibuat oleh Mahasiswa
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {team.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-8 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-lg`}>
                  {t.initials}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t.name}</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">{t.role}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
