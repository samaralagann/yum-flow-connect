import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useApp } from "@/context/AppState";
import { restaurants, foods } from "@/lib/mock-data";
import { RestaurantCard } from "@/components/RestaurantCard";
import { FoodCard } from "@/components/FoodCard";

export const Route = createFileRoute("/favorites")({
  head: () => ({ meta: [{ title: "Favorites — Yumly" }] }),
  component: Favorites,
});

function Favorites() {
  const { favRestaurants, favFoods } = useApp();
  const rs = restaurants.filter((r) => favRestaurants.includes(r.id));
  const fs = foods.filter((f) => favFoods.includes(f.id));

  if (rs.length === 0 && fs.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="grid h-24 w-24 mx-auto place-items-center rounded-3xl bg-muted"><Heart className="h-10 w-10 text-muted-foreground" /></div>
        <h2 className="mt-6 text-2xl font-bold">No favorites yet</h2>
        <p className="mt-2 text-muted-foreground">Tap the heart on any restaurant or dish to save it.</p>
        <Link to="/restaurants" className="btn-cta mt-6 inline-flex rounded-xl px-6 py-3 font-semibold">Explore restaurants</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold">Favorites</h1>
      {rs.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold mb-4">Saved restaurants</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{rs.map((r) => <RestaurantCard key={r.id} r={r} />)}</div>
        </section>
      )}
      {fs.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold mb-4">Saved dishes</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{fs.map((f) => <FoodCard key={f.id} f={f} />)}</div>
        </section>
      )}
    </div>
  );
}
