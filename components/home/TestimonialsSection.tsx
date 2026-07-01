"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

export default function TestimonialsSection() {
  const { t } = useTranslation();

  const testimonials = [
    { name: "Rina Wulandari", role: "Mahasiswa Teknik Informatika", avatar: "RW", rating: 5, text: "SICEPU sangat membantu saya melaporkan AC yang rusak. Dalam 2 hari langsung diperbaiki!", color: "from-primary to-accent" },
    { name: "Ahmad Fauzi", role: "Staff Administrasi", avatar: "AF", rating: 5, text: "Dashboard analitiknya sangat membantu pengambilan keputusan untuk menangani laporan.", color: "from-emerald-500 to-teal-500" },
    { name: "Siti Nurhaliza", role: "Mahasiswa Kedokteran", avatar: "SN", rating: 5, text: "Upload foto bukti jadi lebih mudah dengan drag-and-drop. Status juga bisa dipantau kapan saja.", color: "from-purple-500 to-pink-500" },
    { name: "Budi Santoso", role: "Kepala Bagian Sarana", avatar: "BS", rating: 5, text: "Platform ini mengubah cara kami menangani kerusakan fasilitas. Dari manual jadi fully digital.", color: "from-amber-500 to-orange-500" },
  ];

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 noise pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-medium text-primary mb-3 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            {t("testimonials.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] tracking-tight">
            {t("testimonials.title")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              {t("testimonials.titleHighlight")}
            </span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((tItem, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -2 }}
              className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] hover:border-primary/30 transition-all duration-200"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: tItem.rating }).map((_, j) => (
                  <svg key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-xs text-[var(--foreground)]/60 leading-relaxed mb-4">
                &ldquo;{tItem.text}&rdquo;
              </p>
              <div className="flex items-center gap-2.5 pt-3 border-t border-[var(--border-color)]">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${tItem.color} flex items-center justify-center text-[10px] font-bold text-white`}>
                  {tItem.avatar}
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--foreground)]">{tItem.name}</p>
                  <p className="text-[10px] text-[var(--foreground)]/30">{tItem.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
