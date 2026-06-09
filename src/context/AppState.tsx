import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { foods, type FoodItem } from "@/lib/mock-data";

// --- Types ---
export type User = { name: string; email: string; avatar?: string };

export type CartItem = {
  food: FoodItem;
  quantity: number;
  note?: string;
};

export type Address = {
  id: string;
  label: string;
  line1: string;
  city: string;
  isDefault?: boolean;
};

export type OrderStatus = "placed" | "accepted" | "preparing" | "pickup" | "out_for_delivery" | "delivered";

export type Order = {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: number;
  address: string;
  paymentMethod: string;
  restaurantName: string;
  etaMinutes: number;
};

type AppState = {
  // auth
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
  // cart
  cart: CartItem[];
  addToCart: (food: FoodItem, qty?: number, note?: string) => void;
  removeFromCart: (foodId: string) => void;
  updateQty: (foodId: string, qty: number) => void;
  updateNote: (foodId: string, note: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  // favorites
  favRestaurants: string[];
  favFoods: string[];
  toggleFavRestaurant: (id: string) => void;
  toggleFavFood: (id: string) => void;
  // orders
  orders: Order[];
  placeOrder: (o: Omit<Order, "id" | "createdAt" | "status">) => Order;
  advanceOrder: (id: string) => void;
  // addresses
  addresses: Address[];
  addAddress: (a: Omit<Address, "id">) => void;
  setDefaultAddress: (id: string) => void;
  // wallet
  walletBalance: number;
  addFunds: (amount: number) => void;
  // notifications
  notifications: { id: string; title: string; body: string; createdAt: number; read: boolean }[];
  markAllRead: () => void;
};

const Ctx = createContext<AppState | null>(null);

function useLocalState<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [v, setV] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }, [key, v]);
  return [v, setV];
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalState<User | null>("yum_user", null);
  const [cart, setCart] = useLocalState<CartItem[]>("yum_cart", []);
  const [favRestaurants, setFavR] = useLocalState<string[]>("yum_fav_r", []);
  const [favFoods, setFavF] = useLocalState<string[]>("yum_fav_f", []);
  const [orders, setOrders] = useLocalState<Order[]>("yum_orders", []);
  const [addresses, setAddresses] = useLocalState<Address[]>("yum_addr", [
    { id: "a1", label: "Home", line1: "221B Baker Street, Apt 4", city: "London", isDefault: true },
  ]);
  const [walletBalance, setWallet] = useLocalState<number>("yum_wallet", 25);
  const [notifications, setNotifs] = useLocalState<AppState["notifications"]>("yum_notifs", []);

  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);
  const cartSubtotal = cart.reduce((s, c) => s + c.quantity * c.food.price, 0);

  const value: AppState = {
    user,
    login: (u) => { setUser(u); setNotifs((p) => [{ id: crypto.randomUUID(), title: `Welcome, ${u.name}!`, body: "Enjoy 10% off your first order with code WELCOME10", createdAt: Date.now(), read: false }, ...p]); },
    logout: () => setUser(null),

    cart,
    addToCart: (food, qty = 1, note) => {
      setCart((prev) => {
        const idx = prev.findIndex((c) => c.food.id === food.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty, note: note ?? copy[idx].note };
          return copy;
        }
        return [...prev, { food, quantity: qty, note }];
      });
    },
    removeFromCart: (id) => setCart((p) => p.filter((c) => c.food.id !== id)),
    updateQty: (id, qty) => setCart((p) => qty <= 0 ? p.filter((c) => c.food.id !== id) : p.map((c) => c.food.id === id ? { ...c, quantity: qty } : c)),
    updateNote: (id, note) => setCart((p) => p.map((c) => c.food.id === id ? { ...c, note } : c)),
    clearCart: () => setCart([]),
    cartCount,
    cartSubtotal,

    favRestaurants,
    favFoods,
    toggleFavRestaurant: (id) => setFavR((p) => p.includes(id) ? p.filter(x => x !== id) : [...p, id]),
    toggleFavFood: (id) => setFavF((p) => p.includes(id) ? p.filter(x => x !== id) : [...p, id]),

    orders,
    placeOrder: (o) => {
      const order: Order = { ...o, id: "ord_" + Math.random().toString(36).slice(2, 8).toUpperCase(), createdAt: Date.now(), status: "placed" };
      setOrders((p) => [order, ...p]);
      setNotifs((p) => [{ id: crypto.randomUUID(), title: "Order placed!", body: `${order.restaurantName} • ETA ${order.etaMinutes} min`, createdAt: Date.now(), read: false }, ...p]);
      return order;
    },
    advanceOrder: (id) => setOrders((p) => p.map((o) => {
      if (o.id !== id) return o;
      const seq: OrderStatus[] = ["placed", "accepted", "preparing", "pickup", "out_for_delivery", "delivered"];
      const i = seq.indexOf(o.status);
      return { ...o, status: seq[Math.min(i + 1, seq.length - 1)] };
    })),

    addresses,
    addAddress: (a) => setAddresses((p) => [...p, { ...a, id: crypto.randomUUID() }]),
    setDefaultAddress: (id) => setAddresses((p) => p.map((a) => ({ ...a, isDefault: a.id === id }))),

    walletBalance,
    addFunds: (amount) => setWallet((b) => b + amount),

    notifications,
    markAllRead: () => setNotifs((p) => p.map((n) => ({ ...n, read: true }))),
  };

  // auto-advance active orders for demo realism
  useEffect(() => {
    const t = setInterval(() => {
      setOrders((prev) => prev.map((o) => {
        if (o.status === "delivered") return o;
        const elapsed = (Date.now() - o.createdAt) / 1000;
        const seq: OrderStatus[] = ["placed", "accepted", "preparing", "pickup", "out_for_delivery", "delivered"];
        const stepSec = Math.max(8, o.etaMinutes * 60 / (seq.length - 1));
        const newIdx = Math.min(seq.length - 1, Math.floor(elapsed / stepSec));
        const next = seq[newIdx];
        return next !== o.status ? { ...o, status: next } : o;
      }));
    }, 5000);
    return () => clearInterval(t);
  }, [setOrders]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppStateProvider");
  return ctx;
}

// re-export for convenience
export { foods };
