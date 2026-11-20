import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Roboto_Flex, Instrument_Sans, DM_Mono, Newsreader } from "next/font/google";
import React from "react";
import { Analytics } from "@vercel/analytics/react";
import { SiteHeader } from "@/app/components/site-header";

const display = Roboto_Flex({ subsets: ["latin"], axes: ["wdth"], variable: "--font-display", display: "swap" });
const body = Instrument_Sans({ subsets: ["latin"], axes: ["wdth"], variable: "--font-body", display: "swap" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });
const serif = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });

const TITLE = "David Olagunju — Senior Engineer & Creator";
const DESCRIPTION = "Senior Engineer & Creator in London. Eight years building front-office trading systems at Marex, JPMorgan and BNP Paribas. Creator of Moko, a live audio-ML piano teacher, and Ebb, an on-device iOS app.";

export const metadata: Metadata = {
  metadataBase: new URL("https://odavidola.com"),
  title: TITLE,
  description: DESCRIPTION,
  keywords: "David Olagunju, AI product engineer, senior software engineer, full stack, React, TypeScript, Python, Swift, London",
  authors: [{ name: "David Olagunju", url: "https://odavidola.com" }],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "https://odavidola.com", siteName: "David Olagunju", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: "@ODavidOlagunju" },
};

export const viewport: Viewport = { themeColor: "#f9f9f6", colorScheme: "light", viewportFit: "cover" };

const PERSON = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "David Olagunju",
  url: "https://odavidola.com",
  jobTitle: "Senior Engineer & Creator",
  address: { "@type": "PostalAddress", addressLocality: "London", addressCountry: "GB" },
  knowsAbout: ["TypeScript", "React", "Python", "Swift", "Applied AI", "Audio machine learning"],
  sameAs: ["https://github.com/odavidola", "https://www.linkedin.com/in/david-olagunju-143aa8a7/", "https://twitter.com/ODavidOlagunju"],
};

/** Prefetch and prerender what a visitor is about to open: the work, then the live app. */
const SPECULATION = { prefetch: [{ where: { href_matches: "/*" }, eagerness: "moderate" }] };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} ${serif.variable}`}>
      <body>
        <a href="#moko" className="skip">Skip to the work</a>
        <div className="progress" aria-hidden="true" />
        <SiteHeader />
        <main>{children}</main>
        <Analytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON) }} />
        <script type="speculationrules" dangerouslySetInnerHTML={{ __html: JSON.stringify(SPECULATION) }} />
      </body>
    </html>
  );
}
