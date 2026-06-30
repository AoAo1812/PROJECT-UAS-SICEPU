import { NextRequest } from "next/server";
import { verifyPassword, generateToken, isAdminEmail } from "@/lib/auth";
import { getUserByEmail } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: "Email dan password harus diisi" }, { status: 400 });
    }

    const user = getUserByEmail(email);
    if (!user) {
      return Response.json({ error: "Email atau password salah" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return Response.json({ error: "Email atau password salah" }, { status: 401 });
    }

    // Enforce admin role only for the designated email
    const effectiveRole = isAdminEmail(user.email) ? "admin" : "user";

    const token = generateToken({ userId: user.id, email: user.email, role: effectiveRole });

    const response = Response.json({
      user: { id: user.id, name: user.name, email: user.email, role: effectiveRole, avatar: user.avatar },
      message: "Login berhasil",
    });

    response.headers.set(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
    );

    return response;
  } catch {
    return Response.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
