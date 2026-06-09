import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, RotateCcw, Download } from "lucide-react";
import { useApp } from "@/context/AppState";
import { fmt } from "@/lib/format";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Your orders — Yumly" }] }),
  component: Orders,
});

const STATUS_LABEL: Record<string, string> = {
  placed: "Placed", accepted: "Accepted", preparing: "Preparing",
  pickup: "Pickup assigned", out_for_delivery: "Out for delivery", delivered: "Delivered",
};

function Orders() {
  const { orders, addToCart } = useApp();
  const active = orders.filter((o) => o.status !== "delivered");
  const past = orders.filter((o) => o.status === "delivered");

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="grid h-24 w-24 mx-auto place-items-center rounded-3xl bg-muted"><Package className="h-10 w-10 text-muted-foreground" /></div>
        <h2 className="mt-6 text-2xl font-bold">No orders yet</h2>
        <p className="mt-2 text-muted-foreground">Place your first order and it'll appear here.</p>
        <Link to="/restaurants" className="btn-cta mt-6 inline-flex rounded-xl px-6 py-3 font-semibold">Explore restaurants</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold">Your orders</h1>

      {active.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold mb-3">Active</h2>
          <div className="space-y-3">{active.map((o) => <OrderRow key={o.id} order={o} active />)}</div>
        </section>
      )}
      {past.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold mb-3">Past orders</h2>
          <div className="space-y-3">{past.map((o) => (
            <OrderRow key={o.id} order={o} onReorder={() => o.items.forEach((it) => addToCart(it.food, it.quantity, it.note))} />
          ))}</div>
        </section>
      )}
    </div>
  );
}

function OrderRow({ order, active, onReorder }: { order: ReturnType<typeof useApp>["orders"][number]; active?: boolean; onReorder?: () => void }) {
  return (
    <div className="card-soft p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-muted-foreground">{order.id} · {new Date(order.createdAt).toLocaleString()}</div>
          <h3 className="font-bold mt-0.5">{order.restaurantName}</h3>
          <div className="mt-1 text-sm text-muted-foreground">{order.items.map((i) => `${i.quantity}× ${i.food.name}`).join(", ")}</div>
        </div>
        <div className="text-right">
          <div className={`text-xs font-semibold rounded-full px-2 py-1 ${active ? "bg-cta/15 text-cta" : "bg-success/15 text-success"}`}>{STATUS_LABEL[order.status]}</div>
          <div className="mt-2 font-bold">{fmt(order.total)}</div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        {active ? (
          <Link to="/tracking/$id" params={{ id: order.id }} className="rounded-lg btn-primary px-4 py-2 text-sm font-semibold">Track order</Link>
        ) : (
          <button onClick={onReorder} className="rounded-lg btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold"><RotateCcw className="h-3.5 w-3.5" /> Reorder</button>
        )}
        <button onClick={() => alert("Invoice download — coming soon")} className="rounded-lg border border-border bg-white inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold hover:bg-muted"><Download className="h-3.5 w-3.5" /> Invoice</button>
        {!active && <Link to="/support" search={{ orderId: order.id } as never} className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-muted">Report issue</Link>}
      </div>
    </div>
  );
}
