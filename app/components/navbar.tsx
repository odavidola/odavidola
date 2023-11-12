'use client';
import React from "react";
import Link from "next/link";
import Image from 'next/image';
import {usePathname} from 'next/navigation';
import basketballBrain from '../favicon.ico';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {name: 'Home', path: '/'},
    {name: 'Projects', path: '/projects'},
    {name: 'Blogs', path: '/blogs'},
  ];

  return (
    <aside>
      <nav className="min-h-screen border-r border-gray-800">
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

          <div className="flex">
            {/* Toggle Theme */}
            <div className="transform-matrix">
              <button className="text-xs">LIGHT / DARK</button>
            </div>
            <div className="relative mx-auto mt-5 animate-bounce">
              <Image
                src={basketballBrain}
                alt="Basketball brain"
                height={20}
                width={20}
                className="rounded-lg object-cover"
              />
            </div>

          </div>

        </div>
      </nav>
    </aside>
  );
}


