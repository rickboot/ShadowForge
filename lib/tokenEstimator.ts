import { getEncoding } from 'js-tiktoken';

const encoder = getEncoding('cl100k_base'); // works for GPT-4, GPT-3.5, etc.

export function countTokens(text: string): number {
  return encoder.encode(text).length;
}

export function estimateTokenCount(input: string): number {
  const wordCount = input.split(/\s+/).length;
  return Math.round(wordCount * 1.5);
}
