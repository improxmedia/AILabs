import { NextRequest, NextResponse } from "next/server";
import { validateTeamUser } from "@/lib/teamUsers";

export async function POST(req: NextRequest) {
  const { username, password, code } = await req.json();

  // Backward compatibility with old single team code login.
  if (code) {
    const expected = process.env.TEAM_ACCESS_CODE || "IMPROX-TEAM-2026";
    if (code !== expected) return NextResponse.json({ ok: false, error: "Wrong team access code." }, { status: 401 });
    const res = NextResponse.json({ ok: true, username: "team" });
    res.cookies.set("improx_user", "team", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 12 });
    return res;
  }

  const user = validateTeamUser(username, password);
  if (!user) return NextResponse.json({ ok: false, error: "Wrong user ID or password." }, { status: 401 });

  const res = NextResponse.json({ ok: true, username: user.username, role: user.role, displayName: user.displayName });
  res.cookies.set("improx_user", user.username, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });
  return res;
}
