'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import CopyButton from './ui/CopyButton';
import DownloadButton from './ui/DownloadButton';
import UploadButton from './ui/UploadButton';
import { ToggleTheme } from './ui/ToggleThemeButton';
import { extractTextFromPDF } from '@/lib/extractPdfText';

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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    let text = '';
    if (file.type === 'application/pdf') {
      text = await extractTextFromPDF(file);
      setInput(text);
    } else {
      text = await file.text();
    }
    setInput(text);
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

      <main className="flex flex-col gap-6 px-12 py-8 md:flex-row">
        {/* ============ INPUT ============ */}
        <section className="flex-1 space-y-4">
          <h2 className="text-2xl font-medium">Input</h2>
          <textarea
            className="h-180 w-full resize-none rounded border border-gray-300 p-4 font-mono text-sm"
            style={{
              backgroundColor: 'var(--surface)',
              color: 'var(--foreground)',
              borderColor: 'var(--surface-contrast)',
            }}
            placeholder={
              '> Opening the mailbox reveals: D&D 5e content.\n\nPaste or drop your 5e content here...'
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
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

        {/* ============ OUTPUT ============ */}
        <section className="flex-1 space-y-4">
          <h2 className="text-2xl font-medium">Output</h2>
          <div
            className="h-180 w-full overflow-auto rounded border p-4"
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
              <pre className="text-lag font-mono whitespace-pre-wrap">
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
