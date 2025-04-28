/*
  This page needed because logic requires client... 
  but Nextjs requires Metadata to be SSR. Hence layout.tsx > ClientLayout.tsx
*/

'use client';
import { ToggleTheme } from '@/components/ui/ToggleThemeButton';
import { useEffect, useState } from 'react';

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
        className="flex items-start justify-between border-b px-12 py-4"
        style={{
          borderColor: 'var(--border)',
        }}
      >
        <div>
          <h1 className="font-serif text-4xl tracking-wide">ShadowForge</h1>
          <h2>Reforge D&D content for Shadowdark</h2>
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
