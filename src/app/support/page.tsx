"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Clock, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  { q: "How do I receive my product after purchase?", a: "After your payment is verified by our team (usually 30–60 minutes), you'll receive your license key along with the download link and setup instructions via Discord." },
  { q: "What payment methods are accepted?", a: "We accept Litecoin (LTC), Solana (SOL), PayPal and Paysafecard. For crypto payments, enter the transaction hash after sending. For PayPal and Paysafecard, enter the 16-digit code." },
  { q: "How long does delivery take?", a: "Delivery typically takes 30–60 minutes. You will receive your license key and instructions via Discord." },
  { q: "What if my product doesn't work?", a: "Contact us via Discord or email. Our support will help you with setup or replace your license if there's an issue on our end." },
  { q: "Can I upgrade my plan later?", a: "Yes. You can switch from 7 or 30 days to Lifetime at any time — previously paid amounts will be credited. Just contact our support." },
  { q: "Is there a refund policy?", a: "Since these are digital license keys, refunds after successful activation are not possible. For technical issues we can't resolve, we'll always find a fair solution." },
];

export default function SupportPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="relative mx-auto max-w-3xl px-5 pb-24 pt-32 sm:px-8 sm:pt-36">
      <div className="absolute left-1/2 top-0 h-[280px] w-[520px] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[110px]" />
      <div className="relative">
        <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-accent-light">Help & Contact</p>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-[42px]">Support Center</h1>
        <p className="mt-4 text-zinc-400">Answers to the most common questions — and how to reach us directly.</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "System Status", value: "All systems operational", accent: "text-emerald-400" },
            { icon: Clock, title: "Response Time", value: "Ø under 30 min", accent: "text-accent-glow" },
            { icon: MessageCircle, title: "Availability", value: "24/7 · every day", accent: "text-accent-glow" },
          ].map((card) => (
            <div key={card.title} className="rounded-2xl border border-white/[0.06] bg-panel p-5">
              <card.icon className={cn("mb-3 h-5 w-5", card.accent)} />
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{card.title}</p>
              <p className={cn("mt-1 text-sm font-semibold", card.accent)}>{card.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-accent/25 bg-gradient-to-r from-accent/[0.1] to-transparent p-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/30 bg-accent/15"><Mail className="h-5 w-5 text-accent-glow" /></div>
              <div><p className="text-sm font-semibold text-white">Direct contact</p><p className="text-sm text-zinc-400">Response within 30 minutes</p></div>
            </div>
            <a href="mailto:rankedgiyu@gmail.com" className="flex h-11 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-white transition-all duration-300 hover:bg-accent-light active:scale-[0.97]">rankedgiyu@gmail.com</a>
          </div>
        </div>

        <h2 className="mb-5 mt-14 font-display text-xl font-semibold tracking-tight">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={cn("overflow-hidden rounded-2xl border transition-colors duration-300", isOpen ? "border-accent/30 bg-panel" : "border-white/[0.06] bg-panel/60")}>
                <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4.5 text-left" aria-expanded={isOpen}>
                  <span className="text-[15px] font-semibold text-white">{faq.q}</span>
                  <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300", isOpen ? "rotate-180 border-accent/40 bg-accent/15 text-accent-glow" : "border-white/[0.08] text-zinc-500")}><ChevronDown className="h-4 w-4" /></span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}>
                      <p className="px-5 pb-5 text-sm leading-relaxed text-zinc-400">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
