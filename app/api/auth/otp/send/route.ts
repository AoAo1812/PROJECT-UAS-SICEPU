import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUserById, getUserByEmail } from "@/lib/db";
import { generateOTP, storeOTP, canSendOTP } from "@/lib/otp-store";
import { sendOTP } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const payload = await getCurrentUser();
    if (!payload) {
      return Response.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const { email } = await request.json();
    if (!email) {
      return Response.json({ error: "Email harus diisi" }, { status: 400 });
    }

    // Verify the email belongs to this user
    const user = getUserById(payload.userId);
    if (!user) {
      return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    if (user.email !== email && user.backupEmail !== email) {
      return Response.json({ error: "Email tidak valid" }, { status: 400 });
    }

    // Rate limit check
    if (!canSendOTP(email)) {
      return Response.json({ error: "Tunggu 60 detik sebelum minta kode baru" }, { status: 429 });
    }

    // Generate and store OTP
    const code = generateOTP();
    storeOTP(email, code);

    // Send OTP via email
    const sent = await sendOTP(email, code);
    if (!sent) {
      // In dev mode, log the code so it can be tested
      if (process.env.NODE_ENV === "development") {
        console.log(`[DEV] OTP for ${email}: ${code}`);
        return Response.json({
          message: "Kode verifikasi telah dikirim (dev mode: cek console)",
          devCode: code,
        });
      }
      return Response.json({ error: "Gagal mengirim kode verifikasi" }, { status: 500 });
    }

    return Response.json({ message: "Kode verifikasi telah dikirim ke email Anda" });
  } catch {
    return Response.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
