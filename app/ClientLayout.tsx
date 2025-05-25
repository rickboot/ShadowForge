/*
  This page needed because logic requires client...
  but Nextjs requires Metadata to be SSR. Hence layout.tsx > ClientLayout.tsx
*/
// 'use client';
// import NavBar from './NavBar';

// export default function ClientLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const [theme, setTheme] = useState<'dark' | 'light'>('dark');

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
//     const system = window.matchMedia('(prefers-color-scheme: dark)').matches;
//     const darkMode = savedTheme === 'dark' || (!savedTheme && system);
//     document.documentElement.classList.toggle('dark', darkMode);
//   }, []);

//   useEffect(() => {
//     const htmlTag = document.documentElement;
//     if (theme === 'dark') {
//       htmlTag.classList.add('dark');
//     } else {
//       htmlTag.classList.remove('dark');
//     }
//     localStorage.setItem('theme', theme);
//   }, [theme]);

//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
//   };

//   return (
//     <div>
//       <header>
//         <NavBar theme={theme} toggleTheme={toggleTheme} />
//       </header>

//       <main>{children}</main>

//       <footer
//         className="border-t py-4 text-center text-sm"
//         style={{
//           borderColor: 'var(--border)',
//         }}
//       >
//         &copy; 2025 Rick Allen. Convert responsibly.
//       </footer>
//     </div>
//   );
// }
'use client';
import NavBar from './NavBar';
import { useEffect, useState } from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const system = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(system ? 'dark' : 'light');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const htmlTag = document.documentElement;
    if (theme === 'dark') {
      htmlTag.classList.add('dark');
    } else {
      htmlTag.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <header>
        <NavBar theme={theme} toggleTheme={toggleTheme} />
      </header>
      <main>{children}</main>
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
