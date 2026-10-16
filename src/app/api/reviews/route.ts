import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { PRODUCTS } from "@/lib/products";

export const dynamic = "force-dynamic";

const reviewSchema = z.object({
  orderId: z.string().trim().max(40).optional(),
  name: z.string().trim().min(2).max(48),
  product: z.string().trim().min(2).max(60),
  rating: z.number().int().min(1).max(5),
  text: z.string().trim().min(10).max(600),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid review data. Please check your input." },
        { status: 400 },
      );
    }

    const { orderId, name, product, rating, text } = parsed.data;

    if (!PRODUCTS.some((p) => p.name === product)) {
      return NextResponse.json(
        { ok: false, error: "Unknown product." },
        { status: 400 },
      );
    }

    const id = `RV-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36).slice(2, 6).toUpperCase()}`;

    await db.insert(reviews).values({
      id, orderId: orderId ?? null, authorName: name, product, rating, content: text,
    });

    return NextResponse.json({ ok: true, id });
  } catch (error) {
    console.error("[reviews] Unexpected error:", error);
    return NextResponse.json(
      { ok: false, error: "Your review could not be saved." },
      { status: 500 },
    );
  }
}
