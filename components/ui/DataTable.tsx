"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Column<T = Record<string, unknown>> {
  key: string;
  label: string;
  className?: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T = Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  search?: string;
  onSearchChange?: (value: string) => void;
  pageSize?: number;
  page?: number;
  total?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function DataTable<T = Record<string, unknown>>({
  columns,
  data,
  search,
  onSearchChange,
  pageSize = 10,
  page: controlledPage,
  total,
  totalPages: controlledTotalPages,
  onPageChange,
}: DataTableProps<T>) {
  const [internalPage, setInternalPage] = useState(1);
  const page = controlledPage ?? internalPage;
  const totalPages = controlledTotalPages ?? (total ? Math.ceil(total / pageSize) : Math.ceil(data.length / pageSize));

  const handlePageChange = (p: number) => {
    if (onPageChange) {
      onPageChange(p);
    } else {
      setInternalPage(p);
    }
  };

  return (
    <div className="space-y-4">
      {onSearchChange && (
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground)]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search || ""}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/30 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border-color)]">
              {columns.map((col) => (
                <th key={col.key} className={`text-left px-4 py-3 text-xs font-medium text-[var(--foreground)]/40 uppercase tracking-wider ${col.className || ""}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-[var(--foreground)]/30">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              data.map((item, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-[var(--border-color)]/50 hover:bg-[var(--surface)]/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 text-sm text-[var(--foreground)] ${col.className || ""}`}>
                      {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? "")}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-[var(--foreground)]/40">
            Halaman {page} dari {totalPages}
          </p>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let p: number;
              if (totalPages <= 5) {
                p = i + 1;
              } else if (page <= 3) {
                p = i + 1;
              } else if (page >= totalPages - 2) {
                p = totalPages - 4 + i;
              } else {
                p = page - 2 + i;
              }
              return (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                    p === page
                      ? "bg-primary text-white"
                      : "text-[var(--foreground)]/40 hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
