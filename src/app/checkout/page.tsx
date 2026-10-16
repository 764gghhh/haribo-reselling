"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import QRCode from "react-qr-code";
import {
  AlertCircle, ArrowLeft, ArrowRight, BadgeCheck, Check, CheckCircle2,
  Clock, Copy, CreditCard, Loader2, Lock, MessageCircle, ShoppingBag,
  ShoppingCart, Trash2, Wallet, X,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { cn, delay, formatCode16, formatEUR, onlyDigits } from "@/lib/utils";
import { LogoMark } from "@/components/logo";
import { ReviewForm } from "@/components/review-form";

type MethodId = "ltc" | "sol" | "paypal" | "paysafecard";

const CRYPTO_RATES: Record<string, { rate: number; symbol: string }> = {
  ltc: { rate: 88.15, symbol: "LTC" },
  sol: { rate: 152.4, symbol: "SOL" },
};

const METHODS: { id: MethodId; name: string; note: string; mono: string }[] = [
  { id: "ltc", name: "Litecoin", note: "Crypto · LTC network", mono: "Ł" },
  { id: "sol", name: "Solana", note: "Crypto · SOL network", mono: "S" },
  { id: "paypal", name: "PayPal", note: "Friends & Family", mono: "P" },
  { id: "paysafecard", name: "Paysafecard", note: "PIN · 16 digits", mono: "16" },
];

const ADDRESSES: Record<string, string> = {
  ltc: "LQJyXPfoAYhpmWaMDpw2fQy6zY5fFy6FSC",
  sol: "9e2SNghAmjaaw9eQG6TtepYcFJqDZXnh2LHq1SKEdVy2",
};

const PAYPAL_EMAIL = "rankedgiyu@gmail.com";

const LOADING_MESSAGES = [
  "Creating your order…",
  "Verifying payment data…",
  "Sending order to our team…",
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try { await navigator.clipboard.writeText(value); } catch {
          const ta = document.createElement("textarea"); ta.value = value;
          document.body.appendChild(ta); ta.select();
          document.execCommand("copy"); document.body.removeChild(ta);
        }
        setCopied(true); window.setTimeout(() => setCopied(false), 1600);
      }}
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 active:scale-90",
        copied
          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
          : "border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:border-accent/40 hover:text-white",
      )}
      aria-label="Copy to clipboard"
    >
      {copied ? <Check className="h-4 w-4" strokeWidth={3} /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

function AddressBox({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</p>
      <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-abyss px-4 py-3">
        <code className="min-w-0 flex-1 break-all font-mono text-[12.5px] leading-relaxed text-accent-glow">
          {value}
        </code>
        <CopyButton value={value} />
      </div>
    </div>
  );
}

function FieldError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
      className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-400">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />{message}
    </motion.p>
  );
}

const inputClass = (invalid: boolean) =>
  cn(
    "w-full rounded-2xl border bg-abyss px-4 py-3.5 text-[14px] text-white placeholder-zinc-600 outline-none transition-all duration-300",
    invalid
      ? "border-red-500/50 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
      : "border-white/[0.08] focus:border-accent/60 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]",
  );

