'use client';
import { useState } from 'react';
import { callConversionAPI } from '@/lib/conversion/callConversionAPI';
import dynamic from 'next/dynamic'; // skip SSR. pdfjs-dist needs DOM during build
import ThreeJsBackground from '@/components/ThreeJsBackground';
import { DEFAULT_INPUT_TEXT } from '@/lib/constants/text';

const ShadowForgeLayout = dynamic(
  () => import('@/components/ShadowForgeLayout'),
  { ssr: false },
);

export default function Home() {
  const [input, setInput] = useState(DEFAULT_INPUT_TEXT);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [blockBasedConversion, setBlockBasedConversion] = useState(true);

  const handleConvert = async () => {
    setLoading(true);
    setOutput('Strange runes flicker as ancient syntax is transmuted...');

    try {
      const result = await callConversionAPI(input, blockBasedConversion);
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
    <>
      <ThreeJsBackground />
      <ShadowForgeLayout
        input={input}
        output={output}
        loading={loading}
        blockBasedConversion={blockBasedConversion}
        setBlockBasedConversion={setBlockBasedConversion}
        setInput={setInput}
        handleConvert={handleConvert}
      />
    </>
  );
}
