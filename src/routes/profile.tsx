import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Plus, Wallet } from "lucide-react";
import { useApp } from "@/context/AppState";
import { fmt } from "@/lib/format";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Yumly" }] }),
  component: Profile,
});

function Profile() {
  const { user, logout, addresses, addAddress, setDefaultAddress, walletBalance, addFunds, orders } = useApp();
  const [addr, setAddr] = useState({ label: "", line1: "", city: "" });

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h2 className="text-xl font-bold">Please sign in</h2>
        <p className="mt-2 text-sm text-muted-foreground">Use the Login button in the top bar.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="card-soft p-6 flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground text-2xl font-extrabold">{user.name[0]}</div>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <p className="text-xs text-muted-foreground mt-1">{orders.length} orders placed</p>
        </div>
        <button onClick={logout} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">Sign out</button>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="card-soft p-6">
          <div className="flex items-center gap-2 font-bold"><Wallet className="h-4 w-4 text-primary" /> Wallet</div>
          <div className="mt-3 text-3xl font-extrabold">{fmt(walletBalance)}</div>
          <div className="mt-4 flex gap-2 flex-wrap">
            {[10, 25, 50].map((v) => (
              <button key={v} onClick={() => addFunds(v)} className="rounded-lg btn-primary px-4 py-2 text-sm font-semibold">+ {fmt(v)}</button>
            ))}
          </div>
        </section>

        <section className="card-soft p-6">
          <div className="flex items-center gap-2 font-bold"><MapPin className="h-4 w-4 text-primary" /> Addresses</div>
          <div className="mt-3 space-y-2">
            {addresses.map((a) => (
              <label key={a.id} className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer ${a.isDefault ? "border-primary bg-primary/5" : "border-border"}`}>
                <input type="radio" checked={!!a.isDefault} onChange={() => setDefaultAddress(a.id)} className="accent-primary" />
                <div className="flex-1 text-sm">
                  <div className="font-semibold">{a.label}</div>
                  <div className="text-xs text-muted-foreground">{a.line1}, {a.city}</div>
                </div>
              </label>
            ))}
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <input placeholder="Label" value={addr.label} onChange={(e) => setAddr({ ...addr, label: e.target.value })} className="rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none" />
            <input placeholder="Street" value={addr.line1} onChange={(e) => setAddr({ ...addr, line1: e.target.value })} className="rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none" />
            <input placeholder="City" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} className="rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none" />
          </div>
          <button onClick={() => { if (addr.line1 && addr.city) { addAddress({ ...addr, label: addr.label || "Home" }); setAddr({ label: "", line1: "", city: "" }); } }} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"><Plus className="h-4 w-4" /> Add address</button>
        </section>
      </div>
    </div>
  );
}