export default function CheckoutPage() {
  const { items, total, removeItem, clear, hydrated } = useCart();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [method, setMethod] = useState<MethodId | null>(null);
  const [discord, setDiscord] = useState("");
  const [txHash, setTxHash] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [purchasedProducts, setPurchasedProducts] = useState<string[]>([]);

  useEffect(() => {
    if (status !== "loading") return;
    const interval = window.setInterval(() => setLoadingMsg((m) => (m + 1) % LOADING_MESSAGES.length), 900);
    return () => window.clearInterval(interval);
  }, [status]);

  const cryptoAmount = useMemo(() => {
    if (!method || !(method in CRYPTO_RATES)) return null;
    const { rate, symbol } = CRYPTO_RATES[method];
    return `${(total / rate).toFixed(4)} ${symbol}`;
  }, [method, total]);

  const validateStep1 = () => {
    const next: Record<string, string> = {};
    if (discord.trim().length < 2) next.discord = "Please enter your Discord username (min. 2 characters).";
    setErrors(next); return Object.keys(next).length === 0;
  };

  const validatePayment = (): string | null => {
    if (!method) return "Please select a payment method.";
    if (method === "ltc" || method === "sol") {
      if (!/^[a-zA-Z0-9]{20,}$/.test(txHash.trim())) return "Please enter a valid transaction hash (min. 20 characters).";
    } else {
      if (code.length !== 16) return `Please enter the full 16-digit code (${code.length}/16 digits).`;
    }
    return null;
  };

  const getReference = () => method === "ltc" || method === "sol" ? txHash.trim() : formatCode16(code);

  const submitOrder = async () => {
    const error = validatePayment(); setErrors(error ? { payment: error } : {}); if (error) return;
    setStatus("loading"); setServerError(null); setLoadingMsg(0);
    try {
      const [res] = await Promise.all([
        fetch("/api/orders", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: items.map((i) => ({ productId: i.productId, variantId: i.variantId, qty: i.qty })), discord: discord.trim(), paymentMethod: method, reference: getReference() }),
        }),
        delay(2400),
      ]);
      const data = (await res.json()) as { ok: boolean; orderId?: string; error?: string };
      if (!res.ok || !data.ok || !data.orderId) throw new Error(data.error || "The order could not be processed.");
      setOrderId(data.orderId); setPurchasedProducts([...new Set(items.map((i) => i.name))]);
      setStatus("success"); setStep(3); clear(); window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setStatus("error"); setServerError(e instanceof Error ? e.message : "An unexpected error occurred.");
    }
  };

  if (!hydrated) return <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-5 pt-24"><Loader2 className="h-6 w-6 animate-spin text-accent-light" /></div>;

  if (items.length === 0 && status !== "success") {
    return (
      <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-5 pt-20 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/[0.06] bg-panel">
          <ShoppingCart className="h-9 w-9 text-zinc-600" />
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Your cart is empty</h1>
        <p className="mt-3 max-w-md text-zinc-400">Add a product first to proceed with your order.</p>
        <Link href="/#products" className="mt-8 flex h-12 items-center gap-2 rounded-full bg-accent px-8 text-sm font-semibold text-white transition-all duration-300 hover:bg-accent-light hover:shadow-[0_10px_36px_-8px_rgba(37,99,235,0.6)] active:scale-[0.97]">
          <ShoppingBag className="h-4 w-4" />Browse Products
        </Link>
      </div>
    );
  }

  /* ── Success Screen ── */
  if (step === 3 && status === "success") {
    return (
      <div className="relative mx-auto min-h-[90vh] max-w-3xl px-5 pb-24 pt-32 sm:px-8">
        <div className="absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/[0.08] blur-[100px]" />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="relative text-center">
          <motion.div initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
            className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 shadow-[0_0_60px_-10px_rgba(52,211,153,0.4)]">
            <Check className="h-9 w-9 text-emerald-400" strokeWidth={2.5} />
          </motion.div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Thank you for your order!
          </h1>
          <p className="mx-auto mt-3 max-w-md text-balance text-zinc-400">
            Your order has been received and is now being processed by our team.
          </p>

          {/* Manual delivery banner — only shown after purchase */}
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-6 max-w-md rounded-2xl border border-amber-400/30 bg-amber-400/[0.08] px-5 py-4"
          >
            <div className="flex items-center justify-center gap-2.5">
              <Clock className="h-5 w-5 shrink-0 text-amber-300" />
              <p className="text-[15px] font-bold tracking-tight text-amber-200">
                Delivery manual · 30–60 min
              </p>
            </div>
            <p className="mt-1.5 text-center text-[12.5px] leading-relaxed text-amber-200/70">
              Please wait. Your license key will be sent via Discord once the payment has been verified.
            </p>
          </motion.div>

          <div className="mx-auto mt-6 max-w-md rounded-3xl border border-white/[0.07] bg-panel p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Your Order ID</p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <code className="tabular font-mono text-xl font-bold tracking-wide text-gradient-blue">{orderId}</code>
              <CopyButton value={orderId ?? ""} />
            </div>
            <div className="mt-5 space-y-3 border-t border-white/[0.06] pt-5 text-left">
              {[
                { icon: BadgeCheck, text: "Payment is being reviewed by our team", accent: "text-accent-light" },
                { icon: MessageCircle, text: "Keep your Order ID ready for support", accent: "text-accent-light" },
              ].map((row, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                  <row.icon className={cn("mt-0.5 h-4 w-4 shrink-0", row.accent)} />
                  {row.text}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/" className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-8 text-sm font-semibold text-white transition-all duration-300 hover:bg-accent-light active:scale-[0.97] sm:w-auto">Back to Shop</Link>
            <Link href="/support" className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/[0.1] px-8 text-sm font-semibold text-zinc-200 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.05] active:scale-[0.97] sm:w-auto">
              <MessageCircle className="h-4 w-4" />Contact Support
            </Link>
          </div>

          <ReviewForm orderId={orderId} defaultName={discord} products={purchasedProducts} />
        </motion.div>
      </div>
    );
  }

  /* ── Normal checkout ── */
  return (
    <div className="relative mx-auto min-h-screen max-w-7xl px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      <div className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-accent/[0.06] blur-[120px]" />
      <div className="relative mb-12 text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Checkout</h1>
        <p className="mt-2 text-sm text-zinc-500">Secure and encrypted — done in under 2 minutes.</p>
        <div className="mx-auto mt-8 flex max-w-md items-center">
          {[{ n: 1, label: "Overview" }, { n: 2, label: "Payment" }, { n: 3, label: "Confirmation" }].map((s, i) => (
            <div key={s.n} className={cn("flex items-center", i > 0 && "flex-1")}>
              {i > 0 && <div className="relative mx-2 h-px flex-1 bg-white/[0.08]"><div className="absolute inset-y-0 left-0 bg-accent transition-all duration-700" style={{ width: step >= s.n ? "100%" : "0%" }} /></div>}
              <div className="flex flex-col items-center gap-1.5">
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all duration-500",
                  step >= s.n ? "border-accent bg-accent text-white shadow-[0_0_20px_-4px_rgba(37,99,235,0.6)]" : "border-white/[0.12] text-zinc-500")}>
                  {step > s.n ? <Check className="h-4 w-4" strokeWidth={3} /> : s.n}
                </div>
                <span className={cn("text-[11px] font-medium", step >= s.n ? "text-zinc-300" : "text-zinc-600")}>{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative grid items-start gap-6 lg:grid-cols-[1fr_400px]">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="space-y-4">
              <div className="rounded-3xl border border-white/[0.06] bg-panel p-6 sm:p-7">
                <h2 className="mb-5 font-display text-lg font-semibold tracking-tight">Your Order</h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.key} className="flex items-center gap-4 rounded-2xl border border-white/[0.05] bg-abyss p-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-carbon"><LogoMark size={24} /></div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{item.name}</p>
                        <p className="text-xs text-zinc-500">{item.variantLabel} · {item.qty}× {formatEUR(item.price)}</p>
                      </div>
                      <p className="tabular text-sm font-semibold">{formatEUR(item.price * item.qty)}</p>
                      <button onClick={() => removeItem(item.key)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-red-500/10 hover:text-red-400" aria-label={`Remove ${item.name}`}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-white/[0.06] bg-panel p-6 sm:p-7">
                <h2 className="mb-1.5 font-display text-lg font-semibold tracking-tight">Delivery via Discord</h2>
                <p className="mb-5 text-sm text-zinc-500">Your key and all updates will be delivered directly via Discord.</p>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">Discord Username *</label>
                <input type="text" value={discord} onChange={(e) => { setDiscord(e.target.value); if (errors.discord) setErrors({}); }} placeholder="e.g. username" autoComplete="off" className={inputClass(!!errors.discord)} />
                <FieldError message={errors.discord} />
              </div>
              <button onClick={() => { if (validateStep1()) setStep(2); }} className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-accent text-[15px] font-semibold text-white transition-all duration-300 hover:bg-accent-light hover:shadow-[0_12px_40px_-8px_rgba(37,99,235,0.6)] active:scale-[0.98]">
                Continue to Payment<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </motion.div>
          ) : (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="space-y-4">
              <div className="rounded-3xl border border-white/[0.06] bg-panel p-6 sm:p-7">
                <h2 className="mb-5 font-display text-lg font-semibold tracking-tight">Choose Payment Method</h2>
                <div className="grid grid-cols-2 gap-3">
                  {METHODS.map((m) => (
                    <button key={m.id} onClick={() => { setMethod(m.id); setErrors({}); }}
                      className={cn("group relative flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-300 active:scale-[0.98]",
                        method === m.id ? "border-accent/60 bg-accent/[0.08] shadow-[0_0_0_1px_rgba(37,99,235,0.4),0_12px_32px_-12px_rgba(37,99,235,0.4)]" : "border-white/[0.07] bg-abyss hover:border-white/[0.16]")}>
                      {method === m.id && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-accent"><Check className="h-3 w-3 text-white" strokeWidth={3.5} /></motion.span>}
                      <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl border font-display text-[15px] font-bold transition-colors",
                        method === m.id ? "border-accent/40 bg-accent/15 text-accent-glow" : "border-white/[0.08] bg-carbon text-zinc-300")}>{m.mono}</span>
                      <span><span className="block text-sm font-semibold text-white">{m.name}</span><span className="block text-[11.5px] text-zinc-500">{m.note}</span></span>
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {method && (
                  <motion.div key={method} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="rounded-3xl border border-accent/20 bg-panel p-6 sm:p-7">
                    {(method === "ltc" || method === "sol") && (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-abyss px-4 py-3">
                          <span className="text-sm text-zinc-400">Amount to pay</span>
                          <span className="text-right"><span className="tabular block font-mono text-sm font-bold text-white">{cryptoAmount}</span><span className="tabular block text-xs text-zinc-500">≈ {formatEUR(total)}</span></span>
                        </div>
                        <AddressBox label={`${method === "ltc" ? "Litecoin" : "Solana"} Address`} value={ADDRESSES[method]} />
                        <div className="flex items-center gap-5">
                          <div className="shrink-0 rounded-2xl bg-white p-2.5 shadow-[0_8px_30px_-8px_rgba(255,255,255,0.15)]"><QRCode value={ADDRESSES[method]} size={96} fgColor="#0A0A0B" /></div>
                          <p className="text-[13px] leading-relaxed text-zinc-400">Scan the QR code or copy the address. Send the amount and then enter the <span className="font-medium text-white">Transaction Hash</span> of your transfer.</p>
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">Transaction Hash (TXID) *</label>
                          <input type="text" value={txHash} onChange={(e) => { setTxHash(e.target.value); if (errors.payment) setErrors({}); }} placeholder="e.g. 9f4e2a1c7b3d…" autoComplete="off" spellCheck={false} className={cn(inputClass(!!errors.payment), "font-mono text-[13px]")} />
                          <FieldError message={errors.payment} />
                        </div>
                      </div>
                    )}
                    {method === "paypal" && (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-abyss px-4 py-3"><span className="text-sm text-zinc-400">Amount to pay</span><span className="tabular font-mono text-sm font-bold text-white">{formatEUR(total)}</span></div>
                        <AddressBox label="PayPal Recipient" value={PAYPAL_EMAIL} />
                        <div className="flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] px-4 py-3.5"><Wallet className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-300" /><p className="text-[13px] leading-relaxed text-amber-200/90">Please send the amount via <span className="font-semibold">&quot;Friends &amp; Family&quot;</span> to avoid fees. Afterwards you&apos;ll receive a 16-digit transaction code from PayPal.</p></div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">16-digit PayPal Code *</label>
                          <input type="text" inputMode="numeric" value={formatCode16(code)} onChange={(e) => { setCode(onlyDigits(e.target.value)); if (errors.payment) setErrors({}); }} placeholder="0000 0000 0000 0000" autoComplete="off" className={cn(inputClass(!!errors.payment), "tabular font-mono tracking-[0.12em]")} />
                          <div className="mt-1.5 flex items-center justify-between"><FieldError message={errors.payment} /><span className="tabular ml-auto text-xs text-zinc-600">{code.length}/16</span></div>
                        </div>
                      </div>
                    )}
                    {method === "paysafecard" && (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-abyss px-4 py-3"><span className="text-sm text-zinc-400">Amount to pay</span><span className="tabular font-mono text-sm font-bold text-white">{formatEUR(total)}</span></div>
                        <div className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-abyss px-4 py-3.5"><CreditCard className="mt-0.5 h-4.5 w-4.5 shrink-0 text-accent-light" /><p className="text-[13px] leading-relaxed text-zinc-400">Enter the 16-digit PIN from your Paysafecard. The balance must fully cover the order amount of <span className="font-semibold text-white">{formatEUR(total)}</span>.</p></div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">Paysafecard PIN (16 digits) *</label>
                          <input type="text" inputMode="numeric" value={formatCode16(code)} onChange={(e) => { setCode(onlyDigits(e.target.value)); if (errors.payment) setErrors({}); }} placeholder="0000 0000 0000 0000" autoComplete="off" className={cn(inputClass(!!errors.payment), "tabular font-mono tracking-[0.12em]")} />
                          <div className="mt-1.5 flex items-center justify-between"><FieldError message={errors.payment} /><span className="tabular ml-auto text-xs text-zinc-600">{code.length}/16</span></div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {status === "error" && serverError && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/[0.08] px-4 py-3.5">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                    <div><p className="text-sm font-semibold text-red-300">Order failed</p><p className="mt-0.5 text-[13px] text-red-200/80">{serverError}</p></div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button onClick={() => setStep(1)} className="flex h-[52px] items-center justify-center gap-2 rounded-full border border-white/[0.1] px-7 text-sm font-semibold text-zinc-300 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.04] active:scale-[0.98] sm:w-auto"><ArrowLeft className="h-4 w-4" />Back</button>
                <button onClick={submitOrder} disabled={!method} className={cn("flex h-[52px] flex-1 items-center justify-center gap-2 rounded-full text-[15px] font-semibold transition-all duration-300 active:scale-[0.98]",
                  method ? "bg-accent text-white hover:bg-accent-light hover:shadow-[0_12px_40px_-8px_rgba(37,99,235,0.6)]" : "cursor-not-allowed bg-white/[0.05] text-zinc-600")}>
                  <Lock className="h-4 w-4" />Place Order · {formatEUR(total)}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right: Summary */}
        <motion.aside initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="sticky top-24 rounded-3xl border border-white/[0.06] bg-panel p-6 sm:p-7">
          <h2 className="mb-5 font-display text-lg font-semibold tracking-tight">Summary</h2>
          <div className="space-y-3">{items.map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-zinc-400">{item.name} <span className="text-zinc-600">· {item.variantLabel}</span>{item.qty > 1 && <span className="text-zinc-600"> ×{item.qty}</span>}</span>
              <span className="tabular shrink-0 font-medium text-zinc-200">{formatEUR(item.price * item.qty)}</span>
            </div>
          ))}</div>
          <div className="mt-5 space-y-2.5 border-t border-white/[0.06] pt-5 text-sm">
            <div className="flex justify-between"><span className="text-zinc-500">Subtotal</span><span className="tabular">{formatEUR(total)}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Delivery</span><span className="flex items-center gap-1 font-medium text-emerald-400"><Clock className="h-3 w-3" />Digital · 30–60 min</span></div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
            <span className="font-display text-base font-semibold">Total</span>
            <span className="tabular font-display text-[22px] font-bold text-gradient">{formatEUR(total)}</span>
          </div>
          <div className="mt-6 space-y-2.5 rounded-2xl border border-white/[0.05] bg-abyss p-4">
            {[
              { icon: Lock, text: "SSL-encrypted transmission" },
              { icon: BadgeCheck, text: "Secure review of every order" },
              { icon: MessageCircle, text: "Secure delivery via Discord" },
            ].map((row, i) => (
              <p key={i} className="flex items-center gap-2.5 text-[12.5px] text-zinc-500"><row.icon className="h-3.5 w-3.5 shrink-0 text-accent-light" />{row.text}</p>
            ))}
          </div>
        </motion.aside>
      </div>

      {/* Loading overlay */}
      <AnimatePresence>
        {status === "loading" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-center justify-center bg-abyss/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="flex flex-col items-center gap-6 rounded-3xl border border-white/[0.07] bg-panel px-12 py-10 text-center shadow-2xl">
              <div className="relative flex h-16 w-16 items-center justify-center"><div className="absolute inset-0 animate-spin rounded-full border-2 border-white/[0.08] border-t-accent" /><LogoMark size={34} /></div>
              <div>
                <AnimatePresence mode="wait"><motion.p key={loadingMsg} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="font-display text-[15px] font-semibold text-white">{LOADING_MESSAGES[loadingMsg]}</motion.p></AnimatePresence>
                <p className="mt-1.5 text-xs text-zinc-500">Please do not close this window.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
