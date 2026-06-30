import { getCurrentUser, isAdminEmail } from "@/lib/auth";
import { getUserById } from "@/lib/db";

export async function GET() {
  const payload = await getCurrentUser();
  if (!payload) {
    return Response.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  const user = getUserById(payload.userId);
  if (!user) {
    return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
  }

  // Enforce admin role only for the designated email
  const effectiveRole = isAdminEmail(user.email) ? "admin" : "user";

  return Response.json({
    user: { id: user.id, name: user.name, email: user.email, role: effectiveRole, avatar: user.avatar },
  });
}
