import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { RouteGate } from "@/components/layout/RouteGate";
import { Footer } from "@/components/layout/Footer";
import { AppBackdrop } from "@/components/layout/AppBackdrop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const spaceGrotesk = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GuardFi AI — AI-Powered DeFi Risk Guardian on HashKey Chain",
  description:
    "AI-powered risk intelligence for safer DeFi on HashKey Chain. Scan tokens and contracts, generate AI risk reports, and anchor verifiable proofs on-chain.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} ${spaceGrotesk.variable}`}>
      <body>
        <Providers>
          <AppBackdrop>
            <SiteChrome />
            <main className="relative z-10">
              <RouteGate>{children}</RouteGate>
            </main>
            <Footer />
          </AppBackdrop>
        </Providers>
      </body>
    </html>
  );
}
