import { NextRequest } from "next/server";
import { getCurrentUser, isAdminEmail } from "@/lib/auth";
import { getReportStats, getMonthlyReportData, getWeeklyReportData, getYearlyReportData, getReportsByUserId } from "@/lib/db";

export async function GET(request: NextRequest) {
  const payload = await getCurrentUser();
  if (!payload) {
    return Response.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const period = searchParams.get("period") || "monthly";

  let chartData;
  if (period === "weekly") {
    chartData = getWeeklyReportData();
  } else if (period === "yearly") {
    chartData = getYearlyReportData();
  } else {
    chartData = getMonthlyReportData();
  }

  if (isAdminEmail(payload.email)) {
    return Response.json({ stats: getReportStats(), monthly: chartData });
  }

  const reports = getReportsByUserId(payload.userId);
  const now = new Date();
  const stats = {
    total: reports.length,
    menunggu: reports.filter((r) => r.status === "Menunggu").length,
    diproses: reports.filter((r) => r.status === "Diproses").length,
    selesai: reports.filter((r) => r.status === "Selesai").length,
    ditolak: reports.filter((r) => r.status === "Ditolak").length,
    thisMonth: reports.filter((r) => {
      const d = new Date(r.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length,
  };

  return Response.json({ stats, monthly: chartData });
}
