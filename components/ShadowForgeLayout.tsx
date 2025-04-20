('use client');

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import CopyButton from './CopyButton';
import DownloadButton from './DownloadButton';
import UploadButton from './UploadButton';
import { ToggleTheme } from './ToggleTheme';

interface ShadowForgeLayoutProps {
  input: string;
  output: string;
  loading: boolean;
  normalize: boolean;
  setNormalize: (val: boolean) => void;
  setInput: (val: string) => void;
  handleConvert: () => void;
}

export default function ShadowForgeLayout({
  input,
  output,
  loading,
  normalize,
  setInput,
  setNormalize,
  handleConvert,
}: ShadowForgeLayoutProps) {
  const [previewMode, setPreviewMode] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'light';
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
    <div
      className="min-h-screen font-sans"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      <header
        className="flex items-start justify-between border-b px-6 py-4"
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

      <main className="flex flex-col gap-6 px-6 py-8 md:flex-row">
        {/* === input === */}
        <section className="flex-1 space-y-4">
          <h2 className="text-lg font-medium">Input</h2>
          <textarea
            className="h-120 w-full resize-none rounded border border-gray-300 p-4 font-mono text-xs"
            placeholder={`> Opening the mailbox reveals: D&D 5e content.

Paste your 5e content here...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              backgroundColor: 'var(--surface)',
              color: 'var(--foreground)',
              borderColor: 'var(--surface-contrast)',
            }}
          />

          <div className="mb-2 flex h-12 items-center justify-evenly gap-2">
            <button
              onClick={handleConvert}
              disabled={loading || !input.trim()}
              style={{
                backgroundColor: 'var(--button-bg)',
                color: 'var(--button-text)',
              }}
              className="h-7 rounded px-3 text-sm font-medium"
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor =
                  'var(--button-hover-bg)')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = 'var(--button-bg)')
              }
            >
              {loading ? 'Converting...' : 'Convert'}
            </button>

            <UploadButton onLoad={setInput} />

            <label className="flex items-center space-x-2 text-sm dark:text-white">
              <span>Normalize text</span>
              <input
                type="checkbox"
                checked={normalize}
                onChange={(e) => setNormalize(e.target.checked)}
                className="h-4 w-4 rounded-sm bg-[color:var(--surface)] text-[color:var(--button-bg)] accent-[color:var(--button-bg)]"
              />
            </label>
          </div>
        </section>

        {/* === output === */}
        <section className="flex-1 space-y-4">
          <h2 className="text-lg font-medium">Output</h2>
          <div
            className="h-120 w-full overflow-auto rounded border p-4"
            style={{
              backgroundColor: 'var(--surface)',
              color: 'var(--foreground)',
              borderColor: 'var(--surface-contrast)',
            }}
          >
            {previewMode ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            ) : (
              <pre className="font-mono text-sm whitespace-pre-wrap">
                {output}
              </pre>
            )}
          </div>

          <div className="mb-2 flex h-12 items-center justify-evenly gap-2 dark:text-white">
            <CopyButton text={output} />
            <DownloadButton content={output} filename="sd-conversion.md" />
            <div className="flex h-6 w-20 items-center justify-center gap-1">
              <label className="text-sm font-medium">Preview</label>
              <input
                type="checkbox"
                checked={previewMode}
                onChange={() => setPreviewMode(!previewMode)}
                className="h-4 w-4 rounded-sm bg-[color:var(--surface)] text-[color:var(--button-bg)] accent-[color:var(--button-bg)]"
              />
            </div>
          </div>
        </section>
      </main>

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
