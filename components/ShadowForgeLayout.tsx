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
  blockBasedConversion: boolean;
  setBlockBasedConversion: (val: boolean) => void;
  setInput: (val: string) => void;
  handleConvert: () => void;
}

export default function ShadowForgeLayout({
  input,
  output,
  loading,
  blockBasedConversion,
  setBlockBasedConversion,
  setInput,
  handleConvert,
}: ShadowForgeLayoutProps) {
  const [previewMode, setPreviewMode] = useState(true);

  //! file drop handler
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const text =
      file.type === 'application/pdf'
        ? await extractTextFromPDF(file)
        : await file.text();

    setInput(text);
  };

  return (
    <div
      className="flex min-h-0 flex-1 flex-col gap-6 overflow-hidden px-4 py-6 font-sans md:flex-row"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      {/* ===== INPUT SECTION ===== */}
      <section className="z-10 flex min-h-0 flex-1 flex-col space-y-4 overflow-hidden">
        <h2 className="text-2xl font-medium">Paste 5e Content Here</h2>
        <textarea
          className="bg-surface/10 hover:bg-surface/20 h-[500px] w-full resize-none overflow-auto rounded border p-4 font-mono text-sm transition-colors duration-300 placeholder:text-[var(--surface-contrast)] focus:ring-2 focus:ring-[var(--convert-button-bg)]/50 focus:outline-none"
          style={{
            color: 'var(--surface-text)',
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
            className="focus:ring-accent/50 w-30 rounded-md bg-[var(--button-bg)] px-2 py-1 text-[var(--button-text)] transition-colors duration-300 hover:bg-[var(--button-hover-bg)] focus:ring-2 focus:outline-none disabled:opacity-50"
          >
            {loading ? 'Converting...' : 'Convert'}
          </button>
          <UploadButton onLoad={setInput} />
          <label className="flex items-center justify-center gap-2 text-sm">
            <span>Block-based Conversion</span>
            <input
              type="checkbox"
              checked={blockBasedConversion}
              onChange={(e) => setBlockBasedConversion(e.target.checked)}
              className="form-checkbox border-surface-contrast h-4 w-4 rounded-sm"
              style={{ accentColor: 'var(--button-bg)' }}
            />
          </label>
        </div>
      </section>

      {/* ===== OUTPUT SECTION ===== */}
      <section className="z-10 flex min-h-0 flex-1 flex-col space-y-4 overflow-hidden">
        <h2 className="text-2xl font-medium">Shadowdark Content</h2>
        <div
          className="bg-surface/10 hover:bg-surface/20 h-[500px] w-full overflow-auto rounded border p-4 transition-colors duration-300"
          style={{
            color: 'var(--surface-text)',
            borderColor: 'var(--surface-contrast)',
          }}
        >
          {previewMode ? (
            <div className="prose prose-sm dark:prose-invert markdown-body max-w-none">
              <ReactMarkdown>{output}</ReactMarkdown>
            </div>
          ) : (
            <pre className="overflow-x-auto text-sm whitespace-pre-wrap">
              {output}
            </pre>
          )}
        </div>
        <div className="mb-2 flex h-12 items-center justify-center gap-12">
          <CopyButton text={output} />
          <DownloadButton content={output} filename="sd-conversion.md" />
          <label className="flex items-center justify-center gap-2 text-sm">
            <span>Preview Mode</span>
            <input
              type="checkbox"
              checked={previewMode}
              onChange={() => setPreviewMode(!previewMode)}
              className="form-checkbox border-surface-contrast h-4 w-4 rounded-sm"
              style={{ accentColor: 'var(--button-bg)' }}
            />
          </label>
        </div>
      </section>
    </div>
  );
}
