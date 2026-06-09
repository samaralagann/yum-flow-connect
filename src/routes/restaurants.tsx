import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { restaurants, cuisines } from "@/lib/mock-data";
import { RestaurantCard } from "@/components/RestaurantCard";

export const Route = createFileRoute("/restaurants")({
  head: () => ({
    meta: [
      { title: "Browse restaurants — Yumly" },
      { name: "description", content: "Discover great restaurants near you with ratings, delivery times and offers." },
      { property: "og:title", content: "Browse restaurants — Yumly" },
      { property: "og:description", content: "Discover great restaurants near you." },
    ],
  }),
  component: Restaurants,
});

function Restaurants() {
  const [cuisine, setCuisine] = useState("All");
  const [sort, setSort] = useState<"popular" | "rating" | "fast" | "cheap">("popular");
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    let l = restaurants.filter((r) =>
      (cuisine === "All" || r.cuisines.includes(cuisine)) &&
      (query.trim() === "" || r.name.toLowerCase().includes(query.toLowerCase()))
    );
    if (sort === "rating") l = [...l].sort((a, b) => b.rating - a.rating);
    else if (sort === "fast") l = [...l].sort((a, b) => a.deliveryMin - b.deliveryMin);
    else if (sort === "cheap") l = [...l].sort((a, b) => a.priceLevel - b.priceLevel);
    return l;
  }, [cuisine, sort, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold">Restaurants</h1>
      <p className="text-muted-foreground mt-1">{list.length} places delivering to you</p>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {cuisines.map((c) => (
            <button key={c} onClick={() => setCuisine(c)} className={`rounded-full border px-4 py-2 text-sm font-medium transition ${cuisine === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white hover:border-primary"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" className="rounded-xl border border-input bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
          <div className="relative">
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select value={sort} onChange={(e) => setSort(e.target.value as never)} className="rounded-xl border border-input bg-white pl-9 pr-3 py-2 text-sm outline-none">
              <option value="popular">Popular</option>
              <option value="rating">Top rated</option>
              <option value="fast">Fast delivery</option>
              <option value="cheap">Cheapest</option>
            </select>
          </div>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mt-16 text-center">
          <div className="text-5xl">🍽️</div>
          <h3 className="mt-3 text-lg font-semibold">No restaurants match those filters</h3>
          <p className="text-sm text-muted-foreground">Try a different cuisine or search term</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((r) => <RestaurantCard key={r.id} r={r} />)}
        </div>
      )}
    </div>
  );
}
