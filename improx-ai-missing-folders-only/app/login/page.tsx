"use client";

import { useState } from "react";
import { Lock, Sparkles } from "lucide-react";
import { Brand } from "@/components/Brand";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-2xl shadow-black/40 backdrop-blur-xl md:grid md:grid-cols-[1.05fr_0.95fr]">
        <section className="p-8 md:p-10">
          <Brand />
          <div className="mt-12 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
            <Lock size={16} /> Private team login only
          </div>
          <h1 className="mt-5 text-4xl font-black leading-tight md:text-5xl">
            Production-ready <span className="gradient-text">IMPROX AI</span>
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            A private company workspace for campaigns, captions, image concepts and AI editing workflows. Built for editors, designers and non-technical team members.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">✓ User ID + password access issued by IMPROX</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">✓ NVIDIA/API keys stay hidden on server</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">✓ Simple tools for daily production work</div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-white/[0.03] p-8 md:border-l md:border-t-0 md:p-10">
          <div className="mx-auto max-w-sm">
            <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-cyan-300 via-violet-500 to-yellow-300 text-slate-950">
              <Sparkles size={30} />
            </div>
            <h2 className="mt-6 text-2xl font-black">Team sign in</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Use the User ID and password issued by IMPROX MEDIA.</p>

            <input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-6 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 outline-none focus:border-cyan-300/50" placeholder="User ID" autoFocus />
            <input value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 outline-none focus:border-cyan-300/50" placeholder="Password" type="password" />

            {error && <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-100">{error}</div>}

            <button onClick={login} disabled={loading || !username.trim() || !password.trim()} className="mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-300 via-violet-500 to-yellow-300 px-5 py-4 font-black text-slate-950 disabled:opacity-60">
              {loading ? "Checking..." : "Open IMPROX AI"}
            </button>

            <p className="mt-5 text-xs leading-5 text-slate-500">Demo users are in TEAM_USERS. Change all passwords before sharing the live URL.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
