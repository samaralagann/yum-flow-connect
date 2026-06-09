import { Link } from "@tanstack/react-router";
import { Star, Clock, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppState";
import type { Restaurant } from "@/lib/mock-data";

export function RestaurantCard({ r }: { r: Restaurant }) {
  const { favRestaurants, toggleFavRestaurant } = useApp();
  const liked = favRestaurants.includes(r.id);
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <Link to="/restaurants/$id" params={{ id: r.id }} className="group block card-soft overflow-hidden">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={r.image} alt={r.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {r.offer && (
            <div className="absolute left-3 top-3 rounded-full bg-cta px-3 py-1 text-xs font-bold text-cta-foreground shadow-md">
              {r.offer}
            </div>
          )}
          <button
            onClick={(e) => { e.preventDefault(); toggleFavRestaurant(r.id); }}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:scale-110 transition"
            aria-label="Favorite"
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-destructive text-destructive" : "text-foreground"}`} />
          </button>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base leading-tight">{r.name}</h3>
            <div className="flex shrink-0 items-center gap-1 rounded-md bg-success/10 px-1.5 py-0.5 text-xs font-bold text-success">
              <Star className="h-3 w-3 fill-current" /> {r.rating}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{r.cuisines.join(" • ")}</p>
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {r.deliveryMin}–{r.deliveryMin + 8} min</span>
            <span>{"$".repeat(r.priceLevel)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
