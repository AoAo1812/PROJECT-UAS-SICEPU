import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { hashPassword } from "@/lib/auth";
import { updateUserPassword } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "sicepu-secret-key-2026";

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return Response.json({ error: "Token dan password baru harus diisi" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return Response.json({ error: "Password minimal 6 karakter" }, { status: 400 });
    }

    // Verify the reset token
    let payload: { email: string; purpose: string };
    try {
      payload = jwt.verify(token, JWT_SECRET) as { email: string; purpose: string };
    } catch {
      return Response.json({ error: "Token tidak valid atau sudah kedaluwarsa" }, { status: 400 });
    }

    if (payload.purpose !== "reset-password") {
      return Response.json({ error: "Token tidak valid" }, { status: 400 });
    }

    // Hash the new password and update
    const hashedPassword = await hashPassword(newPassword);
    const updated = updateUserPassword(payload.email, hashedPassword);

    if (!updated) {
      return Response.json({ error: "User tidak ditemukan" }, { status: 400 });
    }

    return Response.json({ message: "Password berhasil diubah" });
  } catch {
    return Response.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
