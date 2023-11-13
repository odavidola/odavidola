import './globals.css'
import clsx from 'clsx';
import type {Metadata} from 'next'
import localFont from 'next/font/local';

import Navbar from "@/app/components/navbar";
import React from "react";
import Head from "next/head";

const graphik = localFont({
  src: [
    {
      path: '../public/fonts/Graphik-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Graphik-Medium.ttf',
      weight: '600',
      style: 'bold',
    },
  ],
  variable: '--font-graphik',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://odola.xyz'),
  title: 'odavidola',
  description: 'Portfolio of a budding creator...',
  robots: {
    index: true,
    follow: true
  }
}

export default function RootLayout(
  {
    children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <html lang="en" className={clsx(
      'text-black bg-white dark:text-white dark:bg-[#111010] border border-white m-5',
      graphik.variable
    )}>
    <Head>
      <title>David Olagunju - Creator & Developer</title>
      <link rel="icon" href="favicon.ico"/>
    </Head>
    <body>
    <div className="flex min-h-screen bg-noise text-white">
      <Navbar/>
      <main className="w-3/4 p-10 h-screen">
        {children}
      </main>
    </div>
    </body>
    </html>
  )
}