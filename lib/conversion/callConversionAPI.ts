import { addTokenUsage, canUseTokens } from '@/lib/utils/tokenUtils';
import { estimateTokenCount } from '@/lib/utils/tokenUtils';

export async function callConversionAPI(inputText: string) {
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
    body: JSON.stringify({ text: inputText }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Conversion failed.');
  }

  const { convertedText } = await response.json();
  addTokenUsage(estTokens);
  return convertedText;
}
