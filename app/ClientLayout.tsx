/*
  This page needed because logic requires client... 
  but Nextjs requires Metadata to be SSR. Hence layout.tsx > ClientLayout.tsx
*/
'use client';
import { ToggleTheme } from '@/components/ui/ToggleThemeButton';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    const htmlTag = document.documentElement;
    if (theme === 'dark') {
      htmlTag.classList.add('dark');
    } else {
      htmlTag.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div>
      <header
        className="flex items-center justify-between border-b px-5 py-3 md:px-12 md:py-4 "
        style={{
          borderColor: 'var(--border)',
        }}
      >
        <div className="flow-row flex items-center justify-start gap-4 ">
          <Link href="/" aria-label="Home">
            <div className="relative h-10 w-6">
              <Image
                src="/sf-logo-black.webp"
                alt="Shadowforge Logo"
                fill
                className="block object-contain dark:hidden"
              />
              <Image
                src="/sf-logo-white.webp"
                alt="Shadowforge Logo"
                fill
                className="hidden object-contain dark:block"
              />
            </div>
          </Link>

          <div className="flex flex-col pt-1">
            <h1 className="font-serif text-2xl tracking-wide md:text-3xl">
              ShadowForge
            </h1>
            <h2 className="hidden text-sm md:flex">
              Reforge D&D content for Shadowdark
            </h2>
          </div>
        </div>

        <div className="flex flex-col items-center gap-12 md:flex-row z-10">
          <nav className="hidden gap-8 md:flex">
            <Link href="/about" className="text-xl hover:underline">
              <span className="">About</span>
            </Link>
            <a
              href="mailto:rickallen@gmail.com"
              className="text-xl hover:underline"
            >
              Contact me
            </a>
          </nav>
          <ToggleTheme  toggleTheme={toggleTheme} theme={theme} />
        </div>
      </header>

      {children}

      <footer
        className="border-t py-4 text-center text-sm"
        style={{
          borderColor: 'var(--border)',
        }}
      >
        &copy; 2025 Rick Allen. Convert responsibly.
      </footer>
    </div>
  );
}
