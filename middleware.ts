import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/api/auth/login", "/api/auth/magic"];

function parseUsers(raw: string) {
  return raw
    .split(",")
    .map((entry) => entry.trim().split(":")[0])
    .filter(Boolean);
}

function parseMagicUsers(raw: string) {
  return raw
    .split(",")
    .map((entry) => entry.trim().split(":")[1])
    .filter(Boolean);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    PUBLIC_PATHS.includes(pathname)
  ) {
    return NextResponse.next();
  }

  const username = req.cookies.get("improx_user")?.value;
  const users = parseUsers(process.env.TEAM_USERS || "admin:ChangeMe123:admin:IMPROX Admin,team:Team123:enterprise:IMPROX Team");
  const magicUsers = parseMagicUsers(process.env.TEAM_MAGIC_LINKS || "");

  if (!username || (!users.includes(username) && !magicUsers.includes(username))) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const res = NextResponse.next();
  res.headers.set("x-improx-user", username);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
