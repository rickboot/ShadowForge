import { addTokenUsage, canUseTokens } from './tokenTracker';
import { estimateTokenCount } from './tokenEstimator';

export async function runConversion(inputText: string) {
  const estTokens = estimateTokenCount(inputText);

  if (!canUseTokens(estTokens)) {
    throw new Error('Daily conversion limit reached. Try again tomorrow');
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

  const data = await response.json();
  addTokenUsage(estTokens);
  return data.converted;
}
