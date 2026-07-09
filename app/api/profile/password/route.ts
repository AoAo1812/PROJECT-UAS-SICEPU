import { NextRequest } from "next/server";
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";
import { updateUser, getUserById } from "@/lib/db";
import { verifyOTP } from "@/lib/otp-store";

export async function PUT(request: NextRequest) {
  const payload = await getCurrentUser();
  if (!payload) {
    return Response.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  const { currentPassword, newPassword, otpCode, otpEmail } = await request.json();
  if (!currentPassword || !newPassword || !otpCode || !otpEmail) {
    return Response.json({ error: "Semua field harus diisi" }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return Response.json({ error: "Password baru minimal 6 karakter" }, { status: 400 });
  }

  const user = getUserById(payload.userId);
  if (!user) {
    return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
  }

  // Verify OTP first
  const otpResult = verifyOTP(otpEmail, otpCode);
  if (!otpResult.valid) {
    return Response.json({ error: otpResult.reason }, { status: 401 });
  }

  // Then verify current password
  const valid = await verifyPassword(currentPassword, user.password);
  if (!valid) {
    return Response.json({ error: "Password lama salah" }, { status: 401 });
  }

  const hashed = await hashPassword(newPassword);
  updateUser(payload.userId, { password: hashed });

  return Response.json({ message: "Password berhasil diubah" });
}
