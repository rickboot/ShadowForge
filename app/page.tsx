'use client';
import { useState } from 'react';
import { callConversionAPI } from '@/lib/conversion/callConversionAPI';
import dynamic from 'next/dynamic';
import ThreeJsBackground from '@/components/ThreeJsBackground';
import { DEFAULT_INPUT_TEXT } from '@/lib/constants/text';
import { useTelemetry } from '@/lib/context/TelemetryContext';

const ShadowForgeLayout = dynamic(
  () => import('@/components/ShadowForgeLayout'),
  { ssr: false },
);

export default function Home() {
  const [input, setInput] = useState(DEFAULT_INPUT_TEXT);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null);
  const { setTelemetry } = useTelemetry();

  const handleConvert = async () => {
    setLoading(true);
    setOutput('');
    setProgress(null);

    await callConversionAPI(input, {
      onBlock: (markdown, completed, total) => {
        setOutput(prev => prev ? prev + '\n\n' + markdown : markdown);
        setProgress({ completed, total });
      },
      onDone: (telemetry) => {
        setTelemetry(telemetry);
        setLoading(false);
        setProgress(null);
      },
      onError: (message) => {
        setOutput(message);
        setLoading(false);
        setProgress(null);
      },
    });
  };

  return (
    <>
      <ThreeJsBackground />
      <ShadowForgeLayout
        input={input}
        output={output}
        loading={loading}
        progress={progress}
        setInput={setInput}
        handleConvert={handleConvert}
      />
    </>
  );
}
