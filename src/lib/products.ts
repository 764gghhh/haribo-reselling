export type ProductVariant = {
  id: string;
  label: string;
  price: number;
};

export type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  badge: "Bestseller" | "New" | "Premium" | "In Stock";
  icon: "shield" | "terminal" | "sparkles" | "layers" | "zap" | "activity";
  image: string;
  features: string[];
  variants: ProductVariant[];
};

export const PRODUCTS: Product[] = [
  {
    id: "ham-executor",
    name: "Ham Executor",
    tagline: "Foundation for almost everything",
    description: "The ultimate script executor for Lua and JS. Essential for running custom scripts and advanced menus.",
    badge: "Bestseller",
    icon: "terminal",
    image: "/images/ham-executor.jpg",
    features: [
      "Script Executor (Lua / JS)",
      "Strong PvP potential through custom scripts",
      "Excellent for trolling (load custom troll scripts)",
      "Mainly used to run custom scripts and menus",
    ],
    variants: [
      { id: "he-7", label: "7 Days", price: 9.99 },
      { id: "he-30", label: "30 Days", price: 24.99 },
      { id: "he-life", label: "Lifetime", price: 39.99 },
    ],
  },
  {
    id: "ham-protector",
    name: "Ham Protector",
    tagline: "Defense-focused security",
    description: "Premium anti-cheat bypass and protection layer to keep your accounts safe and undetected.",
    badge: "In Stock",
    icon: "shield",
    image: "/images/ham-protector.jpg",
    features: [
      "Anti-Cheat Bypass / Protection",
      "Protects against detection (especially server-side)",
      "Indirectly strong in PvP (stay undetected longer)",
      "Useful for trolling because you can play more safely",
    ],
    variants: [
      { id: "hp-7", label: "7 Days", price: 7.0 },
      { id: "hp-30", label: "30 Days", price: 19.0 },
      { id: "hp-life", label: "Lifetime", price: 38.0 },
    ],
  },
  {
    id: "vanity",
    name: "Vanity",
    tagline: "Clean all-round utility",
    description: "A visually stunning menu focused on visuals, ESP, and essential quality-of-life features.",
    badge: "In Stock",
    icon: "sparkles",
    image: "/images/vanity.jpg",
    features: [
      "Visual + Utility Menu (ESP, Player Lists)",
      "Medium PvP strength (good overview + ESP)",
      "Good for trolling (mark, stalk, disturb players)",
      "Focus on visuals and small helpers",
    ],
    variants: [
      { id: "v-7", label: "7 Days", price: 10.0 },
      { id: "v-30", label: "30 Days", price: 20.0 },
      { id: "v-life", label: "Lifetime", price: 30.0 },
    ],
  },
  {
    id: "ambani",
    name: "Ambani",
    tagline: "Popular all-in-one menu",
    description: "The perfect balance between PvP performance and disruptive troll options in one package.",
    badge: "Premium",
    icon: "layers",
    image: "/images/ambani.jpg",
    features: [
      "Strong all-round menu",
      "Strong in PvP (aim, rage options)",
      "Very good for trolling options",
      "Good mix of PvP features and troll options",
    ],
    variants: [
      { id: "am-7", label: "7 Days", price: 10.0 },
      { id: "am-30", label: "30 Days", price: 22.0 },
      { id: "am-life", label: "Lifetime", price: 35.0 },
    ],
  },
  {
    id: "nexus",
    name: "Nexus",
    tagline: "Modern and clean performance",
    description: "A high-performance menu built for modern FiveM environments with a solid feature set.",
    badge: "New",
    icon: "zap",
    image: "/images/nexus.jpg",
    features: [
      "Focus on performance + solid feature set",
      "Strong in PvP capabilities",
      "Good to very good for trolling",
      "Premium / well-maintained menu",
    ],
    variants: [
      { id: "nx-7", label: "7 Days", price: 12.0 },
      { id: "nx-30", label: "30 Days", price: 25.0 },
      { id: "nx-life", label: "Lifetime", price: 40.0 },
    ],
  },
  {
    id: "vortex",
    name: "Vortex",
    tagline: "Maximum chaos and rage",
    description: "Aggressive menu designed for players who want to dominate with rage features and chaos.",
    badge: "Premium",
    icon: "activity",
    image: "/images/vortex.jpg",
    features: [
      "Aggressive menu with strong troll/rage features",
      "Very strong in PvP (rage / free-cam options)",
      "Excellent for trolling (disruptive features)",
      "Best for players who want maximum chaos",
    ],
    variants: [
      { id: "vx-7", label: "7 Days", price: 13.99 },
      { id: "vx-30", label: "30 Days", price: 23.99 },
      { id: "vx-life", label: "Lifetime", price: 50.0 },
    ],
  },
];

export function findProduct(productId: string) {
  return PRODUCTS.find((p) => p.id === productId);
}

export function findVariant(productId: string, variantId: string) {
  const product = findProduct(productId);
  return product?.variants.find((v) => v.id === variantId);
}

export function priceRange(product: Product): string {
  const prices = product.variants.map((v) => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "EUR" });
  return `${fmt(min)} – ${fmt(max)}`;
}
