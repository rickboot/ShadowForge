/*
  This page needed because logic requires client... 
  but Nextjs requires Metadata to be SSR. Hence layout.tsx > ClientLayout.tsx
*/
'use client';
import { ToggleTheme } from '@/components/ui/ToggleThemeButton';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
        className="flex items-center justify-between border-b px-12 py-4"
        style={{
          borderColor: 'var(--border)',
        }}
      >
        <div className="flow-row flex items-center justify-start gap-4">
          <Link href="/">
            <Image
              src="/sf-logo-black.webp"
              alt="Shadowforge Logo"
              width={40}
              height={20}
              className="block object-contain dark:hidden"
            />
            <Image
              src="/sf-logo-white.webp"
              alt="Shadowforge Logo"
              width={40}
              height={20}
              className="hidden object-contain dark:block"
            />
          </Link>
          <div className="flex flex-col pt-1">
            <h1 className="font-serif text-3xl tracking-wide">ShadowForge</h1>
            <h2 className="text-sm">Reforge D&D content for Shadowdark</h2>
          </div>
        </div>
        <ToggleTheme toggleTheme={toggleTheme} theme={theme} />
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
