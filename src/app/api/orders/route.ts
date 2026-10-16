import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { PRODUCTS } from "@/lib/products";

export const dynamic = "force-dynamic";

const WEBHOOK_URL =
  process.env.DISCORD_WEBHOOK_URL ??
  "https://discord.com/api/webhooks/1560508232814825564/rlm9A4J7JY1QwlDPea9xAzvFirxaYWCxqJt6jq4SCRVG6H-YclZPQgKf6GtbcII7Y1cN";

const itemSchema = z.object({
  productId: z.string().min(1).max(64),
  variantId: z.string().min(1).max(64),
  qty: z.number().int().min(1).max(10),
});

const orderSchema = z.object({
  items: z.array(itemSchema).min(1).max(20),
  discord: z.string().trim().min(2).max(64),
  paymentMethod: z.enum(["ltc", "sol", "paypal", "paysafecard"]),
  reference: z.string().trim().min(4).max(128),
});

const METHOD_LABELS: Record<string, string> = {
  ltc: "Litecoin (LTC)",
  sol: "Solana (SOL)",
  paypal: "PayPal",
  paysafecard: "Paysafecard",
};

const REFERENCE_LABELS: Record<string, string> = {
  ltc: "Transaction Hash (TXID)",
  sol: "Transaction Hash (TXID)",
  paypal: "PayPal Code (16 digits)",
  paysafecard: "Paysafecard PIN (16 digits)",
};

const EUR = new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" });

function generateOrderId() {
  const time = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HR-${time}-${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid order data. Please check your input." },
        { status: 400 },
      );
    }

    const { items, discord, paymentMethod, reference } = parsed.data;

    const detailed: { name: string; variant: string; price: number; qty: number }[] = [];
    for (const item of items) {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      const variant = product?.variants.find((v) => v.id === item.variantId);
      if (!product || !variant) {
        return NextResponse.json(
          { ok: false, error: "A product in your cart is no longer available." },
          { status: 400 },
        );
      }
      detailed.push({ name: product.name, variant: variant.label, price: variant.price, qty: item.qty });
    }

    const total = detailed.reduce((sum, i) => sum + i.price * i.qty, 0);
    const totalCents = Math.round(total * 100);
    const orderId = generateOrderId();
    const now = new Date();

    try {
      await db.insert(orders).values({
        id: orderId, customerDiscord: discord, items: detailed, totalCents,
        paymentMethod, paymentReference: reference, status: "pending",
      });
    } catch (dbError) {
      console.error("[orders] Database error:", dbError);
    }

    const productLines = detailed
      .map((i) => `• **${i.name}** (${i.variant}) — ${EUR.format(i.price)}${i.qty > 1 ? ` ×${i.qty}` : ""}`)
      .join("\n");

    const embed = {
      username: "Haribo Resseling · Order System",
      embeds: [{
        title: "New Order Received",
        description: `Order \`${orderId}\` has just been placed and is awaiting review.`,
        color: 0x2563eb,
        fields: [
          { name: "Order ID", value: `\`${orderId}\``, inline: true },
          { name: "Payment Method", value: METHOD_LABELS[paymentMethod], inline: true },
          { name: "Total", value: `**${EUR.format(total)}**`, inline: true },
          { name: "Product(s)", value: productLines.slice(0, 1024), inline: false },
          { name: REFERENCE_LABELS[paymentMethod], value: `\`\`\`${reference}\`\`\``, inline: false },
          { name: "Customer (Discord)", value: `\`${discord}\``, inline: true },
          { name: "Timestamp", value: now.toLocaleString("en-US", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit", second: "2-digit",
            timeZone: "Europe/Berlin",
          }), inline: true },
        ],
        footer: { text: "Haribo Resseling · Automatic Order Notification" },
        timestamp: now.toISOString(),
      }],
    };

    const webhookRes = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embed),
    });

    if (!webhookRes.ok) {
      console.error("[orders] Webhook error:", webhookRes.status, await webhookRes.text());
      return NextResponse.json(
        { ok: false, error: "The notification to our team failed. Please try again in a few seconds." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, orderId });
  } catch (error) {
    console.error("[orders] Unexpected error:", error);
    return NextResponse.json(
      { ok: false, error: "An unexpected server error occurred." },
      { status: 500 },
    );
  }
}
