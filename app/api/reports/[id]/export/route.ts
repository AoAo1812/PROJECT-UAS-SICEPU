import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getReportById, getUserById } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payload = await getCurrentUser();
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const report = getReportById(id);
  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  const user = getUserById(report.userId);

  return NextResponse.json({
    report: {
      ...report,
      userName: user?.name || "Unknown",
      userEmail: user?.email || "",
    },
  });
}
