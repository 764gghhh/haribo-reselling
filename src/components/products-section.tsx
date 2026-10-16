"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Check, Layers, ShieldCheck, ShoppingBag, Sparkles, Terminal, Zap } from "lucide-react";
import { PRODUCTS, priceRange, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { cn, formatEUR } from "@/lib/utils";
import Image from "next/image";

const ICONS = {
  shield: ShieldCheck,
  terminal: Terminal,
  sparkles: Sparkles,
  layers: Layers,
  zap: Zap,
  activity: Activity,
};

const BADGE_STYLES: Record<Product["badge"], string> = {
  Bestseller: "bg-accent text-white shadow-[0_4px_18px_-4px_rgba(37,99,235,0.7)]",
  New: "border border-accent/40 bg-accent/15 text-accent-glow",
  Premium: "bg-gradient-to-r from-accent-deep via-accent to-accent-light text-white",
  "In Stock": "border border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
};

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart();
  const [selected, setSelected] = useState(1);
  const [added, setAdded] = useState(false);
  const variant = product.variants[selected];

  const handleBuy = () => {
    addItem({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      variantLabel: variant.label,
      price: variant.price,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay: (index % 3) * 0.09, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-[28px] border border-white/[0.06] bg-panel transition-all duration-500 hover:-translate-y-2 hover:border-accent/30 hover:shadow-[0_32px_80px_-24px_rgba(37,99,235,0.35)]"
    >
      {/* Visual header - Thumbnail Image */}
      <div className="relative h-56 w-full overflow-hidden border-b border-white/[0.05]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent opacity-60" />
        <span
          className={cn(
            "absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide z-10",
            BADGE_STYLES[product.badge],
          )}
        >
          {product.badge}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-[21px] font-bold tracking-tight">{product.name}</h3>
        <p className="mt-0.5 text-[13px] font-medium text-accent-light">{product.tagline}</p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{product.description}</p>

        <ul className="mt-5 space-y-2.5">
          {product.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-[13.5px] text-zinc-300">
              <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-accent/15">
                <Check className="h-3 w-3 text-accent-light" strokeWidth={3} />
              </span>
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-5">
          {/* Plan selector */}
          <div className="mt-4 grid grid-cols-3 gap-1.5 rounded-2xl border border-white/[0.06] bg-abyss p-1.5">
            {product.variants.map((v, i) => (
              <button
                key={v.id}
                onClick={() => setSelected(i)}
                className={cn(
                  "rounded-xl px-1 py-2.5 text-center transition-all duration-300 active:scale-[0.97]",
                  selected === i
                    ? "bg-accent/15 text-white shadow-[inset_0_0_0_1px_rgba(59,130,246,0.4)]"
                    : "text-zinc-500 hover:text-zinc-300",
                )}
              >
                <span className="block text-[10px] font-medium uppercase tracking-tight">{v.label}</span>
                <span className="tabular block text-[12px] font-bold mt-0.5">
                  {formatEUR(v.price)}
                </span>
              </button>
            ))}
          </div>

          {/* Price + CTA */}
          <div className="mt-5 flex items-end justify-between border-t border-white/[0.06] pt-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Starting from
              </p>
              <p className="tabular font-display text-[24px] font-bold tracking-tight text-white">
                {formatEUR(variant.price)}
              </p>
            </div>
            <button
              onClick={handleBuy}
              className={cn(
                "group/btn relative flex h-11 items-center gap-2 overflow-hidden rounded-full px-5 text-sm font-semibold transition-all duration-300 active:scale-[0.96]",
                added
                  ? "bg-emerald-500 text-white"
                  : "bg-accent text-white hover:bg-accent-light hover:shadow-[0_8px_28px_-6px_rgba(37,99,235,0.65)]",
              )}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" strokeWidth={3} />
                  Added
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4 transition-transform duration-300 group-hover/btn:-rotate-12" />
                  Buy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function ProductsSection() {
  return (
    <section id="products" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-accent/[0.05] blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-xl">
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-accent-light">
              Our Products
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-[42px] sm:leading-[1.1]">
              Premium Selection. <br />
              <span className="text-zinc-500">Unmatched Quality.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-zinc-400 md:text-right">
            Discover our curated tools designed for performance, stability, and maximum control. 
            All products are delivered within 30–60 minutes.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}

          {/* CTA card - only if we have odd number or just keep it */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center justify-center overflow-hidden rounded-[28px] border border-dashed border-white/[0.1] bg-gradient-to-b from-accent/[0.05] to-transparent p-8 text-center min-h-[400px]"
          >
            <div className="absolute h-32 w-32 rounded-full bg-accent/[0.12] blur-3xl" />
            <Sparkles className="relative mb-4 h-8 w-8 text-accent-light" strokeWidth={1.5} />
            <h3 className="relative font-display text-lg font-semibold">
              Need something custom?
            </h3>
            <p className="relative mt-2 max-w-xs text-sm text-zinc-400">
              Our team is always working on new features. Contact us if you have special requests.
            </p>
            <a
              href="/support"
              className="relative mt-5 rounded-full border border-accent/40 bg-accent/10 px-6 py-2.5 text-sm font-semibold text-accent-glow transition-all duration-300 hover:bg-accent hover:text-white active:scale-[0.97]"
            >
              Contact Support
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
