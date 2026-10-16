import { useId } from "react";
import { cn } from "@/lib/utils";

export function LogoMark({ size = 36, className }: { size?: number; className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`hg-${id}`} x1="6" y1="4" x2="34" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="0.55" stopColor="#2563EB" />
          <stop offset="1" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="11"
        fill="#0C0C0E"
        stroke={`url(#hg-${id})`}
        strokeOpacity="0.85"
        strokeWidth="1.4"
      />
      <path
        d="M13.5 11.5v17M26.5 11.5v17M13.5 20h13"
        stroke={`url(#hg-${id})`}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark size={compact ? 32 : 36} />
      <span className="font-display text-[17px] font-semibold tracking-tight text-white">
        Haribo <span className="text-gradient-blue">Resseling</span>
      </span>
    </span>
  );
}
