'user client';

import React from 'react';

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
  return (
    <div className='min-h-screen bg-[#fefae0] dark:bg-[#121212] text-[#1a1a1a] dark:text-[#fefae0] font-sans'>
      <header className='flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-gray-700'>
        <h1 className='text-2xl font-serif tracking-wide'>ShadowForge</h1>
        <button className='text-sm px-3 py-1 border rounded dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'>
          Toggle Theme
        </button>
      </header>

      {/* === input === */}
      <main className='flex flex-col xl:flex-row px-6 py-8 gap-6'>
        <section className='flex-1 space-y-4'>
          <h2 className='text-lg font-medium'>Input</h2>
          <textarea
            className='w-full h-120 p-4 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-black font-mono text-sm'
            placeholder='Paste your 5e content here...'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleConvert}
            disabled={loading || !input.trim()}
            className='bg-black text-white dark:bg-white dark:text-black px-6 py-2 text-sm font-medium rounded hover:opacity-90 disabled:opacity-50'
          >
            {loading ? 'Converting...' : 'Convert'}
          </button>
          <label className='flex items-center space-x-2 text-sm'>
            <input
              type='checkbox'
              checked={normalize}
              onChange={(e) => setNormalize(e.target.checked)}
              className='form-checkbox'
            />
            <span>Normalize text</span>
          </label>
        </section>

        {/* === output === */}
        <section className='flex-1 space-y-4'>
          <h2 className='text-lg font-medium'>Output</h2>
          <div className='w-full h-120 p-4 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-black font-mono text-sm whitespace-pre-wrap overflow-auto'>
            {output || <p className='italic text-gray-500'>Nothing yet...</p>}
          </div>
        </section>
      </main>

      <footer className='text-sm text-center text-gray-500 dark:text-gray-400 py-4 border-t border-gray-200 dark:border-gray-700'>
        &copy; 2025 ShadowForge. Convert responsibly.
      </footer>
    </div>
  );
}
