"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "Bagaimana cara mendaftar di SICEPU?",
    a: "Cukup klik tombol 'Daftar' pada halaman utama, masukkan nama, email kampus, dan password Anda. Akun akan langsung aktif dan siap digunakan.",
  },
  {
    q: "Apakah saya bisa melaporkan lebih dari satu kerusakan?",
    a: "Tentu! Anda bisa membuat laporan sebanyak yang diperlukan. Setiap laporan akan terpisah dan dapat dipantau statusnya secara independen.",
  },
  {
    q: "Bagaimana cara melacak status laporan saya?",
    a: "Masuk ke dashboard, klik menu 'Laporan Saya', dan Anda akan melihat status terkini dari setiap laporan yang telah dikirim. Status berubah real-time saat admin memproses.",
  },
  {
    q: "Format foto apa yang didukung untuk upload?",
    a: "SICEPU mendukung format JPEG, PNG, WebP, dan GIF dengan ukuran maksimal 5MB per foto. Anda dapat upload hingga 5 foto per laporan.",
  },
  {
    q: "Berapa lama waktu respon untuk laporan yang masuk?",
    a: "Rata-rata waktu respon kami adalah 24 jam untuk laporan masuk ke tim teknis. Untuk kerusakan darurat, proses bisa lebih cepat.",
  },
  {
    q: "Apakah data saya aman di SICEPU?",
    a: "Sangat aman. SICEPU menggunakan autentikasi JWT dengan enkripsi password bcrypt. Data Anda dilindungi dan tidak akan dibagikan ke pihak ketiga.",
  },
];

function FaqItem({ faq, index }: { faq: (typeof faqs)[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-200 dark:hover:border-blue-800/50 transition-all duration-300 text-left"
      >
        <span className="text-sm font-semibold text-slate-900 dark:text-white">
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

export default function FaqSection() {
  return (
    <section id="faq" className="py-24 relative">
      <div className="absolute inset-0 noise pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/30"
          >
            FAQ
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Pertanyaan{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Umum
            </span>
          </h2>
          <p className="mt-5 text-lg text-slate-600 dark:text-slate-400">
            Temukan jawaban atas pertanyaan yang sering diajukan.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FaqItem key={i} faq={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
