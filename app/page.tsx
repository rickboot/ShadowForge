'use client';
import { useState } from 'react';
import { callConversionAPI } from '@/lib/conversion/callConversionAPI';
import dynamic from 'next/dynamic';
import ThreeJsBackground from '@/components/ThreeJsBackground';
import { DEFAULT_INPUT_TEXT } from '@/lib/constants/text';
import { Telemetry } from '@/lib/types/llm';

const ShadowForgeLayout = dynamic(
  () => import('@/components/ShadowForgeLayout'),
  { ssr: false },
);

export default function Home() {
  const [input, setInput] = useState(DEFAULT_INPUT_TEXT);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);

  const handleConvert = async () => {
    setLoading(true);
    setOutput('Strange runes flicker as ancient syntax is transmuted...');

    try {
      const { convertedText, telemetry: t } = await callConversionAPI(input);
      setOutput(convertedText);
      setTelemetry(t);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Conversion error:', error);
        setOutput(error.message || 'Error during conversion.');
      } else {
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
        telemetry={telemetry}
        setInput={setInput}
        handleConvert={handleConvert}
      />
    </>
  );
}
