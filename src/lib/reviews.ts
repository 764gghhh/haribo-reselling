import { mulberry32 } from "./utils";

export type Review = {
  id: string;
  name: string;
  rating: number;
  product: string;
  text: string;
  date: Date;
  verified: boolean;
  own?: boolean;
};

const TOTAL_REVIEWS = 81; // 3 pages × 27 reviews
const PER_PAGE = 27;

const NAMES = [
  "Lukas M.", "Jonas K.", "Finn H.", "Leon S.", "Max P.", "Paul W.",
  "Felix B.", "Niklas T.", "Tim R.", "Jan L.", "Marvin D.", "Luca G.",
  "Ben A.", "Tom E.", "Julian F.", "David N.", "Nico V.", "Fabian Z.",
  "Emre K.", "Justin R.", "Adrian W.", "Mats D.", "Lenny P.", "Ole M.",
  "stffn_", "dxnny.gg", "y3lvin", "mx.vaan", "justinbtw", "tobsen",
  "kev1n", "nlyze", "plqtic", "jeezuz_", "vinnxy", "notmxrks",
  "simwn", "aadrii", "vlex.gg", "byLu_", "wxltxr", "lcnz",
  "mrvn.", "timoooo", "schmidd1", "pazify", "k4i", "lenn.rt",
  "rxnzo", "fxbixn", "xmxr.gg", "lxrenz", "nvchts", "prxxy",
  "flxkz", "crxzzy_", "nxck.re", "dvniel", "imjxn", "sxbastiian",
  "dxrk.gg", "txy.", "zyrox_", "nxilo", "hxnnes", "mvxi",
  "clxudy", "rxbin.gg", "cxspar", "skyzn", "jxkez_", "nvno",
  "hydr4", "blxze", "rxdix.gg", "svxy", "onkxl", "grxzy",
  "mxxs", "lveon", "plvto_",
];

const PRODUCT_NAMES = [
  "Ham Executor",
  "Ham Protector",
  "Vanity",
  "Ambani",
  "Nexus",
  "Vortex",
];

/** Generate all reviews deterministically. */
function generateAllReviews(): Review[] {
  const rng = mulberry32(420691337);
  const reviews: Review[] = [];
  const baseDate = Date.UTC(2026, 9, 15, 12, 0, 0);

  for (let i = 0; i < TOTAL_REVIEWS; i++) {
    const nameIdx = Math.floor(rng() * NAMES.length);
    const product = PRODUCT_NAMES[Math.floor(rng() * PRODUCT_NAMES.length)];
    const hoursAgo = Math.floor(rng() * 24 * 60) + 2; // 2h – 60 days ago

    reviews.push({
      id: `r-${i}`,
      name: NAMES[nameIdx],
      rating: 5,
      product,
      text: "Automatic feedback after 7 days.",
      date: new Date(baseDate - hoursAgo * 60 * 60_000),
      verified: true,
    });
  }

  return reviews.sort((a, b) => b.date.getTime() - a.date.getTime());
}

let _cached: Review[] | null = null;
function allReviews(): Review[] {
  if (!_cached) _cached = generateAllReviews();
  return _cached;
}

/** Get reviews for a specific page (1-indexed). */
export function getReviewsPage(page: number): Review[] {
  const all = allReviews();
  const start = (page - 1) * PER_PAGE;
  return all.slice(start, start + PER_PAGE);
}

export function getTotalPages() {
  return Math.ceil(TOTAL_REVIEWS / PER_PAGE);
}

export function getReviewStats() {
  return { total: TOTAL_REVIEWS, average: 5 };
}

export function formatReviewDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

/* ── User reviews (local) ──────────────────────────────────────── */
const USER_REVIEWS_KEY = "hr-user-reviews-v1";

export function loadUserReviews(): Review[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USER_REVIEWS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<Omit<Review, "date"> & { date: string }>;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((r) => r && typeof r.text === "string" && r.date)
      .map((r) => ({ ...r, rating: 5, date: new Date(r.date), own: true, verified: true }));
  } catch { return []; }
}

export function saveUserReview(review: Review) {
  if (typeof window === "undefined") return;
  try {
    const existing = loadUserReviews();
    const next = [{ ...review, rating: 5 }, ...existing].slice(0, 10);
    localStorage.setItem(USER_REVIEWS_KEY, JSON.stringify(next));
  } catch { /* ignore */ }
}

export function makeUserReviewId() {
  return `own-${Date.now().toString(36)}`;
}
