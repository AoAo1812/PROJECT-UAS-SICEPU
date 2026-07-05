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

const statusLabels: Record<string, string> = {
  Menunggu: "Menunggu Verifikasi",
  Diproses: "Sedang Diproses",
  Selesai: "Selesai Diperbaiki",
  Ditolak: "Ditolak",
};

const statusColors: Record<string, string> = {
  Menunggu: "#D97706",
  Diproses: "#2563EB",
  Selesai: "#059669",
  Ditolak: "#DC2626",
};

const categoryLabels: Record<string, string> = {
  electrical: "Listrik",
  plumbing: "Plumbing",
  furniture: "Furniture",
  it: "IT/Komputer",
  building: "Bangunan",
  other: "Lainnya",
  facilityRoom: "Fasilitas Ruangan",
  equipment: "Peralatan",
  electricalWater: "Listrik & Air",
  network: "Jaringan & Internet",
  cleanliness: "Kebersihan",
  security: "Keamanan",
};

const priorityLabels: Record<string, string> = {
  Rendah: "Rendah",
  Sedang: "Sedang",
  Tinggi: "Tinggi",
  Darurat: "Darurat",
};

export default function CetakLaporanPage() {
  const params = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/reports/${params.id}`, { credentials: "include" })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
        return data;
      })
      .then((d) => {
        if (d.report) setReport(d.report);
        else throw new Error("Data laporan kosong");
      })
      .catch((e: Error) => setErrorMsg(e.message));
  }, [params.id]);

  useEffect(() => {
    if (report) {
      const timer = setTimeout(() => window.print(), 1000);
      return () => clearTimeout(timer);
    }
  }, [report]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  const formatDateTime = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const getReportNumber = () => {
    const date = new Date(report?.createdAt || Date.now());
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const idShort = report?.id.slice(0, 6).toUpperCase() || "XXXXXX";
    return `LP/${idShort}/${month}/${year}`;
  };

  if (errorMsg) {
    return (
      <div style={{ padding: 60, textAlign: "center", fontFamily: "sans-serif", color: "#666" }}>
        <p style={{ fontSize: 16, fontWeight: "bold", color: "#dc2626" }}>Gagal memuat laporan</p>
        <p style={{ fontSize: 13, color: "#888" }}>{errorMsg}</p>
        <button onClick={() => window.close()} style={{ marginTop: 16, padding: "8px 20px", background: "#1a1a1a", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
          Tutup
        </button>
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ padding: 60, textAlign: "center", fontFamily: "sans-serif", color: "#666" }}>
        <div style={{ display: "inline-block", width: 36, height: 36, border: "3px solid #ddd", borderTopColor: "#1a1a1a", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ marginTop: 16, fontSize: 14 }}>Memuat data laporan...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media print {
          @page { size: A4; margin: 20mm 15mm 25mm 15mm; }
          body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .avoid-break { page-break-inside: avoid; }
        }
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background: white; }
      `}</style>

      <div style={{ fontFamily: "'Times New Roman', Times, Georgia, serif", color: "#1a1a1a", lineHeight: 1.8, fontSize: 12, maxWidth: 750, margin: "0 auto", padding: "30px 40px", background: "white" }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: 28, borderBottom: "3px double #1a1a1a", paddingBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 8 }}>
            <svg width="50" height="50" viewBox="0 0 48 48" fill="none">
              <path d="M24 4L6 12V22C6 33.1 13.84 43.36 24 46C34.16 43.36 42 33.1 42 22V12L24 4Z" fill="#1a1a1a"/>
              <path d="M24 7L9 14V22C9 31.5 15.5 40.26 24 42.82C32.5 40.26 39 31.5 39 22V14L24 7Z" fill="white"/>
              <rect x="18" y="15" width="12" height="16" rx="2" fill="#1a1a1a"/>
              <rect x="20.5" y="22.5" width="7" height="1.5" rx="0.75" fill="#D4A853"/>
              <rect x="20.5" y="25.5" width="5" height="1.5" rx="0.75" fill="#D4A853"/>
              <rect x="20.5" y="28.5" width="6" height="1.5" rx="0.75" fill="#D4A853"/>
            </svg>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: "bold", margin: 0, letterSpacing: 3, textTransform: "uppercase" }}>SICEPU</h1>
              <p style={{ fontSize: 11, margin: 0, color: "#555", letterSpacing: 1 }}>Sistem Informasi Cepat Pelaporan Kerusakan Fasilitas Kampus</p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #1a1a1a", marginTop: 12, paddingTop: 8 }}>
            <p style={{ fontSize: 10, margin: 0, color: "#666" }}>Universitas Indonesia &middot; Jl. Salemba Raya No. 4, Jakarta Pusat 10430</p>
          </div>
        </div>

        {/* JUDUL */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: "bold", margin: "0 0 4px 0", textTransform: "uppercase", letterSpacing: 3 }}>LAPORAN KERUSAKAN</h2>
          <p style={{ fontSize: 12, margin: 0, color: "#555" }}>Nomor: {getReportNumber()}</p>
        </div>

        {/* TABEL INFO */}
        <div className="avoid-break" style={{ marginBottom: 28 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <tbody>
              <tr>
                <td style={{ padding: "8px 12px", border: "1px solid #ccc", width: "30%", background: "#f0f0f0", fontWeight: "bold" }}>ID Laporan</td>
                <td style={{ padding: "8px 12px", border: "1px solid #ccc", fontFamily: "monospace" }}>{report.id.slice(0, 8).toUpperCase()}</td>
                <td style={{ padding: "8px 12px", border: "1px solid #ccc", width: "22%", background: "#f0f0f0", fontWeight: "bold" }}>Tanggal Laporan</td>
                <td style={{ padding: "8px 12px", border: "1px solid #ccc" }}>{formatDateTime(report.createdAt)}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 12px", border: "1px solid #ccc", background: "#f0f0f0", fontWeight: "bold" }}>Nama Fasilitas</td>
                <td style={{ padding: "8px 12px", border: "1px solid #ccc", fontWeight: "bold" }} colSpan={3}>{report.facilityName}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 12px", border: "1px solid #ccc", background: "#f0f0f0", fontWeight: "bold" }}>Lokasi</td>
                <td style={{ padding: "8px 12px", border: "1px solid #ccc" }} colSpan={3}>{report.location}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 12px", border: "1px solid #ccc", background: "#f0f0f0", fontWeight: "bold" }}>Kategori</td>
                <td style={{ padding: "8px 12px", border: "1px solid #ccc" }}>{categoryLabels[report.category] || report.category}</td>
                <td style={{ padding: "8px 12px", border: "1px solid #ccc", background: "#f0f0f0", fontWeight: "bold" }}>Prioritas</td>
                <td style={{ padding: "8px 12px", border: "1px solid #ccc", color: statusColors[report.priority] || "#1a1a1a", fontWeight: "bold" }}>{priorityLabels[report.priority] || report.priority}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 12px", border: "1px solid #ccc", background: "#f0f0f0", fontWeight: "bold" }}>Tanggal Kejadian</td>
                <td style={{ padding: "8px 12px", border: "1px solid #ccc" }}>{formatDate(report.date)}</td>
                <td style={{ padding: "8px 12px", border: "1px solid #ccc", background: "#f0f0f0", fontWeight: "bold" }}>Status</td>
                <td style={{ padding: "8px 12px", border: "1px solid #ccc" }}>
                  <span style={{ display: "inline-block", padding: "3px 12px", borderRadius: 4, background: `${statusColors[report.status]}15`, color: statusColors[report.status], fontWeight: "bold", fontSize: 11, border: `1px solid ${statusColors[report.status]}30` }}>
                    {statusLabels[report.status] || report.status}
                  </span>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px 12px", border: "1px solid #ccc", background: "#f0f0f0", fontWeight: "bold" }}>Pelapor</td>
                <td style={{ padding: "8px 12px", border: "1px solid #ccc" }}>{report.userName}</td>
                <td style={{ padding: "8px 12px", border: "1px solid #ccc", background: "#f0f0f0", fontWeight: "bold" }}>Terakhir Diperbarui</td>
                <td style={{ padding: "8px 12px", border: "1px solid #ccc" }}>{formatDateTime(report.updatedAt)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* URAIAN KERUSAKAN */}
        <div className="avoid-break" style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 13, fontWeight: "bold", margin: "0 0 10px 0", textTransform: "uppercase", borderBottom: "2px solid #1a1a1a", paddingBottom: 4 }}>A. URAIAN KERUSAKAN</h3>
          <div style={{ padding: 14, border: "1px solid #ddd", borderRadius: 4, background: "#fafafa", fontSize: 12, lineHeight: 2, textAlign: "justify" }}>
            {report.description}
          </div>
        </div>

        {/* STATUS PENANGANAN */}
        <div className="avoid-break" style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 13, fontWeight: "bold", margin: "0 0 12px 0", textTransform: "uppercase", borderBottom: "2px solid #1a1a1a", paddingBottom: 4 }}>B. STATUS PENANGANAN</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr>
                <th style={{ padding: "8px 10px", border: "1px solid #ccc", background: "#1a1a1a", color: "white", textAlign: "center", width: "6%" }}>No</th>
                <th style={{ padding: "8px 10px", border: "1px solid #ccc", background: "#1a1a1a", color: "white", textAlign: "left", width: "28%" }}>Tahapan</th>
                <th style={{ padding: "8px 10px", border: "1px solid #ccc", background: "#1a1a1a", color: "white", textAlign: "left" }}>Keterangan</th>
                <th style={{ padding: "8px 10px", border: "1px solid #ccc", background: "#1a1a1a", color: "white", textAlign: "center", width: "18%" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { step: "Penerimaan Laporan", desc: "Laporan diterima oleh sistem dan terdaftar", status: "Selesai" },
                { step: "Verifikasi Admin", desc: "Admin memverifikasi data dan kelengkapan", status: report.status === "Menunggu" ? "Proses" : "Selesai" },
                { step: "Penanganan Teknis", desc: "Tim teknis melakukan perbaikan fasilitas", status: report.status === "Diproses" ? "Proses" : report.status === "Selesai" ? "Selesai" : "Belum" },
                { step: "Perbaikan Selesai", desc: "Fasilitas dapat digunakan kembali", status: report.status === "Selesai" ? "Selesai" : "Belum" },
              ].map((item, i) => (
                <tr key={i}>
                  <td style={{ padding: "8px 10px", border: "1px solid #ccc", textAlign: "center" }}>{i + 1}</td>
                  <td style={{ padding: "8px 10px", border: "1px solid #ccc", fontWeight: "bold" }}>{item.step}</td>
                  <td style={{ padding: "8px 10px", border: "1px solid #ccc" }}>{item.desc}</td>
                  <td style={{ padding: "8px 10px", border: "1px solid #ccc", textAlign: "center" }}>
                    <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 3, fontSize: 10, fontWeight: "bold", background: item.status === "Selesai" ? "#d1fae5" : item.status === "Proses" ? "#fef3c7" : "#f3f4f6", color: item.status === "Selesai" ? "#065f46" : item.status === "Proses" ? "#92400e" : "#6b7280" }}>
                      {item.status === "Selesai" ? "✓ Selesai" : item.status === "Proses" ? "● Proses" : "○ Belum"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CATATAN ADMIN */}
        {report.adminNote && (
          <div className="avoid-break" style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 13, fontWeight: "bold", margin: "0 0 10px 0", textTransform: "uppercase", borderBottom: "2px solid #1a1a1a", paddingBottom: 4 }}>C. CATATAN PENANGANAN</h3>
            <div style={{ padding: 14, border: "1px solid #D4A853", borderRadius: 4, background: "#FFFBEB", fontSize: 12, lineHeight: 2 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#D4A853", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <span style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>A</span>
                </div>
                <div>
                  <p style={{ margin: "0 0 4px 0", fontWeight: "bold", fontSize: 11, color: "#92400e" }}>Administrator SICEPU</p>
                  <p style={{ margin: 0 }}>{report.adminNote}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FOTO BUKTI */}
        {report.photos && report.photos.length > 0 && (
          <div className="avoid-break" style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 13, fontWeight: "bold", margin: "0 0 12px 0", textTransform: "uppercase", borderBottom: "2px solid #1a1a1a", paddingBottom: 4 }}>D. FOTO BUKTI KERUSAKAN</h3>
            <div style={{ display: "grid", gridTemplateColumns: report.photos.length === 1 ? "1fr" : "repeat(2, 1fr)", gap: 12 }}>
              {report.photos.map((photo, i) => (
                <div key={i} style={{ border: "1px solid #ddd", borderRadius: 4, overflow: "hidden" }}>
                  <img src={photo} alt={`Bukti ${i + 1}`} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
                  <div style={{ padding: "6px 10px", background: "#f5f5f5", fontSize: 10, textAlign: "center", borderTop: "1px solid #ddd" }}>Gambar {i + 1} - Bukti Kerusakan</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RINGKASAN */}
        <div className="avoid-break" style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 13, fontWeight: "bold", margin: "0 0 10px 0", textTransform: "uppercase", borderBottom: "2px solid #1a1a1a", paddingBottom: 4 }}>E. RINGKASAN</h3>
          <div style={{ padding: 14, border: "1px solid #ddd", borderRadius: 4, background: "#fafafa", fontSize: 12, lineHeight: 2.2 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "3px 0", width: "40%", color: "#555" }}>Total Foto Bukti</td>
                  <td style={{ padding: "3px 0", fontWeight: "bold" }}>: {report.photos?.length || 0} foto</td>
                </tr>
                <tr>
                  <td style={{ padding: "3px 0", color: "#555" }}>Status Saat Ini</td>
                  <td style={{ padding: "3px 0", fontWeight: "bold", color: statusColors[report.status] }}>: {statusLabels[report.status] || report.status}</td>
                </tr>
                <tr>
                  <td style={{ padding: "3px 0", color: "#555" }}>Lama Penanganan</td>
                  <td style={{ padding: "3px 0", fontWeight: "bold" }}>: {Math.max(1, Math.ceil((new Date(report.updatedAt).getTime() - new Date(report.createdAt).getTime()) / (1000 * 60 * 60 * 24)))} hari</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TANDA TANGAN */}
        <div className="avoid-break" style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: "45%", textAlign: "center" }}>
              <p style={{ fontSize: 11, margin: "0 0 70px 0", color: "#555" }}>Mengetahui,</p>
              <div style={{ borderTop: "1px solid #1a1a1a", width: 140, margin: "0 auto", paddingTop: 4 }}>
                <p style={{ fontSize: 12, margin: "4px 0 0 0", fontWeight: "bold" }}>{report.userName}</p>
                <p style={{ fontSize: 10, margin: 0, color: "#666" }}>Pelapor</p>
              </div>
            </div>
            <div style={{ width: "45%", textAlign: "center" }}>
              <p style={{ fontSize: 11, margin: "0 0 70px 0", color: "#555" }}>{formatDate(new Date().toISOString())}</p>
              <div style={{ borderTop: "1px solid #1a1a1a", width: 140, margin: "0 auto", paddingTop: 4 }}>
                <p style={{ fontSize: 12, margin: "4px 0 0 0", fontWeight: "bold" }}>Administrator</p>
                <p style={{ fontSize: 10, margin: 0, color: "#666" }}>SICEPU</p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ marginTop: 32, paddingTop: 12, borderTop: "3px double #1a1a1a", textAlign: "center" }}>
          <p style={{ fontSize: 10, color: "#888", margin: "0 0 4px 0" }}>Dokumen ini dicetak secara otomatis oleh sistem SICEPU</p>
          <p style={{ fontSize: 10, color: "#888", margin: "0 0 4px 0" }}>Dicetak pada: {formatDateTime(new Date().toISOString())}</p>
          <p style={{ fontSize: 9, color: "#aaa", margin: 0 }}>SICEPU - Sistem Informasi Cepat Pelaporan Kerusakan Fasilitas Kampus</p>
        </div>
      </div>
    </>
  );
}
