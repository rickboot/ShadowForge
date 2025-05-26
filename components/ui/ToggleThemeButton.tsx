import React from 'react';
import { Sun as SunIcon, Moon as MoonIcon } from 'lucide-react';

function Moon() {
  return (
    <MoonIcon
      className="bg-background text-foreground rounded-full border p-0.5"
      size={18}
    />
  );
}

function Sun() {
  return (
    <SunIcon
      className="bg-background text-foreground rounded-full border p-0.5"
      size={18}
    />
  );
}

interface ToggleThemeButtonProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function ToggleThemeButton({
  theme,
  toggleTheme,
}: ToggleThemeButtonProps) {
  const label = `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`;

  return (
    <button
      type="button"
      className="bg-foreground text-background border-surface-contrast hover:bg-button-hover-bg flex h-5 w-9 items-center justify-start rounded-full border-1 transition-colors duration-200 dark:justify-end"
      aria-label={label}
      aria-pressed={theme === 'dark'}
      onClick={toggleTheme}
    >
      {theme === 'light' ? <Sun /> : <Moon />}
    </button>
  );
}
