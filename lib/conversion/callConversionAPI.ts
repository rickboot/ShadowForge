'use client';

import { Telemetry } from '@/lib/types/llm';

export async function callConversionAPI(inputText: string): Promise<{ convertedText: string; telemetry: Telemetry }> {
  const response = await fetch('/api/convert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: inputText }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Conversion failed.');
  }

  const { convertedText, telemetry } = await response.json();
  return { convertedText, telemetry };
}
