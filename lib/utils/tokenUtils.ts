import { getEncoding } from 'js-tiktoken';
import { DAILY_TOKEN_LIMIT } from '../constants/limits';

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

//! Re-enable for naive token limiting
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

  return tokens;
}

export function countTokens(text: string): number {
  const encoder = getEncoding('cl100k_base'); // works for GPT-4, GPT-3.5, etc.
  return encoder.encode(text).length;
}

export function estimateTokenCount(text: string): number {
  const encoder = getEncoding('cl100k_base'); // works for GPT-4, GPT-3.5, etc.
  return encoder.encode(text).length;
}
