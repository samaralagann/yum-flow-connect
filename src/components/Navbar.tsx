import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ShoppingCart, Bell, Heart, Search, Wallet, ChevronDown, LogOut, User as UserIcon, Package, MapPin, LifeBuoy, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppState";
import { AuthModal } from "./AuthModal";
import { restaurants, foods } from "@/lib/mock-data";
import { fmt } from "@/lib/format";

export function Navbar() {
  const { user, logout, cartCount, walletBalance, notifications, markAllRead } = useApp();
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  const q = search.toLowerCase().trim();
  const sRest = q ? restaurants.filter((r) => r.name.toLowerCase().includes(q) || r.cuisines.join(" ").toLowerCase().includes(q)).slice(0, 4) : [];
  const sFood = q ? foods.filter((f) => f.name.toLowerCase().includes(q)).slice(0, 4) : [];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground font-black">Y</div>
            <span className="text-lg font-extrabold tracking-tight">Yumly</span>
          </Link>

          {/* Search */}
          <div className="relative hidden md:block flex-1 max-w-md">
            <div className="flex items-center gap-2 rounded-xl border border-input bg-muted/60 px-3 py-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-ring/30">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setTimeout(() => setSearchFocus(false), 150)}
                placeholder="Search restaurants or dishes…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <AnimatePresence>
              {searchFocus && q && (sRest.length || sFood.length) > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-popover p-2 shadow-lg border border-border z-50"
                >
                  {sRest.length > 0 && <div className="px-2 py-1 text-[11px] uppercase tracking-wide text-muted-foreground">Restaurants</div>}
                  {sRest.map((r) => (
                    <Link key={r.id} to="/restaurants/$id" params={{ id: r.id }} onClick={() => setSearch("")} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted">
                      <img src={r.image} alt="" className="h-8 w-8 rounded-md object-cover" />
                      <div className="flex-1 text-sm">{r.name}</div>
                      <span className="text-xs text-muted-foreground">⭐ {r.rating}</span>
                    </Link>
                  ))}
                  {sFood.length > 0 && <div className="px-2 py-1 text-[11px] uppercase tracking-wide text-muted-foreground mt-1">Dishes</div>}
                  {sFood.map((f) => (
                    <Link key={f.id} to="/restaurants/$id" params={{ id: f.restaurantId }} onClick={() => setSearch("")} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted">
                      <img src={f.image} alt="" className="h-8 w-8 rounded-md object-cover" />
                      <div className="flex-1 text-sm">{f.name}</div>
                      <span className="text-xs font-medium">{fmt(f.price)}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop nav */}
          <nav className="ml-auto hidden lg:flex items-center gap-1">
            <NavItem to="/" label="Home" />
            <NavItem to="/restaurants" label="Restaurants" />
            <NavItem to="/offers" label="Offers" />
            {user && <NavItem to="/orders" label="Orders" />}
          </nav>

          <div className="ml-auto lg:ml-0 flex items-center gap-1">
            {user ? (
              <>
                <Link to="/favorites" className="hidden sm:grid h-10 w-10 place-items-center rounded-xl hover:bg-muted" aria-label="Favorites">
                  <Heart className="h-5 w-5" />
                </Link>

                <div className="hidden md:flex items-center gap-1.5 rounded-xl bg-accent/40 px-3 py-2 text-xs font-semibold">
                  <Wallet className="h-4 w-4" /> {fmt(walletBalance)}
                </div>

                <div className="relative">
                  <button onClick={() => { setNotifOpen((o) => !o); if (!notifOpen) markAllRead(); }} className="relative grid h-10 w-10 place-items-center rounded-xl hover:bg-muted" aria-label="Notifications">
                    <Bell className="h-5 w-5" />
                    {unread > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />}
                  </button>
                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-border bg-popover p-2 shadow-lg">
                        <div className="px-3 py-2 text-sm font-semibold">Notifications</div>
                        {notifications.length === 0 && <div className="px-3 py-6 text-center text-sm text-muted-foreground">You're all caught up 🎉</div>}
                        {notifications.slice(0, 6).map((n) => (
                          <div key={n.id} className="rounded-lg px-3 py-2 hover:bg-muted">
                            <div className="text-sm font-medium">{n.title}</div>
                            <div className="text-xs text-muted-foreground">{n.body}</div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/cart" className="relative grid h-10 w-10 place-items-center rounded-xl hover:bg-muted" aria-label="Cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-cta px-1 text-[10px] font-bold text-cta-foreground">{cartCount}</span>
                  )}
                </Link>

                <div className="relative">
                  <button onClick={() => setProfileOpen((o) => !o)} className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-muted">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-bold">{user.name[0]}</div>
                    <ChevronDown className="hidden sm:block h-4 w-4" />
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border bg-popover p-2 shadow-lg">
                        <div className="px-3 py-2">
                          <div className="text-sm font-semibold">{user.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                        </div>
                        <div className="h-px bg-border my-1" />
                        <MenuLink to="/profile" icon={<UserIcon className="h-4 w-4" />} label="Profile" onClick={() => setProfileOpen(false)} />
                        <MenuLink to="/orders" icon={<Package className="h-4 w-4" />} label="My Orders" onClick={() => setProfileOpen(false)} />
                        <MenuLink to="/favorites" icon={<Heart className="h-4 w-4" />} label="Favorites" onClick={() => setProfileOpen(false)} />
                        <MenuLink to="/profile" icon={<MapPin className="h-4 w-4" />} label="Addresses" onClick={() => setProfileOpen(false)} />
                        <MenuLink to="/support" icon={<LifeBuoy className="h-4 w-4" />} label="Support" onClick={() => setProfileOpen(false)} />
                        <button onClick={() => { logout(); setProfileOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10">
                          <LogOut className="h-4 w-4" /> Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <button onClick={() => setAuthOpen(true)} className="btn-cta rounded-xl px-5 py-2.5 text-sm font-semibold">
                Login / Signup
              </button>
            )}

            <button onClick={() => setMenuOpen((o) => !o)} className="lg:hidden grid h-10 w-10 place-items-center rounded-xl hover:bg-muted" aria-label="Menu">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="lg:hidden overflow-hidden border-t border-border bg-background">
              <div className="px-4 py-3 space-y-1">
                <MobileLink to="/" label="Home" onClick={() => setMenuOpen(false)} />
                <MobileLink to="/restaurants" label="Restaurants" onClick={() => setMenuOpen(false)} />
                <MobileLink to="/offers" label="Offers" onClick={() => setMenuOpen(false)} />
                {user && <>
                  <MobileLink to="/orders" label="Orders" onClick={() => setMenuOpen(false)} />
                  <MobileLink to="/favorites" label="Favorites" onClick={() => setMenuOpen(false)} />
                  <MobileLink to="/support" label="Support" onClick={() => setMenuOpen(false)} />
                  <MobileLink to="/profile" label="Profile" onClick={() => setMenuOpen(false)} />
                </>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  const loc = useLocation();
  const active = loc.pathname === to || (to !== "/" && loc.pathname.startsWith(to));
  return (
    <Link to={to} className={`rounded-lg px-3 py-2 text-sm font-medium transition ${active ? "text-primary" : "text-foreground hover:bg-muted"}`}>
      {label}
    </Link>
  );
}

function MenuLink({ to, icon, label, onClick }: { to: string; icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted">
      {icon} {label}
    </Link>
  );
}

function MobileLink({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) {
  return (
    <Link to={to} onClick={onClick} className="block rounded-lg px-3 py-2.5 text-base font-medium hover:bg-muted">{label}</Link>
  );
}
