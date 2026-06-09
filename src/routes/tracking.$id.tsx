import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2, Circle, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useApp, type OrderStatus } from "@/context/AppState";
import { fmt } from "@/lib/format";

export const Route = createFileRoute("/tracking/$id")({
  head: () => ({ meta: [{ title: "Track your order — Yumly" }] }),
  component: Tracking,
});

const STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  { key: "placed", label: "Order placed", desc: "We received your order" },
  { key: "accepted", label: "Restaurant accepted", desc: "Your food is queued" },
  { key: "preparing", label: "Preparing", desc: "Chefs are cooking" },
  { key: "pickup", label: "Pickup assigned", desc: "Rider on the way to restaurant" },
  { key: "out_for_delivery", label: "Out for delivery", desc: "Almost there!" },
  { key: "delivered", label: "Delivered", desc: "Enjoy your meal 🎉" },
];

function Tracking() {
  const { id } = Route.useParams();
  const { orders } = useApp();
  const order = orders.find((o) => o.id === id);
  if (!order) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h2 className="text-xl font-bold">Order not found</h2>
        <Link to="/orders" className="btn-primary mt-4 inline-flex rounded-xl px-5 py-2.5 font-semibold">View orders</Link>
      </div>
    );
  }

  const currentIdx = STEPS.findIndex((s) => s.key === order.status);
  const minutesLeft = Math.max(0, order.etaMinutes - Math.floor((Date.now() - order.createdAt) / 60000));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/orders" className="text-sm text-muted-foreground hover:text-foreground">← Back to orders</Link>
      <h1 className="mt-3 text-2xl md:text-3xl font-bold">Tracking your order</h1>
      <p className="text-muted-foreground">{order.restaurantName} · {order.id}</p>

      <div className="card-soft mt-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Estimated arrival</div>
            <div className="mt-1 text-3xl font-extrabold text-primary">{minutesLeft} min</div>
          </div>
          <div className="grid h-16 w-16 place-items-center rounded-full bg-accent/40 text-2xl">🛵</div>
        </div>

        {/* Progress bar */}
        <div className="relative mt-6 h-2 rounded-full bg-muted overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${(currentIdx / (STEPS.length - 1)) * 100}%` }} transition={{ duration: 0.6 }} className="h-full rounded-full bg-gradient-to-r from-primary to-cta" />
        </div>

        <ol className="mt-6 space-y-4">
          {STEPS.map((s, i) => {
            const done = i <= currentIdx;
            const current = i === currentIdx && order.status !== "delivered";
            return (
              <li key={s.key} className="flex items-start gap-3">
                {done ? <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" /> : <Circle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <div className={`text-sm font-semibold ${done ? "" : "text-muted-foreground"}`}>{s.label}{current && <span className="ml-2 text-xs text-cta">• In progress</span>}</div>
                  <div className="text-xs text-muted-foreground">{s.desc}</div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="card-soft mt-4 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4 text-primary" /> Delivering to</div>
        <div className="mt-1 text-sm text-muted-foreground">{order.address}</div>
      </div>

      <div className="card-soft mt-4 p-5">
        <h3 className="font-bold">Order summary</h3>
        <ul className="mt-3 space-y-1 text-sm">
          {order.items.map((i) => (
            <li key={i.food.id} className="flex justify-between"><span>{i.quantity}× {i.food.name}</span><span>{fmt(i.food.price * i.quantity)}</span></li>
          ))}
        </ul>
        <div className="mt-3 border-t border-border pt-3 flex justify-between font-bold"><span>Total</span><span>{fmt(order.total)}</span></div>
        <div className="mt-1 text-xs text-muted-foreground">Paid via {order.paymentMethod}</div>
      </div>
    </div>
  );
}
