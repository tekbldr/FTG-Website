import type { Metadata } from "next";
import { ProductPage } from "@/components/marketing/ProductPage";
import { getProduct } from "@/content/products";
import { buildMetadata } from "@/lib/seo";

const product = getProduct("prvai")!;

export const metadata: Metadata = buildMetadata({
  title: product.metaTitle,
  description: product.metaDescription,
  path: "/prvai",
  image: "/og.png",
  keywords: ["PRVAI", "applied AI", "Arabic-first AI", "voice AI", "memory graph", "Diwan OS", "PRV Copilot", "FTG"],
});

export default function Page() {
  return <ProductPage product={product} />;
}
