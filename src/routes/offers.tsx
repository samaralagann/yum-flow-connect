import { createFileRoute, Link } from "@tanstack/react-router";
import { restaurants } from "@/lib/mock-data";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "Offers & deals — Yumly" },
      { name: "description", content: "Exclusive promo codes and restaurant deals updated daily." },
      { property: "og:title", content: "Offers & deals — Yumly" },
      { property: "og:description", content: "Exclusive promo codes and restaurant deals updated daily." },
    ],
  }),
  component: Offers,
});

const PROMOS = [
  { code: "WELCOME30", title: "30% off your first order", desc: "Up to $15 off. New customers only.", color: "from-primary to-primary/60" },
  { code: "FREESHIP", title: "Free delivery, any order", desc: "Save $2.99 on delivery fees.", color: "from-cta to-cta/70" },
  { code: "WEEKEND15", title: "15% off weekends", desc: "Saturday & Sunday — sit back, we deliver.", color: "from-accent to-accent/60" },
];

function Offers() {
  const dealing = restaurants.filter((r) => r.offer);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold">Offers & deals</h1>
      <p className="text-muted-foreground mt-1">Save more on every order.</p>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {PROMOS.map((p) => (
          <div key={p.code} className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${p.color} p-6 text-white shadow-lg`}>
            <div className="text-xs font-semibold opacity-90">PROMO CODE</div>
            <div className="mt-1 text-2xl font-extrabold tracking-wide">{p.code}</div>
            <div className="mt-3 text-lg font-bold leading-tight">{p.title}</div>
            <div className="mt-1 text-sm opacity-90">{p.desc}</div>
            <Link to="/restaurants" className="mt-4 inline-block rounded-xl bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-semibold hover:bg-white/30">Order now</Link>
          </div>
        ))}
      </section>

      <h2 className="mt-12 text-xl font-bold">Deals at restaurants</h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {dealing.map((r) => (
          <Link key={r.id} to="/restaurants/$id" params={{ id: r.id }} className="card-soft overflow-hidden group">
            <div className="aspect-[16/9] overflow-hidden">
              <img src={r.image} alt={r.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-4">
              <div className="inline-block rounded-full bg-cta px-3 py-1 text-xs font-bold text-cta-foreground">{r.offer}</div>
              <h3 className="mt-2 font-bold">{r.name}</h3>
              <p className="text-xs text-muted-foreground">{r.cuisines.join(" • ")}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
