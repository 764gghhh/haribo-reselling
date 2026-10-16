"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { makeUserReviewId, saveUserReview } from "@/lib/reviews";

export function ReviewForm({
  orderId,
  defaultName,
  products,
}: {
  orderId: string | null;
  defaultName: string;
  products: string[];
}) {
  const [product, setProduct] = useState(products[0] ?? "");
  const [name, setName] = useState(defaultName);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const valid = text.trim().length >= 10 && name.trim().length >= 2;

  const submit = async () => {
    if (!valid || status === "loading") return;
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderId ?? undefined,
          name: name.trim(),
          product,
          rating: 5,
          text: text.trim(),
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      saveUserReview({
        id: makeUserReviewId(),
        name: name.trim(),
        rating: 5,
        product,
        text: text.trim(),
        date: new Date(),
        verified: true,
        own: true,
      });
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setError(
        e instanceof Error ? e.message : "Your review could not be submitted.",
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto mt-6 max-w-md rounded-3xl border border-white/[0.07] bg-panel p-6 text-left"
    >
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 py-6 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
              <Check className="h-6 w-6 text-emerald-400" strokeWidth={2.5} />
            </div>
            <p className="font-display text-lg font-semibold">
              Thanks for your review!
            </p>
            <p className="text-sm text-zinc-400">
              It&apos;s now visible in the review feed on the homepage.
            </p>
            <a
              href="/#reviews"
              className="mt-1 text-sm font-semibold text-accent-glow underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              View reviews
            </a>
          </motion.div>
        ) : (
          <motion.div key="form" exit={{ opacity: 0, scale: 0.97 }}>
            <h3 className="font-display text-lg font-semibold tracking-tight">
              Rate your purchase
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Your experience helps other customers — thank you!
            </p>

            {/* Stars: always 5 */}
            <div className="mt-5 flex items-center gap-3">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.06 * i, type: "spring", stiffness: 320, damping: 18 }}
                  >
                    <Star className="h-7 w-7 fill-emerald-400 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]" />
                  </motion.span>
                ))}
              </div>
              <span className="text-sm font-semibold text-zinc-300">5/5 · Excellent</span>
            </div>

            {/* Product select */}
            {products.length > 0 && (
              <div className="mt-4">
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Product
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {products.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setProduct(p)}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all duration-300 active:scale-[0.96]",
                        product === p
                          ? "border-accent/60 bg-accent/15 text-accent-glow"
                          : "border-white/[0.08] bg-abyss text-zinc-400 hover:text-zinc-200",
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Name */}
            <div className="mt-4">
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Display name
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={48}
                className="w-full rounded-2xl border border-white/[0.08] bg-abyss px-4 py-3 text-[14px] text-white placeholder-zinc-600 outline-none transition-all duration-300 focus:border-accent/60 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]"
              />
            </div>

            {/* Text */}
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Your review
                </p>
                <span className={cn("tabular text-xs", text.trim().length >= 10 ? "text-zinc-600" : "text-zinc-500")}>
                  {text.trim().length}/600
                </span>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 600))}
                rows={4}
                placeholder="How was the order? How satisfied are you with the product? (min. 10 characters)"
                className="w-full resize-none rounded-2xl border border-white/[0.08] bg-abyss px-4 py-3 text-[14px] leading-relaxed text-white placeholder-zinc-600 outline-none transition-all duration-300 focus:border-accent/60 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]"
              />
            </div>

            {/* Error */}
            <AnimatePresence>
              {status === "error" && error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 flex items-center gap-1.5 text-xs font-medium text-red-400"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              onClick={submit}
              disabled={!valid || status === "loading"}
              className={cn(
                "mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-300 active:scale-[0.98]",
                valid && status !== "loading"
                  ? "bg-accent text-white hover:bg-accent-light hover:shadow-[0_10px_32px_-8px_rgba(37,99,235,0.55)]"
                  : "cursor-not-allowed bg-white/[0.05] text-zinc-600",
              )}
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit Review"
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
