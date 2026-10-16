export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const eurFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

export function formatEUR(value: number) {
  return eurFormatter.format(value);
}

const numberFormatter = new Intl.NumberFormat("de-DE");

export function formatNumber(value: number) {
  return numberFormatter.format(value);
}

/** Deterministischer Zufallszahlengenerator (mulberry32) für reproduzierbare Review-Slots. */
export function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Formatiert einen 16-stelligen Code in Vierergruppen: 1234 5678 9012 3456 */
export function formatCode16(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function onlyDigits(raw: string, max = 16) {
  return raw.replace(/\D/g, "").slice(0, max);
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
