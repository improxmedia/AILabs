import { NextRequest, NextResponse } from "next/server";
import { assertModelAccess, getDemoUser } from "@/lib/auth";
import { callImproxModel } from "@/lib/providers";
import { getImproxModel } from "@/lib/models";

export async function POST(req: NextRequest) {
  try {
    const user = getDemoUser(req.headers.get("x-demo-user"));
    const { model, prompt, imageDataUrl } = await req.json();

    const selectedModel = getImproxModel(model);
    if (selectedModel.category !== "image") {
      return NextResponse.json({ ok: false, error: "This route only supports image models." }, { status: 400 });
    }

    assertModelAccess(user, model);

    const result = await callImproxModel({ model, prompt, userId: user.id, imageDataUrl });
    return NextResponse.json({ ok: true, result, usage: { userId: user.id, remainingDemoCredits: user.credits - 10 } });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || "Image request failed." }, { status: 403 });
  }
}
