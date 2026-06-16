"use client";

import { useMemo, useState } from "react";
import { Bot, ChevronDown, Clipboard, ImageIcon, Layers, LogOut, Play, Send, Upload, Video, Wand2 } from "lucide-react";
import { Brand } from "@/components/Brand";
import { PUBLIC_MODELS } from "@/lib/models";

type ApiResult = { ok: boolean; result?: { type: "text" | "image" | "video"; content: string }; error?: string };

const quickPrompts = [
  "Create a premium product advertisement for Instagram with cinematic lighting.",
  "Edit this product photo into a clean luxury campaign visual.",
  "Create a 15-second reel concept with shot list and camera movement.",
  "Generate a premium social media campaign concept for a real estate brand."
];

const categoryIcons: Record<string, any> = { chat: Bot, image: ImageIcon, video: Video };
const categories = [
  { id: "image", label: "Image Studio", hint: "Generation + editing" },
  { id: "video", label: "Video Studio", hint: "Reels + production briefs" },
  { id: "chat", label: "AI Agents", hint: "Planning + copy" }
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("image");
  const firstModel = PUBLIC_MODELS.find((m) => m.category === "image")?.id || PUBLIC_MODELS[0].id;
  const [selectedModel, setSelectedModel] = useState(firstModel);
  const [prompt, setPrompt] = useState("A premium luxury perfume advertisement on black marble, gold reflections, cinematic studio lighting, ultra realistic commercial photography");
  const [userId, setUserId] = useState("enterprise-user");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string>("");
  const [result, setResult] = useState<ApiResult | null>(null);

  const categoryModels = useMemo(() => PUBLIC_MODELS.filter((m) => m.category === activeCategory), [activeCategory]);
  const model = useMemo(() => PUBLIC_MODELS.find((m) => m.id === selectedModel) || PUBLIC_MODELS[0], [selectedModel]);

  function selectCategory(category: string) {
    setActiveCategory(category);
    const next = PUBLIC_MODELS.find((m) => m.category === category);
    if (next) setSelectedModel(next.id);
  }

  function handleImageUpload(file?: File) {
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setResult({ ok: false, error: "Image is too large. Please upload an image under 1 MB for the web version." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

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
      const raw = await res.text();
      let data: ApiResult;
      try { data = JSON.parse(raw); }
      catch {
        data = { ok: false, error: raw.startsWith("Request Entity") ? "Uploaded image/request is too large. Please use an image under 1 MB." : raw || "Server returned a non-JSON error." };
      }
      setResult(data);
    } catch (err: any) {
      setResult({ ok: false, error: err.message || "Request failed" });
    } finally { setLoading(false); }
  }

  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); window.location.href = "/login"; }
  function copyOutput() { if (!result?.result?.content) return; navigator.clipboard.writeText(result.result.content); setCopied(true); }

  return (
    <main className="min-h-screen bg-[#09090b]">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/[0.07] bg-[#0c0c0e] p-5 lg:block">
        <Brand />
        <div className="mt-8 space-y-2">
          {categories.map((cat) => {
            const active = activeCategory === cat.id;
            const Icon = categoryIcons[cat.id] || Layers;
            return (
              <button key={cat.id} onClick={() => selectCategory(cat.id)} className={`w-full rounded-2xl px-4 py-3 text-left transition ${active ? "bg-white text-black" : "text-zinc-300 hover:bg-white/[0.06]"}`}>
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <div>
                    <div className="text-sm font-semibold">{cat.label}</div>
                    <div className={`text-xs ${active ? "text-black/60" : "text-zinc-500"}`}>{cat.hint}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
          <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Workspace</div>
          <div className="mt-2 text-sm font-medium text-zinc-200">IMPROX MEDIA Team</div>
          <select className="mt-3 w-full rounded-xl border border-white/[0.08] bg-black px-3 py-2 text-xs text-zinc-300 outline-none" value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="enterprise-user">Team Member</option>
            <option value="creator-user">Creator</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </aside>

      <section className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#09090b]/90 px-5 py-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="lg:hidden"><Brand /></div>
            <div className="hidden lg:block">
              <div className="text-sm text-zinc-500">Private production workspace</div>
              <div className="text-lg font-semibold text-zinc-100">{categories.find((c) => c.id === activeCategory)?.label}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden rounded-full border border-white/[0.08] px-3 py-2 text-xs text-zinc-400 md:block">Secure team access</div>
              <a href="/admin" className="rounded-xl border border-white/[0.08] px-3 py-2 text-sm text-zinc-300 hover:bg-white/[0.06]">Admin</a>
              <button onClick={logout} className="rounded-xl border border-white/[0.08] px-3 py-2 text-sm text-zinc-300 hover:bg-white/[0.06]"><LogOut size={16} /></button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-7 md:px-8">
          <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
            <section className="space-y-5">
              <div className="panel rounded-3xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Model Library</div>
                    <h1 className="mt-2 text-2xl font-semibold text-zinc-50">Choose a production model</h1>
                  </div>
                  <ChevronDown className="text-zinc-500" size={20} />
                </div>
                <div className="mt-5 grid gap-3">
                  {categoryModels.map((m) => {
                    const Icon = categoryIcons[m.category] || Bot;
                    const active = selectedModel === m.id;
                    return (
                      <button key={m.id} onClick={() => setSelectedModel(m.id)} className={`rounded-2xl border p-4 text-left transition ${active ? "border-white/30 bg-white/[0.08]" : "border-white/[0.07] bg-black/20 hover:bg-white/[0.04]"}`}>
                        <div className="flex items-start gap-3">
                          <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-2 text-zinc-200"><Icon size={18} /></div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="font-semibold text-zinc-100">{m.publicName}</div>
                              <span className="rounded-full border border-white/[0.08] px-2 py-1 text-[10px] text-zinc-400">{m.badge}</span>
                            </div>
                            <p className="mt-1 text-xs leading-5 text-zinc-500">{m.description}</p>
                            <div className="mt-2 text-[11px] text-zinc-600">{m.engine}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="panel-soft rounded-3xl p-5">
                <div className="text-sm font-medium text-zinc-200">Production presets</div>
                <div className="mt-3 grid gap-2">
                  {quickPrompts.map((q) => (
                    <button key={q} onClick={() => setPrompt(q)} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3 text-left text-xs leading-5 text-zinc-400 hover:bg-white/[0.05]">
                      <Wand2 className="mb-2 text-zinc-500" size={15} /> {q}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="panel rounded-3xl p-5 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] pb-5">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Active Tool</div>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">{model.publicName}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">{model.description}</p>
                </div>
                <button onClick={submit} disabled={loading || !prompt.trim()} className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-50">
                  {model.category === "video" ? <Play size={16} /> : <Send size={16} />} {loading ? "Creating..." : "Generate"}
                </button>
              </div>

              {model.category === "image" && (
                <div className="mt-5 rounded-3xl border border-dashed border-white/[0.12] bg-black/20 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium text-zinc-200">Image input for editing</div>
                      <p className="mt-1 text-xs text-zinc-500">Upload JPG/PNG under 1 MB. Leave empty for new image generation.</p>
                    </div>
                    <label className="cursor-pointer rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-zinc-300 hover:bg-white/[0.08]">
                      <Upload className="mr-2 inline" size={16} /> Upload image
                      <input className="hidden" type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
                    </label>
                  </div>
                  {imageDataUrl && (
                    <div className="mt-4 flex items-center gap-4">
                      <img src={imageDataUrl} alt="Uploaded preview" className="h-24 w-24 rounded-2xl object-cover" />
                      <button onClick={() => setImageDataUrl("")} className="rounded-xl border border-white/[0.08] px-3 py-2 text-xs text-zinc-400 hover:bg-white/[0.06]">Remove</button>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-5">
                <label className="text-sm font-medium text-zinc-200">Prompt</label>
                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="mt-3 h-52 w-full resize-none rounded-3xl border border-white/[0.08] bg-[#0b0b0d] p-5 text-sm leading-7 text-zinc-100 outline-none placeholder:text-zinc-700 focus:border-white/25" placeholder="Describe the visual, edit, reel or campaign you want to create..." />
              </div>

              <div className="mt-5 rounded-3xl border border-white/[0.07] bg-[#0b0b0d] p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Output</div>
                  {result?.ok && <button onClick={copyOutput} className="flex items-center gap-2 rounded-xl border border-white/[0.08] px-3 py-2 text-xs text-zinc-400 hover:bg-white/[0.06]"><Clipboard size={14} /> {copied ? "Copied" : "Copy"}</button>}
                </div>
                {!result && <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-white/[0.08] text-sm text-zinc-600">Your production output will appear here.</div>}
                {result?.ok && result.result?.type === "image" && (result.result.content.startsWith("data:image") || result.result.content.startsWith("http")) && (
                  <div className="rounded-2xl bg-black p-3">
                    <img src={result.result.content} alt="Generated by IMPROX Vision Studio" className="mx-auto max-h-[620px] rounded-2xl object-contain" />
                    <a href={result.result.content} download="improx-vision-output.png" className="mt-3 block rounded-xl border border-white/[0.08] px-3 py-2 text-center text-sm text-zinc-300 hover:bg-white/[0.06]">Download Image</a>
                  </div>
                )}
                {result?.ok && !(result.result?.type === "image" && (result.result.content.startsWith("data:image") || result.result.content.startsWith("http"))) && (
                  <pre className="whitespace-pre-wrap break-words rounded-2xl bg-white/[0.03] p-5 font-sans text-sm leading-7 text-zinc-200">{result.result?.content}</pre>
                )}
                {result && !result.ok && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm leading-6 text-red-200">{result.error}</div>}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
