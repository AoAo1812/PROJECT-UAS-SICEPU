"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

const faqCategories = [
  {
    category: "Umum",
    items: [
      {
        q: "Apa itu SICEPU?",
        a: "SICEPU (Sistem Informasi Cepat Pelaporan Kerusakan Fasilitas Kampus) adalah platform digital yang dirancang untuk memudahkan mahasiswa dan staf dalam melaporkan kerusakan fasilitas kampus secara cepat, transparan, dan real-time.",
      },
      {
        q: "Siapa yang bisa menggunakan SICEPU?",
        a: "SICEPU dapat digunakan oleh seluruh civitas akademika universitas, termasuk mahasiswa, dosen, dan staf. Setiap pengguna dapat membuat akun dan mulai melaporkan kerusakan fasilitas.",
      },
      {
        q: "Apakah SICEPU gratis?",
        a: "Ya, SICEPU sepenuhnya gratis untuk digunakan oleh seluruh civitas akademika kampus.",
      },
    ],
  },
  {
    category: "Akun & Autentikasi",
    items: [
      {
        q: "Bagaimana cara mendaftar di SICEPU?",
        a: "Cukup klik tombol 'Daftar' pada halaman utama, masukkan nama, email kampus, dan password Anda. Akun akan langsung aktif dan siap digunakan.",
      },
      {
        q: "Lupa password, bagaimana cara reset?",
        a: "Klik 'Lupa Password' pada halaman login, masukkan email terdaftar, dan ikuti link reset password yang dikirim ke email Anda.",
      },
      {
        q: "Apakah bisa login dengan Google?",
        a: "Saat ini SICEPU mendukung login dengan email dan password. Fitur Google OAuth sedang dalam pengembangan.",
      },
    ],
  },
  {
    category: "Pelaporan",
    items: [
      {
        q: "Bagaimana cara membuat laporan?",
        a: "Setelah login, klik menu 'Buat Laporan' di sidebar. Isi form multi-step: nama fasilitas, lokasi & kategori, deskripsi kerusakan, dan upload foto bukti. Klik 'Kirim Laporan' untuk menyelesaikan.",
      },
      {
        q: "Apakah saya bisa melaporkan lebih dari satu kerusakan?",
        a: "Tentu! Anda bisa membuat laporan sebanyak yang diperlukan. Setiap laporan akan terpisah dan dapat dipantau statusnya secara independen.",
      },
      {
        q: "Format foto apa yang didukung untuk upload?",
        a: "SICEPU mendukung format JPEG, PNG, WebP, dan GIF dengan ukuran maksimal 5MB per foto. Anda dapat upload hingga 5 foto per laporan.",
      },
      {
        q: "Bisakah saya mengedit laporan yang sudah dikirim?",
        a: "Anda dapat mengedit laporan selama statusnya masih 'Menunggu'. Setelah diproses oleh admin, laporan tidak dapat diedit lagi.",
      },
    ],
  },
  {
    category: "Status & Pemantauan",
    items: [
      {
        q: "Bagaimana cara melacak status laporan saya?",
        a: "Masuk ke dashboard, klik menu 'Daftar Laporan', dan Anda akan melihat status terkini dari setiap laporan yang telah dikirim. Status berubah real-time saat admin memproses.",
      },
      {
        q: "Apa arti dari setiap status?",
        a: "'Menunggu' = laporan baru diterima dan menunggu verifikasi admin. 'Diproses' = laporan sedang ditangani oleh tim teknis. 'Selesai' = kerusakan telah diperbaiki. 'Ditolak' = laporan tidak memenuhi kriteria.",
      },
      {
        q: "Berapa lama waktu respon untuk laporan yang masuk?",
        a: "Rata-rata waktu respon kami adalah 24 jam untuk laporan masuk ke tim teknis. Untuk kerusakan darurat, proses bisa lebih cepat.",
      },
    ],
  },
  {
    category: "Keamanan & Privasi",
    items: [
      {
        q: "Apakah data saya aman di SICEPU?",
        a: "Sangat aman. SICEPU menggunakan autentikasi JWT dengan enkripsi password bcrypt. Data Anda dilindungi dan tidak akan dibagikan ke pihak ketiga.",
      },
      {
        q: "Siapa yang bisa melihat laporan saya?",
        a: "Hanya Anda dan administrator yang dapat melihat detail laporan Anda. Pengguna lain tidak dapat melihat laporan yang Anda buat.",
      },
    ],
  },
];

function FaqItem({ faq, index }: { faq: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-200 dark:hover:border-blue-800/50 transition-all duration-300 text-left"
      >
        <span className="text-sm font-semibold text-slate-900 dark:text-white pr-4">
          {faq.q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-2">
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {faq.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqPage() {
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
            FAQ
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight mb-6"
          >
            Pertanyaan{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              yang Sering Diajukan
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Temukan jawaban atas pertanyaan umum seputar penggunaan SICEPU.
          </motion.p>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-24 relative">
        <div className="absolute inset-0 noise pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqCategories.map((cat, ci) => (
            <div key={ci} className="mb-12 last:mb-0">
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/25">
                  {ci + 1}
                </div>
                {cat.category}
              </motion.h2>
              <div className="space-y-3">
                {cat.items.map((faq, fi) => (
                  <FaqItem key={fi} faq={faq} index={fi} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50/80 dark:from-slate-950 dark:to-slate-900/50" />
        <div className="absolute inset-0 noise pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-xl"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 mx-auto mb-6">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Masih Punya Pertanyaan?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Jika Anda tidak menemukan jawaban yang dicari, jangan ragu untuk menghubungi tim support kami.
            </p>
            <Link href="/contact">
              <Button size="lg" variant="glow">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Hubungi Kami
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
