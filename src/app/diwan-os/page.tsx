import type { Metadata } from "next";
import { ProductPage } from "@/components/marketing/ProductPage";
import { getProduct } from "@/content/products";
import { buildMetadata } from "@/lib/seo";

const product = getProduct("diwan-os")!;

export const metadata: Metadata = buildMetadata({
  title: product.metaTitle,
  description: product.metaDescription,
  path: "/diwan-os",
  image: "/og.png",
  keywords: ["Diwan OS", "Arabic-first AI", "AI operating system", "memory graph", "voice AI", "PRVAI", "FTG"],
});

export default function Page() {
  return <ProductPage product={product} />;
}
