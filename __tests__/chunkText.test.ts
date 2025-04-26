import { chunkText } from '@/lib/conversion/chunkText';
import { estimateTokenCount } from '@/lib/utils/tokenUtils';

describe('chunkTest', () => {
  it('splits input text into chunks smaller than LLM context limit', () => {
    const hugeText = 'Do you find it risible? '.repeat(5000);
    const MAX_TOKENS = 4096;

    const chunks = chunkText(hugeText, MAX_TOKENS);

    expect(chunks.length).toBeGreaterThan(1);

    chunks.forEach((chunk) => {
      const estTokens = estimateTokenCount(chunk);
      expect(estTokens).toBeLessThan(MAX_TOKENS);
    });
  });
});
