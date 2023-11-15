'use client';
import React from "react";
import Link from "next/link";
import {usePathname} from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {name: 'Home', path: '/'},
    {name: 'Projects', path: '/projects'},
    {name: 'Blogs', path: '/blogs'},
  ];

  // TODO: embedded the youtube video and one picture firs
  // easter egg approach every 24 hours switch between my folder for now it's just 2 thing

  return (
    <aside className="w-1/4">
      <nav className="min-h-screen">
        <div className="flex flex-col justify-between p-10 h-screen">
          {/* Logo or Title */}
          <div>
            <h1 className="text-4xl font-light mb-10">David Olagunju</h1>
            <h2 className="text-2xl font-light mb-10">Creator & Developer</h2>
          </div>
          {/* Navigation Links */}
          <div className="flex flex-col">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} className="hover:text-gray-300">
                {pathname === item.path ? (
                  '•'
                ) : (
                  item.name
                )}
              </Link>
            ))}
          </div>
          {/*<div><VideoHover src="/IMG_1292.mov"/></div>*/}

          <div className="flex">
            <div className="vertical-text text-white flex items-center text-xs">
              HIGHLIGHTS
            </div>
            <div className="w-18 h-18 custom-hover-transform"
                 style={{width: "74px", height: "74px"}}>
              <div style={{position: 'relative', width: '100%', height: '100%'}}>
                <Image
                  src="/berlin2.png"
                  alt="X logo"
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}


