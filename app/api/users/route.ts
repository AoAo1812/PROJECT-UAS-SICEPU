import { NextRequest } from "next/server";
import { getCurrentUser, hashPassword, isAdminEmail } from "@/lib/auth";
import { getUsers, createUser, getUserByEmail } from "@/lib/db";
import { v4 as uuid } from "uuid";

export async function GET() {
  const payload = await getCurrentUser();
  if (!payload || !isAdminEmail(payload.email)) {
    return Response.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const users = getUsers().map(({ password, ...u }) => u);
  return Response.json({ users });
}

export async function POST(request: NextRequest) {
  const payload = await getCurrentUser();
  if (!payload || !isAdminEmail(payload.email)) {
    return Response.json({ error: "Akses ditolak" }, { status: 403 });
  }

  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return Response.json({ error: "Semua field harus diisi" }, { status: 400 });
    }

    const existing = getUserByEmail(email);
    if (existing) {
      return Response.json({ error: "Email sudah terdaftar" }, { status: 409 });
    }

    // Enforce: only the designated email can be admin
    const effectiveRole = isAdminEmail(email) ? "admin" : "user";

    const hashedPassword = await hashPassword(password);
    const user = createUser({
      id: uuid(),
      name,
      email,
      password: hashedPassword,
      role: effectiveRole,
      createdAt: new Date().toISOString(),
    });

    const { password: _, ...safe } = user;
    return Response.json({ user: safe, message: "User berhasil ditambahkan" }, { status: 201 });
  } catch {
    return Response.json({ error: "Gagal menambahkan user" }, { status: 500 });
  }
}
