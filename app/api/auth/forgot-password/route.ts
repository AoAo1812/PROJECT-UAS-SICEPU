import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { getUserByEmail } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "sicepu-secret-key-2026";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: "Email harus diisi" }, { status: 400 });
    }

    // Always return success to prevent email enumeration
    const user = getUserByEmail(email);
    if (!user) {
      return Response.json({
        message: "Jika email terdaftar, instruksi reset password telah dikirim.",
      });
    }

    // Generate a short-lived reset token (15 minutes)
    const resetToken = jwt.sign({ email: user.email, purpose: "reset-password" }, JWT_SECRET, {
      expiresIn: "15m",
    });

    // In production, send email here with the reset link
    // For now, log the token for development purposes
    console.log(`[DEV] Password reset token for ${email}: ${resetToken}`);
    console.log(`[DEV] Reset URL: ${request.nextUrl.origin}/reset-password?token=${resetToken}`);

    return Response.json({
      message: "Jika email terdaftar, instruksi reset password telah dikirim.",
      // Only include token in dev mode for testing
      ...(process.env.NODE_ENV === "development" && { resetToken }),
    });
  } catch {
    return Response.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
