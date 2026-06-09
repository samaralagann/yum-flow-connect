import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/context/AppState";
import { fmt } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your cart — Yumly" }, { name: "description", content: "Review your order before checkout." }] }),
  component: Cart,
});

function Cart() {
  const { cart, updateQty, updateNote, removeFromCart, cartSubtotal } = useApp();
  const [promo, setPromo] = useState("");
  const [appliedPromo, setApplied] = useState<{ code: string; discount: number } | null>(null);

  function apply() {
    const code = promo.trim().toUpperCase();
    if (code === "WELCOME30") setApplied({ code, discount: Math.min(cartSubtotal * 0.3, 15) });
    else if (code === "FREESHIP") setApplied({ code, discount: 2.99 });
    else setApplied(null);
  }

  const deliveryFee = cartSubtotal > 20 ? 0 : 2.99;
  const tax = +(cartSubtotal * 0.08).toFixed(2);
  const discount = appliedPromo?.discount ?? 0;
  const total = Math.max(0, cartSubtotal + deliveryFee + tax - discount);

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="grid h-24 w-24 mx-auto place-items-center rounded-3xl bg-muted">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="mt-6 text-2xl font-bold">Your cart is empty</h2>
        <p className="mt-2 text-muted-foreground">Browse restaurants and add something tasty.</p>
        <Link to="/restaurants" className="btn-cta mt-6 inline-flex rounded-xl px-6 py-3 font-semibold">Explore restaurants</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 lg:grid-cols-[1fr_380px]">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Your cart</h1>
        <div className="mt-6 space-y-4">
          {cart.map((c) => (
            <div key={c.food.id} className="card-soft p-4 flex gap-4">
              <img src={c.food.image} alt={c.food.name} className="h-24 w-24 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{c.food.name}</h3>
                    <p className="text-xs text-muted-foreground">{fmt(c.food.price)} each</p>
                  </div>
                  <button onClick={() => removeFromCart(c.food.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
                <input
                  defaultValue={c.note ?? ""}
                  onBlur={(e) => updateNote(c.food.id, e.target.value)}
                  placeholder="Add a note (e.g. no onions)"
                  className="mt-2 w-full rounded-lg border border-input bg-muted/40 px-3 py-1.5 text-xs outline-none focus:bg-white"
                />
                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center rounded-lg border border-border">
                    <button onClick={() => updateQty(c.food.id, c.quantity - 1)} className="grid h-8 w-8 place-items-center hover:bg-muted"><Minus className="h-3 w-3" /></button>
                    <span className="w-8 text-center text-sm font-semibold">{c.quantity}</span>
                    <button onClick={() => updateQty(c.food.id, c.quantity + 1)} className="grid h-8 w-8 place-items-center hover:bg-muted"><Plus className="h-3 w-3" /></button>
                  </div>
                  <div className="font-bold">{fmt(c.food.price * c.quantity)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start space-y-4">
        <div className="card-soft p-5">
          <h3 className="font-bold">Order summary</h3>
          <div className="mt-4 space-y-2 text-sm">
            <Row label="Subtotal" value={fmt(cartSubtotal)} />
            <Row label="Delivery" value={deliveryFee === 0 ? "Free" : fmt(deliveryFee)} />
            <Row label="Tax" value={fmt(tax)} />
            {appliedPromo && <Row label={`Discount (${appliedPromo.code})`} value={`-${fmt(discount)}`} accent />}
            <div className="my-2 border-t border-border" />
            <Row label="Total" value={fmt(total)} bold />
          </div>
          <Link to="/checkout" className="btn-cta mt-5 block rounded-xl py-3 text-center font-semibold">Proceed to checkout</Link>
        </div>

        <div className="card-soft p-5">
          <div className="flex items-center gap-2 text-sm font-semibold"><Tag className="h-4 w-4 text-primary" /> Promo code</div>
          <div className="mt-3 flex gap-2">
            <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="WELCOME30" className="flex-1 rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
            <button onClick={apply} className="rounded-lg btn-primary px-4 text-sm font-semibold">Apply</button>
          </div>
          {promo && !appliedPromo && <p className="mt-2 text-xs text-destructive">Invalid code. Try WELCOME30 or FREESHIP.</p>}
          {appliedPromo && <p className="mt-2 text-xs text-success">✓ {appliedPromo.code} applied</p>}
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-base font-bold" : "text-muted-foreground"} ${accent ? "text-success font-semibold" : ""}`}>
      <span>{label}</span><span className={bold ? "text-foreground" : ""}>{value}</span>
    </div>
  );
}
