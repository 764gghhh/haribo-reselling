"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LogoMark } from "./logo";

export function CtaBand() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="noise relative overflow-hidden rounded-[32px] border border-white/[0.07] bg-gradient-to-b from-panel to-carbon px-6 py-16 text-center sm:px-12 sm:py-20"
        >
          <div className="absolute left-1/2 top-0 h-64 w-[560px] -translate-x-1/2 rounded-full bg-accent/[0.18] blur-[100px]" />
          <div className="absolute inset-0 bg-grid-fine opacity-40" />

          <div className="relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-3xl border border-white/[0.08] bg-abyss shadow-[0_16px_48px_-12px_rgba(37,99,235,0.5)]"
            >
              <LogoMark size={40} />
            </motion.div>
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-5xl sm:leading-[1.08]">
              Ready for the next level?{" "}
              <span className="text-gradient">Start now.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-balance text-zinc-400">
              Over 245 customers already trust us. Get your license —
              delivery in 30–60 minutes, support around the clock.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/#products"
                className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-white px-8 text-[15px] font-semibold text-abyss transition-all duration-300 hover:bg-zinc-200 hover:shadow-[0_12px_40px_-8px_rgba(255,255,255,0.3)] active:scale-[0.97] sm:w-auto"
              >
                Choose Product
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/support"
                className="flex h-[52px] w-full items-center justify-center rounded-full border border-white/[0.12] px-8 text-[15px] font-semibold text-zinc-200 transition-all duration-300 hover:border-white/30 hover:bg-white/[0.05] active:scale-[0.97] sm:w-auto"
              >
                Questions? Get Support
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
