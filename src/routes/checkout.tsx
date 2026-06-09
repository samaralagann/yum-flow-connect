import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Wallet, Banknote, MapPin, Plus } from "lucide-react";
import { useApp } from "@/context/AppState";
import { fmt } from "@/lib/format";
import { getRestaurant } from "@/lib/mock-data";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Yumly" }] }),
  component: Checkout,
});

function Checkout() {
  const { cart, cartSubtotal, clearCart, addresses, addAddress, setDefaultAddress, walletBalance, placeOrder, user } = useApp();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<"card" | "cod" | "wallet">("card");
  const [showAdd, setShowAdd] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: "", line1: "", city: "" });

  const deliveryFee = cartSubtotal > 20 ? 0 : 2.99;
  const tax = +(cartSubtotal * 0.08).toFixed(2);
  const total = cartSubtotal + deliveryFee + tax;
  const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0];

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <Link to="/restaurants" className="btn-cta mt-6 inline-flex rounded-xl px-6 py-3 font-semibold">Browse restaurants</Link>
      </div>
    );
  }

  function submit() {
    if (!user) { alert("Please sign in to place your order"); return; }
    if (!defaultAddr) { alert("Add a delivery address"); return; }
    if (payment === "wallet" && walletBalance < total) { alert("Insufficient wallet balance"); return; }
    const restName = getRestaurant(cart[0].food.restaurantId)?.name ?? "Restaurant";
    const order = placeOrder({
      items: cart,
      subtotal: cartSubtotal,
      deliveryFee,
      tax,
      discount: 0,
      total,
      address: `${defaultAddr.line1}, ${defaultAddr.city}`,
      paymentMethod: payment === "card" ? "Credit card" : payment === "cod" ? "Cash on delivery" : "Wallet",
      restaurantName: restName,
      etaMinutes: 28,
    });
    clearCart();
    navigate({ to: "/tracking/$id", params: { id: order.id } });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold">Checkout</h1>

        {/* Address */}
        <section className="card-soft p-5">
          <h2 className="font-bold flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Delivery address</h2>
          <div className="mt-4 space-y-2">
            {addresses.map((a) => (
              <label key={a.id} className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition ${a.isDefault ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}>
                <input type="radio" checked={!!a.isDefault} onChange={() => setDefaultAddress(a.id)} className="mt-1 accent-primary" />
                <div className="flex-1">
                  <div className="text-sm font-semibold">{a.label}</div>
                  <div className="text-xs text-muted-foreground">{a.line1}, {a.city}</div>
                </div>
              </label>
            ))}
          </div>
          {!showAdd ? (
            <button onClick={() => setShowAdd(true)} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><Plus className="h-4 w-4" /> Add new address</button>
          ) : (
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <input placeholder="Label" value={newAddr.label} onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })} className="rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none" />
              <input placeholder="Street" value={newAddr.line1} onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })} className="rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none" />
              <input placeholder="City" value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} className="rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none" />
              <button onClick={() => { if (newAddr.line1 && newAddr.city) { addAddress({ ...newAddr, label: newAddr.label || "Home" }); setNewAddr({ label: "", line1: "", city: "" }); setShowAdd(false); } }} className="sm:col-span-3 rounded-lg btn-primary py-2 text-sm font-semibold">Save address</button>
            </div>
          )}
        </section>

        {/* Payment */}
        <section className="card-soft p-5">
          <h2 className="font-bold">Payment method</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <PayOption active={payment === "card"} onClick={() => setPayment("card")} icon={<CreditCard className="h-5 w-5" />} label="Card" sub="•••• 4242" />
            <PayOption active={payment === "wallet"} onClick={() => setPayment("wallet")} icon={<Wallet className="h-5 w-5" />} label="Wallet" sub={fmt(walletBalance)} />
            <PayOption active={payment === "cod"} onClick={() => setPayment("cod")} icon={<Banknote className="h-5 w-5" />} label="Cash" sub="On delivery" />
          </div>
        </section>

        {/* Items */}
        <section className="card-soft p-5">
          <h2 className="font-bold">Your order ({cart.length} items)</h2>
          <ul className="mt-3 divide-y divide-border">
            {cart.map((c) => (
              <li key={c.food.id} className="flex justify-between py-2 text-sm">
                <span>{c.quantity}× {c.food.name}</span>
                <span className="font-semibold">{fmt(c.food.price * c.quantity)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start space-y-4">
        <div className="card-soft p-5">
          <h3 className="font-bold">Summary</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{fmt(cartSubtotal)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Delivery</span><span>{deliveryFee === 0 ? "Free" : fmt(deliveryFee)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Tax</span><span>{fmt(tax)}</span></div>
            <div className="my-2 border-t border-border" />
            <div className="flex justify-between text-base font-bold"><span>Total</span><span>{fmt(total)}</span></div>
            <div className="text-xs text-muted-foreground">Estimated delivery in 25–35 min</div>
          </div>
          <button onClick={submit} className="btn-cta mt-5 w-full rounded-xl py-3 font-semibold">Place order · {fmt(total)}</button>
          {!user && <p className="mt-2 text-center text-xs text-destructive">Sign in to complete your order</p>}
        </div>
      </aside>
    </div>
  );
}

function PayOption({ active, onClick, icon, label, sub }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; sub: string }) {
  return (
    <button onClick={onClick} className={`rounded-xl border p-3 text-left transition ${active ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}>
      <div className="flex items-center gap-2 text-sm font-semibold">{icon} {label}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>
    </button>
  );
}
