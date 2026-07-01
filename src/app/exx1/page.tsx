import type { Metadata } from "next";
import { ProductPage } from "@/components/marketing/ProductPage";
import { getProduct } from "@/content/products";
import { buildMetadata } from "@/lib/seo";

const product = getProduct("exx1")!;

export const metadata: Metadata = buildMetadata({
  title: product.metaTitle,
  description: product.metaDescription,
  path: "/exx1",
  image: "/og.png",
  keywords: ["Exx1", "digital-asset exchange", "crypto exchange", "matching engine", "custody", "FTG"],
});

export default function Page() {
  return <ProductPage product={product} />;
}
