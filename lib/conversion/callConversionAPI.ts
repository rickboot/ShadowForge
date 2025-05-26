import {
  addTokenUsage,
  canUseTokens,
  estimateTokenCount,
} from '@/lib/utils/tokenUtils';
import { ConversionAPIResponse } from '../types/api';

export async function callConversionAPI(inputText: string, blockBasedConversion: boolean) {
  const estTokens = estimateTokenCount(inputText);

  if (
    process.env.DEV_SHADOWFORGE_DEV_MODE === 'false' &&
    !canUseTokens(estTokens)
  ) {
    throw new Error('Content too large or daily limit reached.');
  }

  const response = await fetch('/api/convert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: inputText, blockBasedConversion }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Conversion failed.');
  }

  const { convertedText, tokenUsage }: ConversionAPIResponse =
    await response.json();

  addTokenUsage(tokenUsage);

  return convertedText;
}
