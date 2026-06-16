import { NextRequest, NextResponse } from "next/server";
import { demoUsers } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");

  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized admin request." }, { status: 401 });
  }

  return NextResponse.json({ ok: true, users: demoUsers });
}
