import { Plus, Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppState";
import { fmt } from "@/lib/format";
import type { FoodItem } from "@/lib/mock-data";

export function FoodCard({ f }: { f: FoodItem }) {
  const { addToCart, favFoods, toggleFavFood } = useApp();
  const liked = favFoods.includes(f.id);
  return (
    <div className="card-soft flex gap-4 p-4">
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl">
        <img src={f.image} alt={f.name} loading="lazy" className="h-full w-full object-cover" />
        <span className={`absolute left-2 top-2 grid h-4 w-4 place-items-center rounded-sm border-2 ${f.veg ? "border-success" : "border-destructive"} bg-white`}>
          <span className={`h-1.5 w-1.5 rounded-full ${f.veg ? "bg-success" : "bg-destructive"}`} />
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-snug line-clamp-1">{f.name}</h3>
          <button onClick={() => toggleFavFood(f.id)} aria-label="Save" className="shrink-0 text-muted-foreground hover:text-destructive">
            <Heart className={`h-4 w-4 ${liked ? "fill-destructive text-destructive" : ""}`} />
          </button>
        </div>
        <div className="mt-0.5 flex items-center gap-1 text-xs text-success font-semibold">
          <Star className="h-3 w-3 fill-current" /> {f.rating}
        </div>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{f.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-bold">{fmt(f.price)}</span>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => addToCart(f)}
            className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:brightness-110 transition"
          >
            <Plus className="h-3 w-3" /> Add
          </motion.button>
        </div>
      </div>
    </div>
  );
}
