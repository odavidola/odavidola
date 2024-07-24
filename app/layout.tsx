import "./globals.css";
import clsx from "clsx";
import type { Metadata } from "next";

import Navbar from "@/app/components/navbar";
import React from "react";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  metadataBase: new URL("https://odola.xyz"),
  title: "David Olagunju - Creator & Developer",
  description:
    "Explore the portfolio of David Olagunju, a budding creator and developer.",
  keywords: "David Olagunju, creator, developer, portfolio",
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
    <html
      lang="en"
      className={clsx(
        "text-black bg-white dark:text-white dark:bg-[#111010] border border-white m-5",
      )}
    >
      <Head>
        <title>David Olagunju - Creator & Developer</title>
        <link rel="icon" href="favicon.ico" />
      </Head>
      <body>
        <div className="flex min-h-screen bg-noise text-white bg-cover bg-center bg-no-repeat z-[-1] overflow-auto">
          <Navbar />
          <main className="w-3/4 h-screen p-5">
            {children}
            <Analytics />
          </main>
        </div>
      </body>
    </html>
  );
}
