import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { updateUser, getUserById } from "@/lib/db";

export async function PUT(request: NextRequest) {
  const payload = await getCurrentUser();
  if (!payload) {
    return Response.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  const { name, email, avatar } = await request.json();
  if (!name || !email) {
    return Response.json({ error: "Field harus diisi" }, { status: 400 });
  }

  const updateData: Record<string, string> = { name, email };
  if (avatar) updateData.avatar = avatar;

  const updated = updateUser(payload.userId, updateData);
  if (!updated) {
    return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
  }

  const { password, ...safe } = updated;
  return Response.json({ user: safe, message: "Profil berhasil diperbarui" });
}
