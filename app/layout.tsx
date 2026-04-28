import "./globals.css";

import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/react";

import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";

const font = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Car Importers — Premium Imported Vehicles UK",
    template: "%s | Car Importers",
  },
  description:
    "Browse our curated selection of premium imported vehicles at competitive prices. Quality assured, UK-wide delivery.",
  metadataBase: new URL(siteConfig.site_domain),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteConfig.site_domain,
    siteName: siteConfig.site_name,
    title: "Car Importers — Premium Imported Vehicles UK",
    description:
      "Browse our curated selection of premium imported vehicles at competitive prices. Quality assured, UK-wide delivery.",
    images: [{ url: "/api/og?title=Car+Importers&description=Premium+Imported+Vehicles+UK", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Car Importers — Premium Imported Vehicles UK",
    description:
      "Browse our curated selection of premium imported vehicles at competitive prices. Quality assured, UK-wide delivery.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen font-sans antialiased overflow-x-hidden", font.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Nav />
            <main className="min-h-[60vh] overflow-x-hidden">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
