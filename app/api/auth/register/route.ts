import { NextRequest } from "next/server";
import { hashPassword, generateToken, isAdminEmail } from "@/lib/auth";
import { createUser, getUserByEmail } from "@/lib/db";
import { v4 as uuid } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, backupEmail } = await request.json();

    if (!name || !email || !password || !backupEmail) {
      return Response.json({ error: "Semua field harus diisi" }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json({ error: "Password minimal 6 karakter" }, { status: 400 });
    }

    if (email.toLowerCase() === backupEmail.toLowerCase()) {
      return Response.json({ error: "Email backup harus berbeda dari email utama" }, { status: 400 });
    }

    const existing = getUserByEmail(email);
    if (existing) {
      return Response.json({ error: "Email sudah terdaftar" }, { status: 409 });
    }

    const existingBackup = getUserByEmail(backupEmail);
    if (existingBackup) {
      return Response.json({ error: "Email backup sudah terdaftar" }, { status: 409 });
    }

    // Enforce role: only the designated email gets admin
    const role = isAdminEmail(email) ? "admin" : "user";

    const hashedPassword = await hashPassword(password);
    const user = createUser({
      id: uuid(),
      name,
      email,
      password: hashedPassword,
      role,
      backupEmail,
      createdAt: new Date().toISOString(),
    });

    const token = generateToken({ userId: user.id, email: user.email, role });

    const response = Response.json({
      user: { id: user.id, name: user.name, email: user.email, role },
      message: "Registrasi berhasil",
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
