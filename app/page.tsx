'use client';
import { useState } from 'react';
import { runConversion } from '@/lib/runConversion';
import dynamic from 'next/dynamic'; // skip SSR. pdfjs-dist needs DOM during build
const ShadowForgeLayout = dynamic(
  () => import('@/components/ShadowForgeLayout'),
  { ssr: false },
);

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [normalize, setNormalize] = useState(true);

  const handleConvert = async () => {
    setLoading(true);

    try {
      const result = await runConversion(input);
      setOutput(result);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Conversion error:', error);
        setOutput(error.message || 'Error during conversion.');
      } else {
        console.error('Unknown error:', error);
        setOutput('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShadowForgeLayout
      input={input}
      output={output}
      loading={loading}
      normalize={normalize}
      setNormalize={setNormalize}
      setInput={setInput}
      handleConvert={handleConvert}
    />
  );
}
