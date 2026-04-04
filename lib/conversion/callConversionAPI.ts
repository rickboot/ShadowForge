'use client';

export async function callConversionAPI(inputText: string): Promise<string> {
  const response = await fetch('/api/convert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: inputText }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Conversion failed.');
  }

  const { convertedText } = await response.json();
  return convertedText;
}
