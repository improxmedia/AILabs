import { NextRequest, NextResponse } from "next/server";
import { assertModelAccess, getDemoUser } from "@/lib/auth";
import { callImproxModel } from "@/lib/providers";

export async function POST(req: NextRequest) {
  try {
    const user = getDemoUser(req.headers.get("x-demo-user"));
    const { model, prompt } = await req.json();

    if (model !== "improx-video-studio") {
      return NextResponse.json({ ok: false, error: "Use video route only for IMPROX Video Studio." }, { status: 400 });
    }

    assertModelAccess(user, model);

    const result = await callImproxModel({ model, prompt, userId: user.id });
    return NextResponse.json({ ok: true, result, usage: { userId: user.id, remainingDemoCredits: user.credits - 100 } });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || "Video request failed." }, { status: 403 });
  }
}
