import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LifeBuoy } from "lucide-react";
import { useApp } from "@/context/AppState";

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: "Support — Yumly" }] }),
  component: Support,
});

const ISSUES = ["Late delivery", "Missing items", "Wrong order", "Food quality issue", "Other"];

function Support() {
  const { orders } = useApp();
  const completed = useMemo(() => orders.filter((o) => o.status === "delivered"), [orders]);
  const [tickets, setTickets] = useState<{ id: string; orderId: string; issue: string; note: string; status: "open" | "in_review"; createdAt: number }[]>([]);
  const [form, setForm] = useState({ orderId: completed[0]?.id ?? "", issue: ISSUES[0], note: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.orderId) return;
    setTickets((p) => [{ id: "TCK-" + Math.random().toString(36).slice(2, 7).toUpperCase(), createdAt: Date.now(), status: "open", ...form }, ...p]);
    setForm({ ...form, note: "" });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/40"><LifeBuoy className="h-6 w-6" /></div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Support & complaints</h1>
          <p className="text-sm text-muted-foreground">Report issues with delivered orders. We're on it.</p>
        </div>
      </div>

      <form onSubmit={submit} className="card-soft mt-8 p-6 space-y-4">
        <div>
          <label className="text-sm font-semibold">Order</label>
          {completed.length === 0 ? (
            <p className="mt-1 text-sm text-muted-foreground">No completed orders to report yet.</p>
          ) : (
            <select value={form.orderId} onChange={(e) => setForm({ ...form, orderId: e.target.value })} className="mt-1.5 w-full rounded-xl border border-input bg-white px-3 py-2.5 text-sm outline-none">
              {completed.map((o) => <option key={o.id} value={o.id}>{o.id} · {o.restaurantName}</option>)}
            </select>
          )}
        </div>
        <div>
          <label className="text-sm font-semibold">Issue type</label>
          <select value={form.issue} onChange={(e) => setForm({ ...form, issue: e.target.value })} className="mt-1.5 w-full rounded-xl border border-input bg-white px-3 py-2.5 text-sm outline-none">
            {ISSUES.map((i) => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold">Tell us more</label>
          <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows={4} placeholder="Add details, optionally attach photos." className="mt-1.5 w-full rounded-xl border border-input bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
        </div>
        <button type="submit" disabled={completed.length === 0} className="btn-cta rounded-xl px-6 py-3 font-semibold disabled:opacity-50">Submit ticket</button>
      </form>

      {tickets.length > 0 && (
        <section className="mt-10">
          <h2 className="font-bold mb-3">Your tickets</h2>
          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="card-soft p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">{t.id} · {new Date(t.createdAt).toLocaleString()}</div>
                    <div className="mt-0.5 font-semibold">{t.issue}</div>
                    <div className="text-xs text-muted-foreground">Order {t.orderId}</div>
                  </div>
                  <div className="rounded-full bg-cta/15 px-2 py-1 text-xs font-semibold text-cta">Open</div>
                </div>
                {t.note && <p className="mt-2 text-sm text-muted-foreground">{t.note}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
