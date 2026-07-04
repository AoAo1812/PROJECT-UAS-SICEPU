"use client";

import { useEffect, useState, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "@/app/(dashboard)/layout";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useTranslation } from "@/lib/i18n";

interface ChatMessage {
  id: string;
  reportId: string;
  senderId: string;
  senderName: string;
  senderRole: "user" | "admin" | "bot";
  message: string;
  createdAt: string;
}

interface ChatPanelProps {
  reportId: string;
  reportName: string;
}

export default function ChatPanel({ reportId, reportName }: ChatPanelProps) {
  const user = useContext(UserContext);
  const { dark } = useTheme();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/chats?reportId=${reportId}`)
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []))
      .finally(() => setLoading(false));
  }, [reportId]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`/api/chats?reportId=${reportId}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.messages) {
            setMessages((prev) => {
              if (d.messages.length > prev.length) {
                return d.messages;
              }
              return prev;
            });
          }
        })
        .catch(() => {});
    }, 5000);

    return () => clearInterval(interval);
  }, [reportId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || sending) return;
    const msg = input.trim();
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, message: msg }),
      });
      const data = await res.json();
      if (res.ok && data.messages) {
        setMessages((prev) => [...prev, ...data.messages]);
      } else {
        setInput(msg);
      }
    } catch {
      setInput(msg);
    } finally {
      setSending(false);
    }
  };

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-br from-blue-500 to-indigo-600 text-white";
      case "bot":
        return "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white";
      default:
        return "bg-gradient-to-br from-slate-500 to-slate-600 text-white";
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", label: t("chat.admin") };
      case "bot":
        return { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", label: t("chat.bot") };
      default:
        return { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-400", label: t("chat.reporter") };
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{t("chat.title")}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{reportName}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-slate-400">{t("chat.loadingChat")}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{t("chat.noMessages")}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{t("chat.startConversation")}</p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg) => {
              const isOwn = msg.senderId === user?.id;
              const badge = getRoleBadge(msg.senderRole);
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] ${isOwn ? "order-1" : "order-1"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {!isOwn && (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${getRoleStyle(msg.senderRole)}`}>
                          {msg.senderRole === "bot" ? "B" : msg.senderName[0]}
                        </div>
                      )}
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{msg.senderName}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                    </div>
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isOwn
                          ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
                          : msg.senderRole === "bot"
                          ? "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 text-slate-800 dark:text-emerald-100 border border-emerald-200/50 dark:border-emerald-800/30 rounded-bl-md"
                          : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-md"
                      }`}
                    >
                      {msg.message}
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder={t("chat.placeholder")}
            disabled={sending}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50"
          />
          <button
            onClick={send}
            disabled={sending || !input.trim()}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:hover:shadow-blue-500/25"
          >
            {sending ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
