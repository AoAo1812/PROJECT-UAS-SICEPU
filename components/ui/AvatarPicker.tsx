"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface AvatarPickerProps {
  currentAvatar: string;
  onSelect: (avatarUrl: string) => void;
}

const defaultAvatars = [
  // Blue series
  { id: "blue-1", bg: "from-blue-400 to-blue-600", emoji: "👨‍💻" },
  { id: "blue-2", bg: "from-blue-500 to-indigo-600", emoji: "👩‍💻" },
  { id: "blue-3", bg: "from-sky-400 to-blue-500", emoji: "🧑‍🎓" },
  // Green series
  { id: "green-1", bg: "from-emerald-400 to-emerald-600", emoji: "👨‍🔬" },
  { id: "green-2", bg: "from-green-400 to-teal-500", emoji: "👩‍🏫" },
  { id: "green-3", bg: "from-teal-400 to-cyan-500", emoji: "🧑‍⚕️" },
  // Warm series
  { id: "warm-1", bg: "from-amber-400 to-orange-500", emoji: "👨‍🎨" },
  { id: "warm-2", bg: "from-rose-400 to-pink-500", emoji: "👩‍🎤" },
  { id: "warm-3", bg: "from-orange-400 to-red-500", emoji: "🧑‍🚀" },
  // Purple series
  { id: "purple-1", bg: "from-violet-400 to-purple-600", emoji: "🧙" },
  { id: "purple-2", bg: "from-fuchsia-400 to-purple-500", emoji: "🦊" },
  { id: "purple-3", bg: "from-indigo-400 to-blue-500", emoji: "🐱" },
  // Nature
  { id: "nature-1", bg: "from-lime-400 to-green-500", emoji: "🦁" },
  { id: "nature-2", bg: "from-yellow-400 to-amber-500", emoji: "🐼" },
  { id: "nature-3", bg: "from-cyan-400 to-blue-400", emoji: "🦄" },
];

export default function AvatarPicker({ currentAvatar, onSelect }: AvatarPickerProps) {
  const [selected, setSelected] = useState(currentAvatar);

  const handleSelect = (avatar: typeof defaultAvatars[0]) => {
    const dataUrl = `data:avatar/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${getGradientColor(avatar.bg, 'from')};stop-opacity:1" /><stop offset="100%" style="stop-color:${getGradientColor(avatar.bg, 'to')};stop-opacity:1" /></linearGradient></defs><rect width="200" height="200" rx="40" fill="url(#g)"/><text x="100" y="115" font-size="80" text-anchor="middle" dominant-baseline="middle">${avatar.emoji}</text></svg>`)}`;
    setSelected(dataUrl);
    onSelect(dataUrl);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Pilih Avatar Default</p>
      <div className="grid grid-cols-5 gap-2">
        {defaultAvatars.map((avatar) => (
          <motion.button
            key={avatar.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(avatar)}
            className={`relative w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${
              selected.includes(avatar.emoji)
                ? "ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
                : "hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-600"
            } bg-gradient-to-br ${avatar.bg} shadow-md`}
          >
            {avatar.emoji}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function getGradientColor(classes: string, type: "from" | "to"): string {
  const colorMap: Record<string, string> = {
    "blue-400": "#60A5FA", "blue-500": "#3B82F6", "blue-600": "#2563EB",
    "indigo-400": "#818CF8", "indigo-600": "#4F46E5",
    "sky-400": "#38BDF8", "sky-500": "#0EA5E9",
    "emerald-400": "#34D399", "emerald-600": "#059669",
    "green-400": "#4ADE80", "green-500": "#22C55E",
    "teal-400": "#2DD4BF", "teal-500": "#14B8A6",
    "cyan-400": "#22D3EE", "cyan-500": "#06B6D4",
    "amber-400": "#FBBF24", "amber-500": "#F59E0B",
    "orange-400": "#FB923C", "orange-500": "#F97316",
    "rose-400": "#FB7185", "rose-500": "#F43F5E",
    "pink-500": "#EC4899",
    "red-500": "#EF4444",
    "violet-400": "#A78BFA", "violet-600": "#7C3AED",
    "purple-500": "#A855F7", "purple-600": "#9333EA",
    "fuchsia-400": "#E879F9", "fuchsia-500": "#D946EF",
    "lime-400": "#A3E635",
    "yellow-400": "#FACC15",
  };
  const classParts = classes.split(" ");
  const target = type === "from" ? classParts[0] : classParts[classParts.length - 1];
  return colorMap[target] || "#3B82F6";
}
