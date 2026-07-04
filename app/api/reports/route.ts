import { NextRequest } from "next/server";
import { getCurrentUser, isAdminEmail } from "@/lib/auth";
import { getReports, createReport, getReportsByUserId, getUserById, createChatMessage } from "@/lib/db";
import { v4 as uuid } from "uuid";

export async function GET(request: NextRequest) {
  const payload = await getCurrentUser();
  if (!payload) {
    return Response.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const category = searchParams.get("category") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  let reports = isAdminEmail(payload.email) ? getReports() : getReportsByUserId(payload.userId);

  reports = reports.map((r) => {
    const user = getUserById(r.userId);
    return { ...r, userName: user?.name || "Unknown" };
  });

  if (search) {
    const q = search.toLowerCase();
    reports = reports.filter(
      (r) =>
        r.facilityName.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }

  if (status) {
    reports = reports.filter((r) => r.status === status);
  }

  if (category) {
    reports = reports.filter((r) => r.category === category);
  }

  reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = reports.length;
  const totalPages = Math.ceil(total / limit);
  const paginated = reports.slice((page - 1) * limit, page * limit);

  return Response.json({ reports: paginated, total, totalPages, page, hasMore: page < totalPages });
}

export async function POST(request: NextRequest) {
  const payload = await getCurrentUser();
  if (!payload) {
    return Response.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    let facilityName = "";
    let location = "";
    let category = "";
    let priority = "Sedang";
    let description = "";
    let date = "";
    let photosRaw: string[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      facilityName = formData.get("facilityName") as string;
      location = formData.get("location") as string;
      category = formData.get("category") as string;
      priority = (formData.get("priority") as string) || "Sedang";
      description = formData.get("description") as string;
      date = formData.get("date") as string;
      photosRaw = formData.getAll("photos") as string[];
    } else {
      const body = await request.json();
      facilityName = body.facilityName || "";
      location = body.location || "";
      category = body.category || "";
      priority = body.priority || "Sedang";
      description = body.description || "";
      date = body.date || "";
      photosRaw = body.photos || [];
    }

    if (!facilityName || !location || !category || !description) {
      return Response.json({ error: "Semua field wajib harus diisi" }, { status: 400 });
    }

    const report = createReport({
      id: uuid(),
      userId: payload.userId,
      facilityName,
      location,
      category,
      priority,
      description,
      photos: photosRaw,
      date: date || new Date().toISOString().split("T")[0],
      status: "Menunggu",
      adminNote: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Auto-send welcome chat from bot
    createChatMessage({
      id: uuid(),
      reportId: report.id,
      senderId: "system-bot",
      senderName: "SICEPU Bot",
      senderRole: "bot",
      message: `Terima kasih telah melaporkan kerusakan "${facilityName}" di ${location}. Laporan Anda dengan ID ${report.id.slice(0, 8)} telah diterima dan menunggu verifikasi dari admin. Kami akan segera memprosesnya. Anda bisa menanyakan status laporan ini melalui chat ini.`,
      createdAt: new Date().toISOString(),
    });

    return Response.json({ report, message: "Laporan berhasil dibuat" }, { status: 201 });
  } catch {
    return Response.json({ error: "Gagal membuat laporan" }, { status: 500 });
  }
}
