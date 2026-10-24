import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "GlowHacks – Free Aesthetic Tools for Skincare, Style & Wellness",
    template: "%s | GlowHacks",
  },
  description:
    "30 free, private, browser-based tools for skincare, fashion, design, wellness and everyday life. No sign-up. Your data never leaves your device.",
  openGraph: {
    title: "GlowHacks",
    description: siteConfig.tagline,
    type: "website",
    siteName: "GlowHacks",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${poppins.variable} font-sans`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
