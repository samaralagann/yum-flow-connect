import burger from "@/assets/food-burger.jpg";
import pizza from "@/assets/food-pizza.jpg";
import sushi from "@/assets/food-sushi.jpg";
import poke from "@/assets/food-poke.jpg";
import biryani from "@/assets/food-biryani.jpg";
import tacos from "@/assets/food-tacos.jpg";
import pho from "@/assets/food-pho.jpg";
import dessert from "@/assets/food-dessert.jpg";

export type FoodItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  veg: boolean;
  cuisine: string;
  restaurantId: string;
};

export type Restaurant = {
  id: string;
  name: string;
  tagline: string;
  cuisines: string[];
  rating: number;
  deliveryMin: number;
  priceLevel: 1 | 2 | 3;
  image: string;
  featured?: boolean;
  offer?: string;
};

export const restaurants: Restaurant[] = [
  { id: "burger-lab", name: "Burger Lab", tagline: "Smash burgers, crispy fries", cuisines: ["American", "Burgers"], rating: 4.7, deliveryMin: 22, priceLevel: 2, image: burger, featured: true, offer: "20% OFF over $25" },
  { id: "napoli", name: "Napoli Pizza Co.", tagline: "Wood-fired Neapolitan pies", cuisines: ["Italian", "Pizza"], rating: 4.8, deliveryMin: 28, priceLevel: 2, image: pizza, featured: true, offer: "Free drink" },
  { id: "sakura", name: "Sakura Sushi", tagline: "Fresh nigiri & rolls daily", cuisines: ["Japanese", "Sushi"], rating: 4.9, deliveryMin: 32, priceLevel: 3, image: sushi, featured: true },
  { id: "aloha", name: "Aloha Poke", tagline: "Build-your-own bowls", cuisines: ["Hawaiian", "Healthy"], rating: 4.6, deliveryMin: 18, priceLevel: 2, image: poke, offer: "Buy 1 Get 1 50%" },
  { id: "spice-route", name: "Spice Route", tagline: "Authentic Indian flavors", cuisines: ["Indian", "Curry"], rating: 4.7, deliveryMin: 30, priceLevel: 2, image: biryani },
  { id: "casa-taco", name: "Casa Taco", tagline: "Street-style Mexican", cuisines: ["Mexican", "Tacos"], rating: 4.5, deliveryMin: 20, priceLevel: 1, image: tacos, offer: "Free guac" },
  { id: "pho-saigon", name: "Pho Saigon", tagline: "Slow-simmered broths", cuisines: ["Vietnamese", "Asian"], rating: 4.6, deliveryMin: 25, priceLevel: 2, image: pho },
  { id: "sweet-spot", name: "Sweet Spot", tagline: "Artisan desserts & treats", cuisines: ["Desserts", "Bakery"], rating: 4.8, deliveryMin: 15, priceLevel: 1, image: dessert, featured: true },
];

export const foods: FoodItem[] = [
  { id: "f1", restaurantId: "burger-lab", name: "Classic Smash Burger", description: "Double beef patty, american cheese, house sauce", price: 11.5, image: burger, rating: 4.8, veg: false, cuisine: "American" },
  { id: "f2", restaurantId: "burger-lab", name: "Truffle Fries", description: "Hand-cut fries with truffle oil & parmesan", price: 6.5, image: burger, rating: 4.6, veg: true, cuisine: "American" },
  { id: "f3", restaurantId: "napoli", name: "Margherita", description: "San Marzano tomato, fior di latte, basil", price: 13.0, image: pizza, rating: 4.9, veg: true, cuisine: "Italian" },
  { id: "f4", restaurantId: "napoli", name: "Diavola", description: "Spicy salami, mozzarella, chili oil", price: 15.0, image: pizza, rating: 4.7, veg: false, cuisine: "Italian" },
  { id: "f5", restaurantId: "sakura", name: "Salmon Nigiri Set", description: "8 pieces of fresh salmon nigiri", price: 18.0, image: sushi, rating: 4.9, veg: false, cuisine: "Japanese" },
  { id: "f6", restaurantId: "sakura", name: "Rainbow Roll", description: "Crab, avocado, topped with assorted sashimi", price: 16.5, image: sushi, rating: 4.8, veg: false, cuisine: "Japanese" },
  { id: "f7", restaurantId: "aloha", name: "Salmon Poke Bowl", description: "Salmon, avocado, edamame, sushi rice", price: 14.0, image: poke, rating: 4.7, veg: false, cuisine: "Hawaiian" },
  { id: "f8", restaurantId: "aloha", name: "Veggie Buddha Bowl", description: "Tofu, mango, cucumber, brown rice", price: 12.5, image: poke, rating: 4.5, veg: true, cuisine: "Hawaiian" },
  { id: "f9", restaurantId: "spice-route", name: "Chicken Biryani", description: "Basmati rice slow-cooked with spiced chicken", price: 13.5, image: biryani, rating: 4.8, veg: false, cuisine: "Indian" },
  { id: "f10", restaurantId: "spice-route", name: "Paneer Tikka Masala", description: "Grilled paneer in creamy tomato gravy", price: 12.0, image: biryani, rating: 4.6, veg: true, cuisine: "Indian" },
  { id: "f11", restaurantId: "casa-taco", name: "Tacos al Pastor (3)", description: "Marinated pork, pineapple, cilantro, onion", price: 9.5, image: tacos, rating: 4.7, veg: false, cuisine: "Mexican" },
  { id: "f12", restaurantId: "casa-taco", name: "Veggie Tacos (3)", description: "Roasted peppers, black beans, queso fresco", price: 8.5, image: tacos, rating: 4.4, veg: true, cuisine: "Mexican" },
  { id: "f13", restaurantId: "pho-saigon", name: "Beef Pho", description: "24-hour broth, rice noodles, herbs", price: 12.5, image: pho, rating: 4.7, veg: false, cuisine: "Vietnamese" },
  { id: "f14", restaurantId: "pho-saigon", name: "Veggie Pho", description: "Mushroom broth, tofu, bok choy", price: 11.0, image: pho, rating: 4.5, veg: true, cuisine: "Vietnamese" },
  { id: "f15", restaurantId: "sweet-spot", name: "Chocolate Lava Cake", description: "Warm chocolate cake with vanilla ice cream", price: 7.5, image: dessert, rating: 4.9, veg: true, cuisine: "Dessert" },
  { id: "f16", restaurantId: "sweet-spot", name: "Berry Cheesecake", description: "New York style with mixed berry compote", price: 6.5, image: dessert, rating: 4.7, veg: true, cuisine: "Dessert" },
];

export const cuisines = ["All", "American", "Italian", "Japanese", "Indian", "Mexican", "Vietnamese", "Hawaiian", "Desserts"];

export function getRestaurant(id: string) { return restaurants.find(r => r.id === id); }
export function getFoodsByRestaurant(id: string) { return foods.filter(f => f.restaurantId === id); }
export function getFood(id: string) { return foods.find(f => f.id === id); }
