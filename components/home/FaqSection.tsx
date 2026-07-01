"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import idFaqs from "@/lib/translations/id.json";
import enFaqs from "@/lib/translations/en.json";
import zhFaqs from "@/lib/translations/zh.json";
import jaFaqs from "@/lib/translations/ja.json";
import koFaqs from "@/lib/translations/ko.json";
import arFaqs from "@/lib/translations/ar.json";

const allFaqs: Record<string, Array<{ q: string; a: string }>> = {
  id: idFaqs.faq.items,
  en: enFaqs.faq.items,
  zh: zhFaqs.faq.items,
  ja: jaFaqs.faq.items,
  ko: koFaqs.faq.items,
  ar: arFaqs.faq.items,
};

const faqTitles: Record<string, { badge: string; title: string; highlight: string }> = {
  id: { badge: "FAQ", title: "Pertanyaan", highlight: "Umum" },
  en: { badge: "FAQ", title: "Frequently Asked", highlight: "Questions" },
  zh: { badge: "常见问题", title: "常见", highlight: "问题" },
  ja: { badge: "よくある質問", title: "よくある", highlight: "質問" },
  ko: { badge: "자주 묻는 질문", title: "자주 묻는", highlight: "질문" },
  ar: { badge: "الأسئلة الشائعة", title: "الأسئلة", highlight: "الشائعة" },
};

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] hover:border-primary/30 transition-all duration-200 text-left"
      >
        <span className="text-sm font-medium text-[var(--foreground)]">{q}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 w-7 h-7 rounded-lg bg-[var(--background)] border border-[var(--border-color)] flex items-center justify-center"
        >
          <svg className="w-3.5 h-3.5 text-[var(--foreground)]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1">
              <p className="text-xs text-[var(--foreground)]/60 leading-relaxed">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqSection() {
  const { locale } = useTranslation();
  const faqs = allFaqs[locale] || allFaqs.id;
  const titles = faqTitles[locale] || faqTitles.id;

  return (
    <section id="faq" className="py-24 relative">
      <div className="absolute inset-0 noise pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-medium text-primary mb-3 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            {titles.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] tracking-tight">
            {titles.title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              {titles.highlight}
            </span>
          </h2>
        </motion.div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
