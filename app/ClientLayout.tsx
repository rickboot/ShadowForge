//! A layer underneath layout.tsx that runs on the client
'use client';
import NavBar from './NavBar';
import { useEffect, useState } from 'react';
import { TelemetryProvider, useTelemetry } from '@/lib/context/TelemetryContext';
import TelemetryPanel from '@/components/ui/TelemetryPanel';
import { BarChart2 } from 'lucide-react';
import { buttonClasses } from '@/lib/styles/sharedStyles';

//! Theme management and app layout
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
    <TelemetryProvider>
      <div className="flex min-h-screen flex-col">
        <header>
          <NavBar theme={theme} toggleTheme={toggleTheme} />
        </header>
        <main className="min-h-0 flex-1">{children}</main>
        <Footer />
      </div>
    </TelemetryProvider>
  );
}

function Footer() {
  const { telemetry } = useTelemetry();
  const [showTelemetry, setShowTelemetry] = useState(false);

  return (
    <footer
      className="relative border-t px-4 py-4 text-sm"
      style={{ borderColor: 'var(--border)' }}
    >
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        &copy; 2025 Rick Allen. Convert responsibly.
      </span>
      <div className="flex justify-end">
        <button
          className={buttonClasses}
          onClick={() => setShowTelemetry(v => !v)}
          disabled={!telemetry}
          title={telemetry ? 'Show telemetry' : 'Run a conversion to see telemetry'}
        >
          <BarChart2 size={16} />
        </button>
      </div>
      {showTelemetry && telemetry && (
        <TelemetryPanel telemetry={telemetry} onClose={() => setShowTelemetry(false)} />
      )}
    </footer>
  );
}
