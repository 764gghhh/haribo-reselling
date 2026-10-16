import type { ReactNode } from "react";

export function LegalShell({ eyebrow, title, updated, children }: { eyebrow: string; title: string; updated?: string; children: ReactNode }) {
  return (
    <div className="relative mx-auto max-w-3xl px-5 pb-24 pt-32 sm:px-8 sm:pt-36">
      <div className="absolute left-1/2 top-0 h-[280px] w-[520px] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[110px]" />
      <div className="relative">
        <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-accent-light">{eyebrow}</p>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-[42px]">{title}</h1>
        {updated && <p className="mt-3 text-sm text-zinc-500">{updated}</p>}
        <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-zinc-400">{children}</div>
      </div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (<section><h2 className="mb-3 font-display text-lg font-semibold tracking-tight text-white">{title}</h2>{children}</section>);
}

export function DemoNotice() {
  return (
    <div className="rounded-2xl border border-accent/25 bg-accent/[0.07] px-5 py-4 text-sm text-zinc-300">
      <span className="font-semibold text-accent-glow">Notice:</span> This page is part of a demo/portfolio project. All information is fictional and no actual commerce takes place.
    </div>
  );
}
