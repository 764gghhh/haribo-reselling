import { Hero } from "@/components/hero";
import { Trust } from "@/components/trust";
import { ProductsSection } from "@/components/products-section";
import { ReviewsSection } from "@/components/reviews-section";
import { CtaBand } from "@/components/cta-band";

export default function Home() {
  return (
    <>
      <Hero />
      <Trust />
      <ProductsSection />
      <ReviewsSection />
      <CtaBand />
    </>
  );
}
