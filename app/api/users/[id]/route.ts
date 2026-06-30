import { NextRequest } from "next/server";
import { getCurrentUser, hashPassword, isAdminEmail } from "@/lib/auth";
import { getUserById, updateUser, deleteUser } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payload = await getCurrentUser();
  if (!payload || !isAdminEmail(payload.email)) {
    return Response.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const user = getUserById(id);
  if (!user) {
    return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
  }

  const { password, ...safe } = user;
  return Response.json({ user: safe });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payload = await getCurrentUser();
  if (!payload || !isAdminEmail(payload.email)) {
    return Response.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (body.name) data.name = body.name;
  if (body.email) data.email = body.email;
  if (body.password) {
    data.password = await hashPassword(body.password);
  }

  // Enforce: only the designated email can be admin
  const targetUser = getUserById(id);
  if (targetUser) {
    data.role = isAdminEmail(targetUser.email) ? "admin" : (body.role || "user");
  }

  const updated = updateUser(id, data);
  if (!updated) {
    return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
  }

  const { password, ...safe } = updated;
  return Response.json({ user: safe, message: "User berhasil diperbarui" });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payload = await getCurrentUser();
  if (!payload || !isAdminEmail(payload.email)) {
    return Response.json({ error: "Akses ditolak" }, { status: 403 });
  }

  if (id === payload.userId) {
    return Response.json({ error: "Tidak bisa menghapus akun sendiri" }, { status: 400 });
  }

  const success = deleteUser(id);
  if (!success) {
    return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
  }

  return Response.json({ message: "User berhasil dihapus" });
}
