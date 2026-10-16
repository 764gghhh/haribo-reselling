"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Clock, Minus, Plus, ShieldCheck, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatEUR } from "@/lib/utils";
import { LogoMark } from "./logo";

export function CartDrawer() {
  const { items, total, isOpen, setOpen, setQty, removeItem, clear } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, setOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/[0.07] bg-carbon"
            role="dialog"
            aria-label="Cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-lg font-semibold tracking-tight">
                  Your Cart
                </h2>
                {items.length > 0 && (
                  <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent-light">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03]">
                  <ShoppingBag className="h-7 w-7 text-zinc-500" />
                </div>
                <div>
                  <p className="font-medium text-zinc-200">Your cart is empty</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Discover our premium tools and get started.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    router.push("/#products");
                  }}
                  className="mt-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-accent-light active:scale-[0.97]"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.key}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 48 }}
                        transition={{ duration: 0.25 }}
                        className="mb-3 flex gap-4 rounded-2xl border border-white/[0.06] bg-panel p-4"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-abyss">
                          <LogoMark size={26} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="truncate text-sm font-semibold text-white">
                                {item.name}
                              </p>
                              <p className="text-xs text-zinc-500">{item.variantLabel}</p>
                            </div>
                            <p className="tabular shrink-0 text-sm font-semibold text-white">
                              {formatEUR(item.price * item.qty)}
                            </p>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-abyss px-1 py-1">
                              <button
                                onClick={() => setQty(item.key, item.qty - 1)}
                                className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/[0.07] hover:text-white"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="tabular w-6 text-center text-xs font-semibold">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => setQty(item.key, item.qty + 1)}
                                className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/[0.07] hover:text-white"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.key)}
                              className="text-xs font-medium text-zinc-500 transition-colors hover:text-red-400"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <button
                    onClick={clear}
                    className="mt-1 text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-400"
                  >
                    Clear cart
                  </button>
                </div>

                {/* Footer */}
                <div className="border-t border-white/[0.06] px-6 py-5">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Subtotal</span>
                    <span className="tabular font-medium">{formatEUR(total)}</span>
                  </div>
                  <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Delivery</span>
                    <span className="flex items-center gap-1 font-medium text-emerald-400">
                      <Clock className="h-3 w-3" />
                      Digital · 30–60 min
                    </span>
                  </div>
                  <div className="mb-5 flex items-center justify-between border-t border-white/[0.06] pt-3">
                    <span className="font-display text-base font-semibold">Total</span>
                    <span className="tabular font-display text-xl font-bold text-gradient">
                      {formatEUR(total)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setOpen(false);
                      router.push("/checkout");
                    }}
                    className="group flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-accent-light hover:shadow-[0_8px_32px_-8px_rgba(37,99,235,0.6)] active:scale-[0.98]"
                  >
                    Checkout
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
                    <ShieldCheck className="h-3.5 w-3.5 text-accent-light" />
                    Secure payment · LTC, SOL, PayPal & Paysafecard
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
