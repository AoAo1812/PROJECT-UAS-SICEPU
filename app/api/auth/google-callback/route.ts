import { NextResponse } from "next/server";
import { auth, signIn } from "@/lib/auth-config";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const session = await auth();
  if (session) {
    return NextResponse.redirect(new URL(callbackUrl, request.url));
  }

  return NextResponse.redirect(new URL("/login", request.url));
}
