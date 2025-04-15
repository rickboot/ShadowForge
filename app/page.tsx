'use client';
import ShadowForgeLayout from '@/components/ShadowForgeLayout';
import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [normalize, setNormalize] = useState(false);

  const handleConvert = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input, normalize }),
      });

      const data = await response.json();
      setOutput(data.converted || 'Conversion failed');
    } catch (error) {
      console.error('Conversion error:', error);
      setOutput('Error connecting to server.');
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
