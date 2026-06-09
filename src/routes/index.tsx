import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Clock, ShieldCheck, Sparkles, Star } from "lucide-react";
import heroImg from "@/assets/hero-food.jpg";
import { restaurants, cuisines } from "@/lib/mock-data";
import { RestaurantCard } from "@/components/RestaurantCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yumly — Food delivery, fast & fresh" },
      { name: "description", content: "Order from local restaurants and get hot meals delivered in 20 minutes. Browse 1000+ menus, exclusive offers and zero-fee delivery." },
      { property: "og:title", content: "Yumly — Food delivery, fast & fresh" },
      { property: "og:description", content: "Order from local restaurants and get hot meals delivered in 20 minutes." },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Yumly",
        "description": "Online food delivery platform",
      }),
    }],
  }),
  component: Landing,
});

function Landing() {
  const featured = restaurants.filter((r) => r.featured);
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 md:py-20 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/40 px-3 py-1 text-xs font-semibold text-accent-foreground">
              <Sparkles className="h-3.5 w-3.5" /> New restaurants weekly
            </div>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              Crave it.<br />
              <span className="text-primary">Tap it.</span> Eat it.
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground md:text-lg">
              Hot meals from your favorite local spots, delivered in as little as 20 minutes. Discover, order, and track — all in one place.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/restaurants" className="btn-cta inline-flex items-center gap-2 rounded-xl px-6 py-3 text-base font-semibold">
                Order now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/offers" className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-6 py-3 text-base font-semibold hover:bg-muted transition">
                See offers
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-5 text-sm">
              <Stat icon={<Clock className="h-4 w-4" />} label="~22 min avg delivery" />
              <Stat icon={<Star className="h-4 w-4" />} label="4.8 rating across 12k orders" />
              <Stat icon={<ShieldCheck className="h-4 w-4" />} label="Contactless & secure" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary/30 to-accent/40 blur-3xl opacity-60" />
            <div className="overflow-hidden rounded-[2rem] shadow-2xl">
              <img src={heroImg} alt="Variety of dishes" width={1600} height={1200} className="h-full w-full object-cover" />
            </div>
            <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="absolute -left-4 bottom-6 glass rounded-2xl p-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-success text-success-foreground">✓</div>
                <div>
                  <div className="text-xs text-muted-foreground">Order delivered</div>
                  <div className="text-sm font-semibold">in 19 minutes</div>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="absolute -right-2 top-6 glass rounded-2xl p-3 shadow-lg">
              <div className="text-xs text-muted-foreground">Today's pick</div>
              <div className="text-sm font-semibold">Sakura Sushi · ⭐ 4.9</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Cuisine pills */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {cuisines.map((c) => (
            <Link key={c} to="/restaurants" search={{ cuisine: c } as never} className="shrink-0 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary transition">
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Featured restaurants</h2>
            <p className="text-sm text-muted-foreground mt-1">Trending in your area right now</p>
          </div>
          <Link to="/restaurants" className="text-sm font-semibold text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((r) => <RestaurantCard key={r.id} r={r} />)}
        </div>
      </section>

      {/* Popular near you */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Popular near you</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {restaurants.slice(0, 8).map((r) => <RestaurantCard key={r.id} r={r} />)}
        </div>
      </section>

      {/* CTA banner */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/70 p-8 md:p-12 text-primary-foreground">
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative max-w-xl">
            <div className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">Limited time</div>
            <h3 className="mt-3 text-3xl md:text-4xl font-extrabold">Get 30% off your first order</h3>
            <p className="mt-2 opacity-90">Use code <span className="font-bold rounded-md bg-white/20 px-2 py-0.5">WELCOME30</span> at checkout.</p>
            <Link to="/restaurants" className="btn-cta mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-base font-semibold">
              Start ordering <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-primary">{icon}</span>
      {label}
    </div>
  );
}
