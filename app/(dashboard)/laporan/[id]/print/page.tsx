"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Report {
  id: string;
  facilityName: string;
  location: string;
  category: string;
  priority: string;
  description: string;
  photos: string[];
  date: string;
  status: "Menunggu" | "Diproses" | "Selesai" | "Ditolak";
  adminNote: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  Menunggu: "#F59E0B",
  Diproses: "#D4A853",
  Selesai: "#10B981",
  Ditolak: "#EF4444",
};

export default function PrintReportPage() {
  const params = useParams();
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    fetch(`/api/reports/${params.id}`)
      .then((r) => r.json())
      .then((d) => setReport(d.report));
  }, [params.id]);

  useEffect(() => {
    if (report) {
      const timer = setTimeout(() => window.print(), 800);
      return () => clearTimeout(timer);
    }
  }, [report]);

  if (!report) {
    return (
      <div style={{ padding: 40, textAlign: "center", fontFamily: "Inter, sans-serif", color: "#666" }}>
        Memuat laporan...
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: "#1C1917", lineHeight: 1.6 }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32, paddingBottom: 20, borderBottom: "3px solid #D4A853" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
          <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
            <path d="M24 4L6 12V22C6 33.1 13.84 43.36 24 46C34.16 43.36 42 33.1 42 22V12L24 4Z" fill="#D4A853"/>
            <path d="M24 7L9 14V22C9 31.5 15.5 40.26 24 42.82C32.5 40.26 39 31.5 39 22V14L24 7Z" fill="#1C1917"/>
            <rect x="18" y="15" width="12" height="16" rx="2" fill="#FAFAF9"/>
            <rect x="20.5" y="22.5" width="7" height="1.5" rx="0.75" fill="#D4A853"/>
            <rect x="20.5" y="25.5" width="5" height="1.5" rx="0.75" fill="#D4A853"/>
            <rect x="20.5" y="28.5" width="6" height="1.5" rx="0.75" fill="#D4A853"/>
          </svg>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>
            SIC<span style={{ color: "#D4A853" }}>EPU</span>
          </h1>
        </div>
        <p style={{ fontSize: 12, color: "#78716C", margin: 0 }}>
          Sistem Informasi Cepat Pelaporan Kerusakan Fasilitas Kampus
        </p>
      </div>

      {/* Report Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px 0" }}>{report.facilityName}</h2>
          <p style={{ fontSize: 13, color: "#78716C", margin: 0 }}>
            {report.location}
          </p>
        </div>
        <div style={{ 
          padding: "6px 16px", 
          borderRadius: 20, 
          backgroundColor: `${statusColors[report.status]}20`,
          color: statusColors[report.status],
          fontSize: 13,
          fontWeight: 600,
          border: `1px solid ${statusColors[report.status]}40`
        }}>
          {report.status}
        </div>
      </div>

      {/* Info Grid */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#78716C", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
          Informasi Laporan
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            { label: "ID Laporan", value: report.id.slice(0, 8).toUpperCase() },
            { label: "Pelapor", value: report.userName },
            { label: "Prioritas", value: report.priority },
            { label: "Kategori", value: report.category },
            { label: "Tanggal Kejadian", value: new Date(report.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) },
            { label: "Status", value: report.status },
          ].map((item, i) => (
            <div key={i} style={{ padding: 12, backgroundColor: "#F5F5F4", borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "#78716C", marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#78716C", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
          Deskripsi Kerusakan
        </h3>
        <div style={{ padding: 16, backgroundColor: "#FAFAF9", borderRadius: 8, border: "1px solid #E7E5E4", fontSize: 14, lineHeight: 1.8 }}>
          {report.description}
        </div>
      </div>

      {/* Admin Note */}
      {report.adminNote && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#78716C", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
            Catatan Admin
          </h3>
          <div style={{ padding: 16, backgroundColor: "#FFFBF5", borderRadius: 8, border: "1px solid #E8C76A40", fontSize: 14, lineHeight: 1.8 }}>
            {report.adminNote}
          </div>
        </div>
      )}

      {/* Photos */}
      {report.photos && report.photos.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#78716C", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
            Foto Bukti ({report.photos.length})
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {report.photos.map((photo, i) => (
              <div key={i} style={{ position: "relative" }}>
                <img 
                  src={photo} 
                  alt={`Bukti ${i + 1}`} 
                  style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 8, border: "1px solid #E7E5E4" }} 
                />
                <div style={{ 
                  position: "absolute", 
                  bottom: 8, 
                  left: 8, 
                  padding: "2px 8px", 
                  backgroundColor: "rgba(0,0,0,0.6)", 
                  color: "white", 
                  fontSize: 11, 
                  borderRadius: 4 
                }}>
                  Foto {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 40, paddingTop: 16, borderTop: "2px solid #E7E5E4", textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "#A8A29E", margin: "0 0 4px 0" }}>
          Dicetak pada {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </p>
        <p style={{ fontSize: 11, color: "#A8A29E", margin: 0 }}>
          SICEPU - Sistem Informasi Cepat Pelaporan Kerusakan Fasilitas Kampus
        </p>
      </div>

      {/* Print trigger */}
      <script dangerouslySetInnerHTML={{ __html: "window.onload = () => window.print();" }} />
    </div>
  );
}
