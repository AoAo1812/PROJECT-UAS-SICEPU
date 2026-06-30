import { NextRequest } from "next/server";
import { getCurrentUser, isAdminEmail } from "@/lib/auth";
import { getReportById, updateReport, deleteReport, getUserById, createChatMessage } from "@/lib/db";
import { v4 as uuid } from "uuid";

// Auto-chat messages for status changes
function getStatusChatMessage(status: string, facilityName: string, adminNote: string): string {
  const messages: Record<string, string> = {
    Diproses: `Laporan "${facilityName}" sedang diproses oleh tim teknis kami. Kerusakan akan segera ditangani. ${adminNote ? "Catatan: " + adminNote : ""}`,
    Selesai: `Kabar baik! Laporan "${facilityName}" telah selesai ditangani. Kerusakan sudah diperbaiki. Terima kasih telah melaporkan! ${adminNote ? "Catatan: " + adminNote : ""}`,
    Ditolak: `Mohon maaf, laporan "${facilityName}" tidak dapat diproses. ${adminNote || "Silakan hubungi admin untuk informasi lebih lanjut."}`,
  };
  return messages[status] || "";
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payload = await getCurrentUser();
  if (!payload) {
    return Response.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  const report = getReportById(id);
  if (!report) {
    return Response.json({ error: "Laporan tidak ditemukan" }, { status: 404 });
  }

  if (!isAdminEmail(payload.email) && report.userId !== payload.userId) {
    return Response.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const user = getUserById(report.userId);
  return Response.json({ report: { ...report, userName: user?.name || "Unknown" } });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payload = await getCurrentUser();
  if (!payload) {
    return Response.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  const report = getReportById(id);
  if (!report) {
    return Response.json({ error: "Laporan tidak ditemukan" }, { status: 404 });
  }

  if (!isAdminEmail(payload.email) && report.userId !== payload.userId) {
    return Response.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const body = await request.json();

  if (isAdminEmail(payload.email)) {
    const newStatus = body.status || report.status;
    const newAdminNote = body.adminNote !== undefined ? body.adminNote : report.adminNote;
    const statusChanged = newStatus !== report.status;

    const updated = updateReport(id, {
      status: newStatus,
      adminNote: newAdminNote,
      updatedAt: new Date().toISOString(),
    });

    // Auto-send chat message to user when status changes
    if (statusChanged) {
      const chatMessage = getStatusChatMessage(newStatus, report.facilityName, newAdminNote);
      if (chatMessage) {
        createChatMessage({
          id: uuid(),
          reportId: id,
          senderId: "system-bot",
          senderName: "SICEPU Bot",
          senderRole: "bot",
          message: chatMessage,
          createdAt: new Date().toISOString(),
        });
      }
    }

    return Response.json({ report: updated, message: "Laporan diperbarui" });
  }

  const updated = updateReport(id, {
    facilityName: body.facilityName || report.facilityName,
    location: body.location || report.location,
    category: body.category || report.category,
    description: body.description || report.description,
    date: body.date || report.date,
    updatedAt: new Date().toISOString(),
  });
  return Response.json({ report: updated, message: "Laporan diperbarui" });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payload = await getCurrentUser();
  if (!payload) {
    return Response.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  const report = getReportById(id);
  if (!report) {
    return Response.json({ error: "Laporan tidak ditemukan" }, { status: 404 });
  }

  if (!isAdminEmail(payload.email) && report.userId !== payload.userId) {
    return Response.json({ error: "Akses ditolak" }, { status: 403 });
  }

  deleteReport(id);
  return Response.json({ message: "Laporan berhasil dihapus" });
}
