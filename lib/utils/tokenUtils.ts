import { getEncoding } from 'js-tiktoken';
import { DAILY_TOKEN_LIMIT } from './constants';

export function getTokenUsage() {
  const data = localStorage.getItem('shadowforgeTokenUsage');
  if (!data) return 0;

  const { date, usage } = JSON.parse(data);
  const today = new Date().toDateString();

  return today === date ? usage : 0;
}

export function addTokenUsage(newUsage: number) {
  const prevUsage = getTokenUsage();

  const totalUsage = prevUsage + newUsage;
  const today = new Date().toDateString();

  localStorage.setItem(
    'shadowforgeTokenUsage',
    JSON.stringify({ date: today, usage: totalUsage }),
  );
}

export function canUseTokens(newUsage: number) {
  const currentUsage = getTokenUsage();
  return currentUsage + newUsage <= DAILY_TOKEN_LIMIT;
}

export function logTokenUsage(label: string, text: string) {
  if (process.env.NEXT_PUBLIC_DEBUG_TOKENS !== 'true') return 0;

  let tokens = 0;
  try {
    tokens = countTokens(text);
  } catch (err) {
    console.warn(`[Token Debug] Failed to count tokens for "${label}":`, err);
    return 0;
  }

  console.log(`\x1b[36m[Token Debug]\x1b[0m ${label}: ${tokens} tokens`);
  return tokens;
}

const encoder = getEncoding('cl100k_base'); // works for GPT-4, GPT-3.5, etc.

export function countTokens(text: string): number {
  return encoder.encode(text).length;
}

export function estimateTokenCount(input: string): number {
  const wordCount = input.split(/\s+/).length;
  return Math.round(wordCount * 1.5);
}
