"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface FileUploadProps {
  onUpload: (urls: string[]) => void;
  maxFiles?: number;
}

export default function FileUpload({ onUpload, maxFiles = 5 }: FileUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList) => {
      const remaining = maxFiles - previews.length;
      if (remaining <= 0) {
        toast.error(`Maksimal ${maxFiles} foto`);
        return;
      }

      const toUpload = Array.from(files).slice(0, remaining);
      setUploading(true);

      try {
        const urls: string[] = [];
        for (const file of toUpload) {
          if (file.size > 5 * 1024 * 1024) {
            toast.error(`${file.name} melebihi 5MB`);
            continue;
          }

          const fd = new FormData();
          fd.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          const data = await res.json();
          if (res.ok) {
            urls.push(data.url);
          } else {
            toast.error(data.error || "Gagal upload");
          }
        }

        const all = [...previews, ...urls];
        setPreviews(all);
        onUpload(all);
        if (urls.length > 0) toast.success(`${urls.length} foto berhasil diupload`);
      } catch {
        toast.error("Gagal upload file");
      } finally {
        setUploading(false);
      }
    },
    [previews, maxFiles, onUpload]
  );

  const removePreview = (index: number) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    onUpload(updated);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
          dragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 scale-[1.02]"
            : "border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />

        <div className="flex flex-col items-center gap-3">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              dragActive
                ? "bg-blue-100 dark:bg-blue-900/30 scale-110"
                : "bg-slate-100 dark:bg-slate-800"
            }`}
          >
            <svg
              className={`w-6 h-6 transition-colors ${
                dragActive
                  ? "text-blue-600"
                  : "text-slate-400 dark:text-slate-500"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {dragActive ? "Lepaskan file di sini" : "Klik atau seret foto ke sini"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              JPG, PNG, WebP (maks. 5MB) &middot; {previews.length}/{maxFiles} foto
            </p>
          </div>
        </div>

        {uploading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Mengupload...
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {previews.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {previews.map((url, i) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700"
              >
                <img
                  src={url}
                  alt={`Preview ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removePreview(i);
                  }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
