import React from 'react';
import { Sun as SunIcon, Moon as MoonIcon } from 'lucide-react';

function Moon() {
  return (
    <MoonIcon
      className="rounded-full p-0.5"
      size={18}
      style={{
        backgroundColor: 'var(--background',
        color: 'var(--foreground)',
        borderColor: 'var(--foreground)',
      }}
    />
  );
}

function Sun() {
  return (
    <SunIcon
      className="rounded-full p-0.5"
      size={18}
      style={{
        backgroundColor: 'var(--background',
        color: 'var(--foreground)',
        borderColor: 'var(--foreground)',
      }}
    />
  );
}

interface ToggleThemeProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function ToggleTheme({ theme, toggleTheme }: ToggleThemeProps) {
  return (
    <button
      style={{
        backgroundColor: 'var(--foreground)',
        color: 'var(--background)',
        borderColor: 'var(--surface-contrast)',
      }}
      className="flex w-9 items-center justify-start rounded-full border-1 text-sm dark:justify-end"
      onMouseOver={(e) =>
        (e.currentTarget.style.backgroundColor = 'var(--button-hover-bg)')
      }
      onMouseOut={(e) =>
        (e.currentTarget.style.backgroundColor = 'var(--button-bg)')
      }
      onClick={toggleTheme}
    >
      {theme === 'light' ? <Sun /> : <Moon />}
    </button>
  );
}
