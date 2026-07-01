import type { Metadata } from "next";
import { ProductPage } from "@/components/marketing/ProductPage";
import { getProduct } from "@/content/products";
import { buildMetadata } from "@/lib/seo";

const product = getProduct("eqwt1")!;

export const metadata: Metadata = buildMetadata({
  title: product.metaTitle,
  description: product.metaDescription,
  path: "/eqwt1",
  image: "/brands/eqwt1/terminal.png",
  keywords: ["EQWT1", "trading platform", "forex", "CFDs", "crypto", "copy trading", "funded accounts", "FTG"],
});

export default function Page() {
  return <ProductPage product={product} />;
}
