'use client';
import React from "react";
import Link from "next/link";
import {usePathname} from 'next/navigation';
import {VideoHover} from "@/app/components/videohover";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {name: 'Home', path: '/'},
    {name: 'Projects', path: '/projects'},
    {name: 'Blogs', path: '/blogs'},
  ];

  return (
    <aside className="w-1/4">
      <nav className="min-h-screen">
        <div className="flex flex-col justify-between p-10 h-screen">
          {/* Logo or Title */}
          <div>
            <h1 className="text-4xl text-gray-300 mb-10">David Olagunju</h1>
            <h2 className="text-2xl text-gray-300 mb-10">Creator & Developer</h2>
          </div>
          {/* Navigation Links */}
          <div className="flex flex-col flex-grow justify-center">
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

          <div className="flex ">
            <div className="vertical-text text-white flex items-center text-xs">
              HIGHLIGHTS
            </div>
            <div className="w-18 h-18 ">
              <VideoHover src="/marseille.mov"/>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}


