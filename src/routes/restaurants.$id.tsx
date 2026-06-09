import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock, Heart, Star } from "lucide-react";
import { getRestaurant, getFoodsByRestaurant } from "@/lib/mock-data";
import { FoodCard } from "@/components/FoodCard";
import { useApp } from "@/context/AppState";

export const Route = createFileRoute("/restaurants/$id")({
  loader: ({ params }) => {
    const r = getRestaurant(params.id);
    if (!r) throw notFound();
    return { restaurant: r };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.restaurant.name} — Yumly` },
      { name: "description", content: `Order from ${loaderData.restaurant.name}. ${loaderData.restaurant.tagline}` },
      { property: "og:title", content: `${loaderData.restaurant.name} — Yumly` },
      { property: "og:description", content: loaderData.restaurant.tagline },
      { property: "og:image", content: loaderData.restaurant.image },
      { property: "og:type", content: "restaurant.restaurant" },
    ] : [],
  }),
  component: RestaurantDetail,
  notFoundComponent: () => <div className="p-10 text-center">Restaurant not found</div>,
  errorComponent: () => <div className="p-10 text-center">Something went wrong</div>,
});

function RestaurantDetail() {
  const { restaurant } = Route.useLoaderData();
  const items = getFoodsByRestaurant(restaurant.id);
  const { favRestaurants, toggleFavRestaurant } = useApp();
  const liked = favRestaurants.includes(restaurant.id);

  return (
    <div>
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <Link to="/restaurants" className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur shadow"><ArrowLeft className="h-5 w-5" /></Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 -mt-16 relative">
        <div className="card-soft p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{restaurant.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">{restaurant.tagline}</p>
              <p className="text-xs text-muted-foreground mt-1">{restaurant.cuisines.join(" • ")}</p>
            </div>
            <button onClick={() => toggleFavRestaurant(restaurant.id)} className="grid h-11 w-11 place-items-center rounded-full border border-border hover:bg-muted">
              <Heart className={`h-5 w-5 ${liked ? "fill-destructive text-destructive" : ""}`} />
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1 rounded-md bg-success/10 px-2 py-1 font-semibold text-success"><Star className="h-3.5 w-3.5 fill-current" /> {restaurant.rating}</span>
            <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-4 w-4" /> {restaurant.deliveryMin}–{restaurant.deliveryMin + 8} min</span>
            <span className="text-muted-foreground">{"$".repeat(restaurant.priceLevel)} · Free delivery over $20</span>
          </div>
          {restaurant.offer && <div className="mt-4 rounded-xl bg-accent/30 border border-accent/40 px-4 py-2 text-sm font-medium">🎉 {restaurant.offer}</div>}
        </div>

        <h2 className="mt-10 mb-4 text-xl font-bold">Menu</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((f) => <FoodCard key={f.id} f={f} />)}
        </div>
      </div>
    </div>
  );
}
