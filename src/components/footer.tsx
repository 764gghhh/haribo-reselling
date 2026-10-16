import Link from "next/link";
import { Clock, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { Logo } from "./logo";

const PRODUCT_LINKS = [
  "Ham Protector",
  "Ham Executor",
  "Vanity Menu",
  "Ambani Menu",
  "Susano",
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-carbon/50">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link href="/" aria-label="Back to Haribo Resseling home">
              <Logo />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-400">
              Premium FiveM tools — delivery in 30–60 minutes.
              Over 245 happy customers and counting.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["LTC", "SOL", "PayPal", "Paysafecard"].map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1 text-[11.5px] font-medium text-zinc-400"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Products
            </h3>
            <ul className="space-y-2.5">
              {PRODUCT_LINKS.map((name) => (
                <li key={name}>
                  <Link
                    href="/#products"
                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Legal
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/impressum" className="text-sm text-zinc-400 transition-colors hover:text-white">
                  Imprint
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-sm text-zinc-400 transition-colors hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-zinc-400 transition-colors hover:text-white">
                  Support & FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Support
            </h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-accent-light" />
                <a href="mailto:rankedgiyu@gmail.com" className="transition-colors hover:text-white">
                  rankedgiyu@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 shrink-0 text-accent-light" />
                Discord support after purchase
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-accent-light" />
                24/7 available · Ø response &lt; 30 min
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                <span className="text-emerald-300">All systems operational</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-[13px] text-zinc-500">
            © 2026 Haribo Resseling. All rights reserved.
          </p>
          <p className="text-center text-[12px] text-zinc-600 sm:text-right">
            Demo & portfolio project · No actual goods are shipped.
          </p>
        </div>
      </div>
    </footer>
  );
}
