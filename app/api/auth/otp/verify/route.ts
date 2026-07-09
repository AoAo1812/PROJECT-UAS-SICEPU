import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUserById } from "@/lib/db";
import { verifyOTP } from "@/lib/otp-store";

export async function POST(request: NextRequest) {
  try {
    const payload = await getCurrentUser();
    if (!payload) {
      return Response.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const { email, code } = await request.json();
    if (!email || !code) {
      return Response.json({ error: "Email dan kode harus diisi" }, { status: 400 });
    }

    // Verify the email belongs to this user
    const user = getUserById(payload.userId);
    if (!user) {
      return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    if (user.email !== email && user.backupEmail !== email) {
      return Response.json({ error: "Email tidak valid" }, { status: 400 });
    }

    const result = verifyOTP(email, code);
    if (!result.valid) {
      return Response.json({ error: result.reason }, { status: 401 });
    }

    return Response.json({ message: "Kode verifikasi valid", verified: true });
  } catch {
    return Response.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
