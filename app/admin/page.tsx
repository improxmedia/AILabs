import { Brand } from "@/components/Brand";
import { demoUsers } from "@/lib/auth";

export default function AdminPage() {
  return (
    <main className="min-h-screen px-5 py-7 md:px-10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Brand />
        <a href="/" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/10">Back to Playground</a>
      </nav>

      <section className="mx-auto mt-12 max-w-6xl">
        <h1 className="text-4xl font-black">Admin Access Control</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Demo admin panel. In production, connect this page to a real database and authentication provider.
        </p>

        <div className="glass mt-8 overflow-hidden rounded-3xl">
          <table className="w-full min-w-[720px] text-left">
            <thead className="bg-white/5 text-sm uppercase tracking-wider text-slate-400">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Credits</th>
                <th className="p-4">Allowed Models</th>
              </tr>
            </thead>
            <tbody>
              {demoUsers.map((user) => (
                <tr key={user.id} className="border-t border-white/10">
                  <td className="p-4 font-semibold">{user.name}<div className="text-xs text-slate-500">{user.id}</div></td>
                  <td className="p-4 capitalize text-cyan-100">{user.role}</td>
                  <td className="p-4">{user.credits.toLocaleString()}</td>
                  <td className="p-4 text-sm text-slate-300">{user.modelsAllowed === "all" ? "All IMPROX models" : user.modelsAllowed.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
