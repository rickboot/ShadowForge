'use client';

import { Telemetry } from '@/lib/types/llm';

export async function callConversionAPI(inputText: string): Promise<{ convertedText: string; telemetry: Telemetry }> {
  const response = await fetch('/api/convert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: inputText }),
  });

  if (!response.ok) {
    let message = `Conversion failed (${response.status}).`;
    try {
      const body = await response.json();
      if (typeof body?.error === 'string') message = body.error;
    } catch { /* non-JSON error body — keep default message */ }
    throw new Error(message);
  }

  let body: { convertedText: string; telemetry: Telemetry };
  try {
    body = await response.json();
  } catch {
    throw new Error('Conversion failed: unexpected server response.');
  }
  return { convertedText: body.convertedText, telemetry: body.telemetry };
}
