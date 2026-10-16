"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { animate, motion, useInView } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles, Star } from "lucide-react";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current)
          ref.current.textContent = Math.round(v).toLocaleString("en-US") + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function Hero() {
  return (
    <section className="noise relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-70" />
      <div className="absolute left-1/2 top-[-20%] h-[70vh] w-[90vw] -translate-x-1/2 rounded-full bg-accent/[0.13] blur-[140px]" />
      <div className="absolute right-[-10%] top-[30%] h-[420px] w-[420px] rounded-full bg-accent-deep/[0.22] blur-[120px] animate-float-slow" />
      <div className="absolute left-[-8%] bottom-[10%] h-[380px] w-[380px] rounded-full bg-accent/[0.1] blur-[110px] animate-float" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-abyss to-transparent" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-5xl px-5 pb-24 pt-36 text-center sm:px-8"
      >
        {/* Badge */}
        <motion.div variants={item} className="mb-8 flex justify-center">
          <Link
            href="/#reviews"
            className="group flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] py-1.5 pl-2 pr-4 text-[13px] text-zinc-300 backdrop-blur transition-all duration-300 hover:border-accent/40 hover:bg-accent/[0.08]"
          >
            <span className="flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent-light">
              <Sparkles className="h-3 w-3" />
              New
            </span>
            <span className="font-medium">Ambani Menu now available</span>
            <ArrowRight className="h-3.5 w-3.5 text-zinc-500 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-accent-light" />
          </Link>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={item}
          className="font-display text-[44px] font-bold leading-[1.04] tracking-[-0.03em] sm:text-6xl md:text-[84px]"
        >
          The next level
          <br />
          <span className="text-gradient">of FiveM tools.</span>
        </motion.h1>

        {/* Subline */}
          <motion.p
            variants={item}
            className="mx-auto mt-7 max-w-2xl text-balance text-base leading-relaxed text-zinc-400 sm:text-lg"
          >
            Premium software for your FiveM experience — built for performance,
            stability and a seamless workflow. Delivery in 30–60 minutes,
            24/7 support, uncompromising quality.
          </motion.p>

        {/* CTAs */}
        <motion.div
          variants={item}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/#products"
            className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-accent px-8 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-accent-light hover:shadow-[0_12px_40px_-8px_rgba(37,99,235,0.65)] active:scale-[0.97] sm:w-auto"
          >
            Browse Products
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/#reviews"
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.02] px-8 text-[15px] font-semibold text-zinc-200 backdrop-blur transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06] active:scale-[0.97] sm:w-auto"
          >
            <Star className="h-4 w-4 fill-emerald-400 text-emerald-400" />
            5.0/5 · Read Reviews
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={item}
          className="mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-y-10 md:grid-cols-4"
        >
          {[
            { value: <CountUp to={245} suffix="+" />, label: "Happy Customers" },
            { value: "99.9%", label: "Uptime Guarantee" },
            { value: "24/7", label: "Live Support" },
            { value: "30–60 min", label: "Avg. Delivery" },
          ].map((stat, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-1.5 ${
                i > 0 ? "md:border-l md:border-white/[0.07]" : ""
              }`}
            >
              <span className="tabular font-display text-[26px] font-bold tracking-tight text-white sm:text-3xl">
                {stat.value}
              </span>
              <span className="text-[13px] font-medium text-zinc-500">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] text-zinc-500"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
