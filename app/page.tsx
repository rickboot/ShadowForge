'use client';
import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    setLoading(true);

    const response = await fetch('/api/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: input }),
    });

    const data = await response.json();

    console.log(data);
    setOutput(data.converted || 'Conversion failed');

    setLoading(false);
  };

  return (
    <div className='min-h-screen flex items-start justify-center p-8 bg-black'>
      <div className='w-full max-w-4xl space-y-6'>
        <h1 className='text-2xl font-bold'>ShadowForge</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleConvert();
          }}
          className='space-y-4'
        >
          <textarea
            className='w-full h-48 p-4 border rounded'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste 5e content here...'
          />
          <button
            type='submit'
            disabled={loading || !input.trim()}
            className='px-4 py-2 bg-cyan-600 text-white rounded disabled:opacity-50'
          >
            {loading ? 'Converting...' : 'Convert!'}
          </button>
        </form>

        {output && (
          <div className='whitespace-pre-wrap p-4 border rounded'>{output}</div>
        )}
      </div>
    </div>
  );
}
