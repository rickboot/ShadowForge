'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import CopyButton from './ui/CopyButton';
import DownloadButton from './ui/DownloadButton';
import UploadButton from './ui/UploadButton';
import { extractTextFromPDF } from '@/lib/utils/extractPdfText';

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
      className="min-h-screen font-sans z-10"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
        // position: 'relative'
      }}
    >
      <main className="flex flex-col gap-6 px-6 py-4 md:px-12 md:py-8 md:flex-row ">
        {/* ============ INPUT ============ */}
        <section className="flex-1 space-y-4 z-10">
          <h2 className="text-2xl font-medium">Input</h2>
          <textarea
            className="h-150 w-full resize-none rounded border p-4 font-mono text-sm 
              bg-surface/10 hover:bg-surface/20 
              transition-colors duration-300
              focus:outline-none focus:ring-2 focus:ring-[var(--convert-button-bg)]/50"
            style={{
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
          <div className="mb-2 flex h-12 items-center justify-center gap-12">
            <button
              onClick={handleConvert}
              disabled={loading || !input.trim()}
              className="w-30 px-2 py-1 rounded-md 
                bg-[var(--button-bg)] text-[var(--button-text)]
                hover:bg-[var(--button-hover-bg)]
                disabled:opacity-50 
                transition-colors duration-300 
                focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              {loading ? 'Converting...' : 'Convert'}
            </button>

            <UploadButton onLoad={setInput} />

            <label className="flex items-center justify-center gap-2 text-sm">
              <span>Normalize</span>
              <input
                type="checkbox"
                checked={normalize}
                onChange={(e) => setNormalize(e.target.checked)}
                className="form-checkbox rounded-sm h-4 w-4
                  border-surface-contrast"
                style={{
                  accentColor: 'var(--button-bg)'
                }}
              />
            </label>
          </div>
        </section>

        {/* ============ OUTPUT ============ */}
        <section className="flex-1 space-y-4 z-10">
          <h2 className="text-2xl font-medium">Output</h2>
          <div
            className="h-150 w-full overflow-auto rounded border p-4 
              bg-surface/10 hover:bg-surface/20 
              transition-colors duration-300"
            style={{
              color: 'var(--foreground)',
              borderColor: 'var(--surface-contrast)',
            }}
          >
            {previewMode ? (
              <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90">
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            ) : (
              <pre className="text-sm font-mono whitespace-pre-wrap text-foreground/90 overflow-x-auto">
                {output}
              </pre>
            )}
          </div>

          <div className="mb-2 flex h-12 items-center justify-center gap-12">
            <CopyButton text={output} />
            <DownloadButton content={output} filename="sd-conversion.md" />
            <div className="flex items-center justify-center gap-2 text-sm">
              <span>Preview Mode</span>
              <input
                type="checkbox"
                checked={previewMode}
                onChange={() => setPreviewMode(!previewMode)}
                className="form-checkbox rounded-sm h-4 w-4
                  border-surface-contrast"
                style={{
                  accentColor: 'var(--button-bg)'
                }}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
