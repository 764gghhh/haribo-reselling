"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, ChevronLeft, ChevronRight, Star } from "lucide-react";
import {
  formatReviewDate,
  getReviewsPage,
  getReviewStats,
  getTotalPages,
  loadUserReviews,
  type Review,
} from "@/lib/reviews";
import { cn } from "@/lib/utils";

function GreenStars() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-emerald-400 text-emerald-400" />
      ))}
    </div>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index, 8) * 0.03,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`mb-4 break-inside-avoid rounded-2xl border p-5 transition-colors duration-300 ${
        review.own
          ? "border-accent/30 bg-gradient-to-b from-accent/[0.08] to-panel hover:border-accent/50"
          : "border-white/[0.06] bg-panel hover:border-white/[0.12]"
      }`}
    >
      {/* Row: stars + verified + date */}
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <GreenStars />
        <span className="flex items-center gap-1 text-[12px] font-medium text-emerald-400">
          <BadgeCheck className="h-3.5 w-3.5" />
          Verified purchase
        </span>
        <span className="ml-auto text-[12.5px] text-zinc-500">
          {formatReviewDate(review.date)}
        </span>
      </div>

      {/* Body text */}
      <p className="text-[14px] leading-relaxed text-zinc-300">
        {review.text}
      </p>

      {/* Product tag at bottom */}
      <div className="mt-4 flex items-center gap-2">
        {review.own && (
          <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-white">
            Your review
          </span>
        )}
        <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11.5px] font-medium text-zinc-400">
          {review.product}
        </span>
      </div>
    </motion.article>
  );
}

export function ReviewsSection() {
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [ownReviews, setOwnReviews] = useState<Review[]>([]);
  const totalPages = getTotalPages();
  const stats = getReviewStats();

  useEffect(() => {
    setMounted(true);
    setOwnReviews(loadUserReviews().slice(0, 3));
  }, []);

  const pageReviews = useMemo(() => getReviewsPage(page), [page]);
  const reviews = useMemo(
    () => (page === 1 ? [...ownReviews, ...pageReviews] : pageReviews),
    [page, ownReviews, pageReviews],
  );

  const goTo = (p: number) => {
    setPage(p);
    const el = document.getElementById("reviews");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="reviews"
      className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32"
    >
      <div className="absolute right-[-15%] top-[10%] h-[400px] w-[400px] rounded-full bg-accent/[0.06] blur-[130px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end"
        >
          <div className="max-w-xl">
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-accent-light">
              Customer Reviews
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-[42px] sm:leading-[1.1]">
              What our customers <span className="text-gradient-blue">say.</span>
            </h2>
            <div className="mt-5 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <p className="text-[13px] font-medium text-zinc-400">
                Automatic feedback after 7 days · all reviews are verified
              </p>
            </div>
          </div>

          {/* Aggregate */}
          <div className="rounded-3xl border border-white/[0.06] bg-panel px-7 py-5">
            <div className="flex items-center gap-5">
              <span className="tabular font-display text-5xl font-bold tracking-tight text-white">
                5.0
              </span>
              <div>
                <GreenStars />
                <p className="mt-1.5 text-[13px] text-zinc-400">
                  based on{" "}
                  <span className="tabular font-semibold text-zinc-200">
                    {stats.total}
                  </span>{" "}
                  reviews
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        {!mounted ? (
          <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="mb-4 h-36 animate-pulse break-inside-avoid rounded-2xl border border-white/[0.05] bg-panel"
              />
            ))}
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="columns-1 gap-4 md:columns-2 lg:columns-3"
              >
                {reviews.map((review, i) => (
                  <ReviewCard key={review.id} review={review} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => goTo(Math.max(1, page - 1))}
                disabled={page === 1}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 active:scale-95",
                  page === 1
                    ? "cursor-not-allowed border-white/[0.05] text-zinc-700"
                    : "border-white/[0.1] text-zinc-300 hover:border-accent/40 hover:bg-accent/10 hover:text-white",
                )}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => goTo(p)}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 active:scale-95",
                      page === p
                        ? "bg-accent text-white shadow-[0_0_20px_-4px_rgba(37,99,235,0.6)]"
                        : "border border-white/[0.08] text-zinc-400 hover:border-accent/40 hover:bg-accent/10 hover:text-white",
                    )}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => goTo(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 active:scale-95",
                  page === totalPages
                    ? "cursor-not-allowed border-white/[0.05] text-zinc-700"
                    : "border-white/[0.1] text-zinc-300 hover:border-accent/40 hover:bg-accent/10 hover:text-white",
                )}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-center text-[13px] text-zinc-600">
              Page {page} of {totalPages} · {stats.total} verified reviews
            </p>
          </>
        )}
      </div>
    </section>
  );
}
