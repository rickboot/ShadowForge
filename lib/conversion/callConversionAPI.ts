'use client';

import { Telemetry } from '@/lib/types/llm';

export interface ConversionCallbacks {
  onBlock: (markdown: string, completed: number, total: number) => void;
  onDone: (telemetry: Telemetry) => void;
  onError: (message: string) => void;
}

async function* readSSE(reader: ReadableStreamDefaultReader<Uint8Array>) {
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim();
        if (data) yield JSON.parse(data);
      }
    }
  }

  if (buffer.startsWith('data: ')) {
    const data = buffer.slice(6).trim();
    if (data) yield JSON.parse(data);
  }
}

export async function callConversionAPI(
  inputText: string,
  callbacks: ConversionCallbacks,
): Promise<void> {
  let response: Response;
  try {
    response = await fetch('/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: inputText }),
    });
  } catch {
    callbacks.onError('Network error — could not reach the server.');
    return;
  }

  if (!response.ok || !response.body) {
    let message = `Conversion failed (${response.status}).`;
    try {
      const body = await response.json();
      if (typeof body?.error === 'string') message = body.error;
    } catch { /* non-JSON error body */ }
    callbacks.onError(message);
    return;
  }

  let finished = false;
  try {
    for await (const event of readSSE(response.body.getReader())) {
      if (event.type === 'block') {
        callbacks.onBlock(event.content, event.completed, event.total);
      } else if (event.type === 'done') {
        finished = true;
        callbacks.onDone(event.telemetry);
      } else if (event.type === 'error') {
        finished = true;
        callbacks.onError(event.message ?? 'Conversion failed.');
      }
    }
  } catch {
    callbacks.onError('Connection lost during conversion.');
    return;
  }

  if (!finished) {
    callbacks.onError('Conversion failed: server closed the connection unexpectedly.');
  }
}
