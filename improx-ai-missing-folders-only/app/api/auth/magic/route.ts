import { NextRequest, NextResponse } from "next/server";
import { validateMagicToken } from "@/lib/magicLinks";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const user = validateMagicToken(token);

  if (!user) {
    return NextResponse.redirect(new URL("/login?error=bad_link", req.url));
  }

  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set("improx_user", user.username, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return res;
}
