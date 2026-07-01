import type { Metadata } from "next";
import { ProductPage } from "@/components/marketing/ProductPage";
import { getProduct } from "@/content/products";
import { buildMetadata } from "@/lib/seo";

const product = getProduct("prv-wallet")!;

export const metadata: Metadata = buildMetadata({
  title: product.metaTitle,
  description: product.metaDescription,
  path: "/prv-wallet",
  image: "/og.png",
  keywords: ["PRV Wallet", "non-custodial wallet", "self-custody", "zero-knowledge", "privacy", "multichain", "FTG"],
});

export default function Page() {
  return <ProductPage product={product} />;
}
