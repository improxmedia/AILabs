"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Lock, Sparkles } from "lucide-react";

const featureModels = [
  "Vision Studio",
  "FLUX Pro",
  "Kontext Edit",
  "Reel Director",
  "Gemini Pro",
  "Llama AI"
];

const updates = [
  {
    tag: "Image",
    title: "IMPROX FLUX Pro",
    copy: "Premium commercial image generation for ads, posters and brand campaigns."
  },
  {
    tag: "Editing",
    title: "IMPROX Kontext Edit",
    copy: "Upload a product or creative and transform it with production-ready prompt edits."
  },
  {
    tag: "Video",
    title: "IMPROX Reel Director",
    copy: "Short-form scripts, shot lists and reel concepts for production teams."
  }
];

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeModel, setActiveModel] = useState("Vision Studio");

  const activeCopy = useMemo(() => {
    const map: Record<string, string> = {
      "Vision Studio": "Company-grade image generation workspace for daily campaign production.",
      "FLUX Pro": "High-fidelity visuals for social ads, posters, product scenes and thumbnails.",
      "Kontext Edit": "Prompt-based image editing with product consistency and premium finishing.",
      "Reel Director": "Video concepts, camera movement, hooks, scripts and production briefs.",
      "Gemini Pro": "Research, copywriting and strategy support for internal teams.",
      "Llama AI": "Fast drafting and planning assistant for high-volume production tasks."
    };
    return map[activeModel];
  }, [activeModel]);

  async function login() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    setLoading(false);
    if (!data.ok) {
      setError(data.error || "Login failed");
      return;
    }
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-[#050506] text-zinc-50">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 md:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-sm font-black text-black">IM</div>
          <div>
            <div className="text-sm font-semibold tracking-wide">IMPROX AI Labs</div>
            <div className="text-[10px] uppercase tracking-[0.26em] text-zinc-500">Private Intelligence</div>
          </div>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
          <a className="hover:text-white" href="#models">Models</a>
          <a className="hover:text-white" href="#updates">Workflows</a>
          <a className="hover:text-white" href="#login">Team Login</a>
        </nav>
        <div className="rounded-full border border-white/10 px-4 py-2 text-xs text-zinc-400">
          Team access only
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-10 pt-8 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:pt-16">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-400">
            <Sparkles size={14} /> IMPROX MEDIA production AI suite
          </div>
          <h1 className="mt-8 max-w-4xl text-5xl font-semibold tracking-[-0.055em] text-white md:text-7xl lg:text-8xl">
            AI tools for visual production teams.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400">
            A private branded workspace for image generation, prompt-based editing, campaign concepts and video production planning — built for IMPROX MEDIA teams.
          </p>

          <div id="models" className="mt-10 rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-4 md:p-5">
            <div className="flex flex-wrap gap-2">
              {featureModels.map((model) => (
                <button
                  key={model}
                  onClick={() => setActiveModel(model)}
                  className={`rounded-full px-4 py-2 text-sm transition ${activeModel === model ? "bg-white text-black" : "border border-white/[0.08] text-zinc-400 hover:bg-white/[0.06] hover:text-white"}`}
                >
                  {model}
                </button>
              ))}
            </div>
            <div className="mt-8 grid gap-6 rounded-[1.5rem] bg-black/40 p-6 md:grid-cols-[1fr_180px]">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Active Model</div>
                <div className="mt-3 text-3xl font-semibold tracking-tight text-white">IMPROX {activeModel}</div>
                <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400">{activeCopy}</p>
              </div>
              <div className="hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.08] to-transparent p-4 md:block">
                <div className="h-full rounded-2xl border border-white/[0.08] bg-black/40" />
              </div>
            </div>
          </div>
        </div>

        <aside id="login" className="lg:pt-16">
          <div className="rounded-[2rem] border border-white/[0.08] bg-[#111113] p-6 shadow-2xl shadow-black/40 md:p-8">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/[0.08] bg-white text-black">
              <Lock size={20} />
            </div>
            <h2 className="mt-8 text-2xl font-semibold tracking-tight">Team sign in</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Use the private User ID and password issued by IMPROX MEDIA.
            </p>

            <div className="mt-8 space-y-3">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-2xl border border-white/[0.08] bg-black px-4 py-4 text-sm outline-none placeholder:text-zinc-700 focus:border-white/25"
                placeholder="User ID"
                autoFocus
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && login()}
                className="w-full rounded-2xl border border-white/[0.08] bg-black px-4 py-4 text-sm outline-none placeholder:text-zinc-700 focus:border-white/25"
                placeholder="Password"
                type="password"
              />
            </div>

            {error && <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}

            <button
              onClick={login}
              disabled={loading || !username.trim() || !password.trim()}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-60"
            >
              {loading ? "Checking access..." : "Open IMPROX AI"} <ArrowRight size={16} />
            </button>

            <div className="mt-6 rounded-2xl border border-white/[0.08] bg-black/30 p-4 text-xs leading-6 text-zinc-500">
              Approved production users only. Provider details and company infrastructure remain private.
            </div>
          </div>
        </aside>
      </section>

      <section id="updates" className="mx-auto max-w-7xl px-5 pb-12 md:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-zinc-600">Production Workflows</div>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">Latest tools</h3>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {updates.map((item) => (
            <div key={item.title} className="rounded-[1.7rem] border border-white/[0.08] bg-white/[0.03] p-5">
              <div className="text-xs text-zinc-500">{item.tag}</div>
              <div className="mt-4 text-xl font-semibold tracking-tight">{item.title}</div>
              <p className="mt-3 text-sm leading-6 text-zinc-500">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
