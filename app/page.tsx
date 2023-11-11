import Head from 'next/head';
import React from 'react';

const HomePage: React.FC = () => {
    return (
        <>
            <Head>
                <title>David Olagunju - Designer & Developer</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div className="flex min-h-screen bg-black text-white">
                {/* Navigation Bar */}
                <nav className="w-1/4 min-h-screen border-r border-gray-800">
                    <div className="flex flex-col justify-between p-10 h-screen">
                        {/* Logo or Title */}
                        <div>
                            <h1 className="text-4xl font-bold mb-10">David Olagunju</h1>
                            <h2 className="text-2xl font-light mb-10">Designer & Developer</h2>
                        </div>
                        {/* Navigation Links */}
                        <div>
                            <ul className="flex flex-col gap-4">
                                <li><a href="#projects" className="hover:text-gray-300">Projects</a></li>
                                <li><a href="#blog" className="hover:text-gray-300">Blogs</a></li>
                            </ul>
                        </div>
                        {/* Toggle Theme */}
                        <div>
                            <button className="text-xs">LIGHT / DARK</button>
                        </div>
                    </div>
                </nav>
                {/* Content Section */}
                <main className="w-3/4 p-10">
                    <section id="intro">
                        {/* Replace with your actual image path */}
                        <div className="text-sm mt-10">
                            <p>Born in 1996 in Ibadan, Nigeria.</p>
                            <p>I believe web design can be more diverse and inspiring.</p>
                            <p>With a mission to present the possibilities of web design, I am pursuing new expressions
                                through experiments and thoughts.</p>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
};

export default HomePage;
