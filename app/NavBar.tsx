import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ToggleThemeButton } from "@/components/ui/ToggleThemeButton";

export default function NavBar({
  theme,
  toggleTheme,
}: {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between border-b px-5 py-3 md:px-12 md:py-4 relative z-20">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group" aria-label="Home">
        <span className="relative h-10 w-6 md:h-16 md:w-10">
          <Image
            src="/sf-logo-black.webp"
            alt="Shadowforge Logo"
            fill
            className="block object-contain dark:hidden"
            priority
          />
          <Image
            src="/sf-logo-white.webp"
            alt="Shadowforge Logo"
            fill
            className="hidden object-contain dark:block"
            priority
          />
        </span>
        <span className="font-serif text-2xl tracking-wide md:text-3xl group-hover:underline">ShadowForge</span>
      </Link>

      {/* Desktop menu */}
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
          <ToggleThemeButton  toggleTheme={toggleTheme} theme={theme} />
        </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setMenuOpen((open) => !open)}
        className="md:hidden border rounded px-2 py-1 text-sm"
        aria-label="Open menu"
        aria-expanded={menuOpen}
      >
        <span className="sr-only">Open menu</span>
        &#9776;
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-5 top-4 w-44 rounded z-50 border flex flex-col bg-[var(--surface)]">
            <Link
              href="/"
              className="block px-4 py-2 hover:bg-[var(--button-hover-bg)] hover:text-[var(--button-text)]"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 hover:bg-[var(--button-hover-bg)] hover:text-[var(--button-text)]"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="mailto:rickallen@gmail.com"
              className="block px-4 py-2 hover:bg-[var(--button-hover-bg)] hover:text-[var(--button-text)]"
              onClick={() => setMenuOpen(false)}
            >
              Contact me
            </Link>
          </div>
        </>
      )}
    </nav>
  );
}
