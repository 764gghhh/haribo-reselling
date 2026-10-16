"use client";

import { motion } from "framer-motion";
import { Headset, Lock, RefreshCw, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Fast Delivery",
    text: "Expect your license and instructions to be delivered within 30–60 minutes via Discord.",
  },
  {
    icon: Lock,
    title: "Secure Checkout",
    text: "Encrypted transmission and flexible payment via Litecoin, Solana, PayPal or Paysafecard.",
  },
  {
    icon: Headset,
    title: "24/7 Live Support",
    text: "Our team is available around the clock on Discord — average response time under 30 minutes.",
  },
  {
    icon: RefreshCw,
    title: "Regular Updates",
    text: "All tools are maintained weekly, expanded with new features and secured against the latest patches.",
  },
];

const MARQUEE_ITEMS = [
  "Litecoin (LTC)",
  "Solana (SOL)",
  "PayPal",
  "Paysafecard",
  "30–60 Min Delivery",
  "24/7 Support",
  "Weekly Updates",
  "99.9% Uptime",
  "High Performance",
  "Secure Payment",
];

export function Trust() {
  return (
    <section id="benefits" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-accent-light">
            Why Haribo Resseling
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-[42px] sm:leading-[1.1]">
            Trust you can <span className="text-gradient-blue">feel.</span>
          </h2>
          <p className="mt-4 text-balance text-zinc-400">
            Our community grows every day — and relies on our software.
            These four pillars make the difference.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-panel p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/30 hover:shadow-[0_24px_64px_-24px_rgba(37,99,235,0.35)]"
            >
              <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-accent/[0.07] blur-2xl transition-opacity duration-500 group-hover:bg-accent/[0.16]" />
              <div className="relative">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/25 bg-accent/[0.08] text-accent-light transition-all duration-500 group-hover:scale-110 group-hover:rotate-[-4deg]">
                  <feature.icon className="h-5.5 w-5.5" strokeWidth={1.8} />
                </div>
                <h3 className="mb-2 font-display text-[17px] font-semibold tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">{feature.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-20 border-y border-white/[0.05] bg-carbon/60 py-5"
      >
        <div className="mask-fade-x overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-10 pr-10">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((label, i) => (
              <span key={i} className="flex items-center gap-10 whitespace-nowrap">
                <span className="font-display text-sm font-medium tracking-wide text-zinc-500">
                  {label}
                </span>
                <span className="h-1.5 w-1.5 rotate-45 bg-accent/50" />
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
