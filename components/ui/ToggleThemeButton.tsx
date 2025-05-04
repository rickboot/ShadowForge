import React from 'react';
import { Sun as SunIcon, Moon as MoonIcon } from 'lucide-react';

function Moon() {
  return (
    <MoonIcon
      className="rounded-full p-0.5 bg-background text-foreground border-foreground"
      size={18}
    />
  );
}

function Sun() {
  return (
    <SunIcon
      className="rounded-full p-0.5 bg-background text-foreground border-foreground"
      size={18}
    />
  );
}

interface ToggleThemeButtonProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function ToggleThemeButton({ theme, toggleTheme }: ToggleThemeButtonProps) {
  const label = `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`;
  
  return (
    <button
      type="button"
      className="flex h-5 w-9 items-center justify-start rounded-full border-1 
                bg-foreground text-background border-surface-contrast
                hover:bg-button-hover-bg transition-colors duration-200
                dark:justify-end"
      aria-label={label}
      aria-pressed={theme === 'dark'}
      onClick={toggleTheme}
    >
      {theme === 'light' ? <Sun /> : <Moon />}
    </button>
  );
}
