"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

const devices = [
  { name: "Desktop", width: "w-80", height: "h-52", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { name: "Tablet", width: "w-48", height: "h-64", icon: "M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
  { name: "Smartphone", width: "w-32", height: "h-56", icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" },
];

const features = [
  { icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z", title: "Layout Adaptif", desc: "Tampilan otomatis menyesuaikan ukuran layar tanpa mengorbankan fungsionalitas." },
  { icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z", title: "Touch-Friendly", desc: "Semua tombol dan interaksi dirancang nyaman untuk navigasi sentuh di layar kecil." },
  { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Performa Cepat", desc: "Loading time minimal, konten kritis di-prioritaskan untuk pengalaman instan." },
];

const faqItems = [
  { q: "Apa itu SICEPU?", a: "SICEPU (Sistem Informasi Cepat Pelaporan Kerusakan Fasilitas Kampus) adalah platform digital untuk melaporkan dan memantau kerusakan fasilitas kampus secara cepat dan transparan." },
  { q: "Apakah SICEPU bisa digunakan di HP?", a: "Tentu! SICEPU dirancang dengan desain responsif yang optimal untuk desktop, tablet, maupun smartphone. Tidak perlu install aplikasi tambahan." },
  { q: "Apakah SICEPU gratis?", a: "Ya, SICEPU gratis digunakan oleh seluruh civitas akademika universitas." },
  { q: "Bagaimana cara membuat laporan?", a: "Cukup masuk ke akun Anda, klik Buat Laporan, isi formulir yang tersedia, upload foto bukti, dan kirim. Laporan Anda akan langsung masuk ke sistem." },
  { q: "Bagaimana cara melacak status laporan?", a: "Masuk ke dashboard, klik menu Tracking Laporan, dan Anda akan melihat daftar laporan beserta status dan timeline perubahannya." },
];

export default function TentangAplikasiPage() {
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
            Multi-Perangkat
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight mb-6"
          >
            Akses SICEPU dari{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Perangkat Apapun
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            SICEPU dirancang responsif untuk memberikan pengalaman terbaik di desktop, tablet, dan smartphone tanpa perlu aplikasi tambahan.
          </motion.p>
        </div>
      </section>

      {/* Device Preview */}
      <section className="py-24 relative">
        <div className="absolute inset-0 noise pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-center gap-6 sm:gap-10">
            {devices.map((device, i) => (
              <motion.div
                key={device.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="text-center"
              >
                <div className={`${device.width} ${device.height} mx-auto rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-300 dark:border-slate-700 shadow-2xl flex items-center justify-center overflow-hidden`}>
                  <div className="text-center p-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mx-auto mb-3">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-white">SICEPU</p>
                    <div className="mt-2 space-y-1">
                      <div className="h-1.5 w-20 mx-auto rounded-full bg-slate-300 dark:bg-slate-600" />
                      <div className="h-1.5 w-16 mx-auto rounded-full bg-slate-300 dark:bg-slate-600" />
                      <div className="h-1.5 w-24 mx-auto rounded-full bg-slate-300 dark:bg-slate-600" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={device.icon} />
                  </svg>
                  <p className="text-sm font-medium text-slate-700 dark:text-white">{device.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsive Features */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50/80 dark:from-slate-950 dark:to-slate-900/50" />
        <div className="absolute inset-0 noise pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-blue-400 dark:text-blue-300 mb-4 px-4 py-1.5 rounded-full bg-blue-950/30 border border-blue-800/30 inline-block">
              Desain Responsif
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Pengalaman Konsisten di Semua Layar
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/25">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-300 dark:text-slate-300 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 noise pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white dark:text-white tracking-tight">
              Pertanyaan Umum
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80"
              >
                <h3 className="text-sm font-semibold text-white dark:text-white mb-2">{item.q}</h3>
                <p className="text-sm text-slate-300 dark:text-slate-300 leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 to-white dark:from-slate-900/50 dark:to-slate-950" />
        <div className="absolute inset-0 noise pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-white dark:text-white tracking-tight mb-6"
          >
            Siap Mencoba?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-300 dark:text-slate-300 mb-8"
          >
            Akses SICEPU sekarang dari perangkat apapun yang Anda miliki.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="/register">
              <Button size="lg">Daftar Gratis</Button>
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
