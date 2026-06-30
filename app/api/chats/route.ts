import { NextRequest } from "next/server";
import { getCurrentUser, isAdminEmail } from "@/lib/auth";
import { createChatMessage, getChats, getReportById, updateReport, getUserById } from "@/lib/db";
import { v4 as uuid } from "uuid";

// Bot auto-reply logic
function getBotReply(report: { facilityName: string; status: string; adminNote?: string }): string {
  const replies: Record<string, string[]> = {
    Menunggu: [
      `Terima kasih telah melaporkan kerusakan "${report.facilityName}". Laporan Anda telah diterima dan menunggu verifikasi dari admin. Kami akan segera memprosesnya.`,
      `Halo! Laporan "${report.facilityName}" Anda sudah kami terima. Tim admin akan segera meninjau laporan Anda. Mohon tunggu konfirmasi lebih lanjut.`,
    ],
    Diproses: [
      `Kabar baik! Laporan "${report.facilityName}" Anda sedang dalam proses perbaikan. Tim teknis kami sedang bekerja untuk menyelesaikan masalah ini.`,
      `Laporan "${report.facilityName}" sedang diproses oleh tim kami. Estimasi perbaikan akan kami informasikan segera.`,
    ],
    Selesai: [
      `Laporan "${report.facilityName}" telah selesai ditangani! Kerusakan sudah diperbaiki. Terima kasih telah melaporkan masalah ini.`,
      `Selesai! "${report.facilityName}" sudah diperbaiki. Jika ada masalah lain, jangan ragu untuk melaporkan kembali.`,
    ],
    Ditolak: [
      `Mohon maaf, laporan "${report.facilityName}" tidak dapat diproses. ${report.adminNote || "Silakan hubungi admin untuk informasi lebih lanjut."}`,
      `Laporan "${report.facilityName}" ditolak. ${report.adminNote || "Untuk informasi lebih lanjut, silakan hubungi admin."}`,
    ],
  };

  const statusReplies = replies[report.status] || replies.Menunggu;
  return statusReplies[Math.floor(Math.random() * statusReplies.length)];
}

export async function GET(request: NextRequest) {
  const payload = await getCurrentUser();
  if (!payload) {
    return Response.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const reportId = searchParams.get("reportId");

  let messages;
  if (reportId) {
    messages = getChats().filter((c) => c.reportId === reportId);
  } else if (isAdminEmail(payload.email)) {
    messages = getChats();
  } else {
    messages = getChats().filter((c) => c.senderId === payload.userId);
  }

  // Sort by creation time
  messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return Response.json({ messages });
}

export async function POST(request: NextRequest) {
  const payload = await getCurrentUser();
  if (!payload) {
    return Response.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  try {
    const { reportId, message } = await request.json();

    if (!reportId || !message) {
      return Response.json({ error: "reportId dan message harus diisi" }, { status: 400 });
    }

    const report = getReportById(reportId);
    if (!report) {
      return Response.json({ error: "Laporan tidak ditemukan" }, { status: 404 });
    }

    // Non-admin can only chat on their own reports
    if (!isAdminEmail(payload.email) && report.userId !== payload.userId) {
      return Response.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const user = getUserById(payload.userId);
    const senderName = user?.name || "Unknown";

    // Create user/admin message
    const chatMsg = createChatMessage({
      id: uuid(),
      reportId,
      senderId: payload.userId,
      senderName,
      senderRole: isAdminEmail(payload.email) ? "admin" : "user",
      message,
      createdAt: new Date().toISOString(),
    });

    // Auto bot reply after a short delay
    const reportData = getReportById(reportId);
    if (reportData) {
      const botReply = getBotReply({
        facilityName: reportData.facilityName,
        status: reportData.status,
        adminNote: reportData.adminNote,
      });

      const botMsg = createChatMessage({
        id: uuid(),
        reportId,
        senderId: "system-bot",
        senderName: "SICEPU Bot",
        senderRole: "bot",
        message: botReply,
        createdAt: new Date(Date.now() + 1000).toISOString(),
      });

      return Response.json({
        messages: [chatMsg, botMsg],
        message: "Pesan terkirim",
      }, { status: 201 });
    }

    return Response.json({
      messages: [chatMsg],
      message: "Pesan terkirim",
    }, { status: 201 });
  } catch {
    return Response.json({ error: "Gagal mengirim pesan" }, { status: 500 });
  }
}
