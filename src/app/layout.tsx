import type { Metadata } from "next";
import { Arimo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Arimo({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ftg.vc"),
  title: "First Tech Group — Engineering what comes next",
  description:
    "First Tech Group is the infrastructure layer for the digital economy — markets, money, and intelligence, owned as one stack. Work with us, or pitch us.",
  icons: { icon: "/favicon.png" },
  openGraph: {
    title: "First Tech Group — Engineering what comes next",
    description: "The infrastructure layer for the digital economy. Markets · Money · Intelligence.",
    url: "https://www.ftg.vc",
    siteName: "First Tech Group",
    images: ["/og.png"],
    type: "website",
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        {/* Without JS the scroll-reveal never runs — keep all content visible. */}
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: ".reveal{opacity:1 !important;transform:none !important}" }} />
        </noscript>
        {children}
      </body>
    </html>
  );
}
