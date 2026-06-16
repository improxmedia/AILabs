"use client";

import { useMemo, useState } from "react";
import { Bot, Clipboard, ImageIcon, LogOut, Send, Sparkles, Video, Wand2 } from "lucide-react";
import { Brand } from "@/components/Brand";
import { PUBLIC_MODELS } from "@/lib/models";

type ApiResult = {
  ok: boolean;
  result?: { type: "text" | "image" | "video"; content: string };
  error?: string;
};

const quickPrompts = [
  "Write 5 premium Instagram ad captions for a luxury brand.",
  "Create a complete campaign idea for a new real estate project.",
  "Make a clean image prompt for a modern social media poster.",
  "Create a 15-second video concept for a product launch reel."
];

const iconMap: Record<string, any> = { chat: Bot, image: ImageIcon, video: Video };

export default function Home() {
  const [selectedModel, setSelectedModel] = useState(PUBLIC_MODELS[0].id);
  const [prompt, setPrompt] = useState("Create a premium social media campaign idea for IMPROX MEDIA.");
  const [userId, setUserId] = useState("enterprise-user");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string>("");
  const [result, setResult] = useState<ApiResult | null>(null);

  const model = useMemo(() => PUBLIC_MODELS.find((m) => m.id === selectedModel), [selectedModel]);

  async function submit() {
    setLoading(true);
    setCopied(false);
    setResult(null);
    try {
      const endpoint = model?.category === "image" ? "/api/image" : model?.category === "video" ? "/api/video" : "/api/chat";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-demo-user": userId },
        body: JSON.stringify({ model: selectedModel, prompt, imageDataUrl })
      });
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({ ok: false, error: err.message || "Request failed" });
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  function handleImageUpload(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  function copyOutput() {
    if (!result?.result?.content) return;
    navigator.clipboard.writeText(result.result.content);
    setCopied(true);
  }

  return (
    <main className="min-h-screen px-4 py-5 md:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl md:p-4">
        <Brand />
        <div className="flex items-center gap-2">
          <a href="/admin" className="hidden rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-300 hover:bg-white/10 md:block">Admin</a>
          <button onClick={logout} className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-300 hover:bg-white/10">
            <span className="hidden md:inline">Logout</span><LogOut className="md:hidden" size={17} />
          </button>
        </div>
      </nav>

      <section className="mx-auto mt-6 grid max-w-7xl gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-4">
          <div className="glass rounded-[1.7rem] p-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200">
              <Sparkles size={15} /> Team workspace active
            </div>
            <h1 className="mt-4 text-3xl font-black leading-tight">What do you want to create today?</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">Choose one tool, write what you need, and click generate. No technical knowledge needed.</p>
          </div>

          <div className="glass rounded-[1.7rem] p-4">
            <div className="mb-3 text-sm font-bold text-slate-300">Choose IMPROX tool</div>
            <div className="grid gap-3">
              {PUBLIC_MODELS.map((m) => {
                const Icon = iconMap[m.category] || Bot;
                const active = selectedModel === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`rounded-2xl border p-4 text-left transition ${active ? "border-cyan-300/60 bg-cyan-300/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-white/10 p-2 text-cyan-200"><Icon size={20} /></div>
                      <div>
                        <div className="font-black">{m.publicName}</div>
                        <div className="text-xs capitalize text-slate-500">{m.category} tool</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass rounded-[1.7rem] p-4">
            <div className="mb-3 text-sm font-bold text-slate-300">Access mode</div>
            <select className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm outline-none" value={userId} onChange={(e) => setUserId(e.target.value)}>
              <option value="enterprise-user">Team Member — all tools</option>
              <option value="creator-user">Creator — text + image</option>
              <option value="admin">Admin — all tools</option>
            </select>
          </div>
        </aside>

        <section className="glass rounded-[2rem] p-4 md:p-6">
          <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm uppercase tracking-[0.22em] text-slate-500">Selected</div>
                <div className="text-2xl font-black">{model?.publicName}</div>
                <p className="mt-1 text-sm text-slate-400">{model?.description}</p>
              </div>
              <div className="rounded-full bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100">Private IMPROX Interface</div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {quickPrompts.map((q) => (
              <button key={q} onClick={() => setPrompt(q)} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left text-sm leading-6 text-slate-300 hover:bg-white/[0.07]">
                <Wand2 className="mb-2 text-yellow-200" size={18} /> {q}
              </button>
            ))}
          </div>

          {model?.category === "image" && (
            <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              <label className="text-sm font-bold text-slate-300">Optional: upload image for editing</label>
              <p className="mt-1 text-xs text-slate-500">Upload a product/photo/poster, then write the edit you want. Leave empty for new image generation.</p>
              <input className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sm" type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
              {imageDataUrl && (
                <div className="mt-3 flex items-center gap-3">
                  <img src={imageDataUrl} alt="Uploaded preview" className="h-20 w-20 rounded-2xl object-cover" />
                  <button onClick={() => setImageDataUrl("")} className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/10">Remove image</button>
                </div>
              )}
            </div>
          )}

          <div className="mt-5">
            <label className="text-sm font-bold text-slate-300">Tell IMPROX AI what you need</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-2 h-48 w-full resize-none rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-base leading-7 outline-none focus:border-cyan-300/50"
              placeholder="Example: Create 10 catchy captions for my new product launch..."
            />
          </div>

          <button onClick={submit} disabled={loading || !prompt.trim()} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 via-violet-500 to-yellow-300 px-5 py-4 text-lg font-black text-slate-950 transition hover:scale-[1.005] disabled:opacity-60">
            <Send size={19} /> {loading ? "Creating..." : "Create Now"}
          </button>

          <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/55 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="text-sm font-black uppercase tracking-[0.22em] text-slate-500">Result</div>
              {result?.ok && <button onClick={copyOutput} className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/10"><Clipboard size={14} /> {copied ? "Copied" : "Copy"}</button>}
            </div>
            {!result && <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-slate-500">Your output will appear here.</div>}
            {result?.ok && result.result?.type === "image" && (result.result.content.startsWith("data:image") || result.result.content.startsWith("http")) && (
              <div className="rounded-2xl bg-white/[0.03] p-3">
                <img src={result.result.content} alt="Generated by IMPROX Vision Studio" className="mx-auto max-h-[520px] rounded-2xl object-contain" />
                <a href={result.result.content} download="improx-vision-output.png" className="mt-3 block rounded-xl border border-white/10 px-3 py-2 text-center text-sm text-slate-300 hover:bg-white/10">Download Image</a>
              </div>
            )}
            {result?.ok && !(result.result?.type === "image" && (result.result.content.startsWith("data:image") || result.result.content.startsWith("http"))) && (
              <pre className="whitespace-pre-wrap break-words rounded-2xl bg-white/[0.03] p-5 font-sans leading-7 text-slate-100">{result.result?.content}</pre>
            )}
            {result && !result.ok && <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-red-100">{result.error}</div>}
          </div>
        </section>
      </section>
    </main>
  );
}
