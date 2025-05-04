import { chunkText } from '@/lib/conversion/chunkText';
import { estimateTokenCount } from '@/lib/utils/tokenUtils';

describe('chunkText', () => {
  test('splits input text into chunks smaller than LLM context limit', () => {
    const hugeText =
      `This sentence should appear in multiple paragraphs. `.repeat(5000);

    const MAX_TOKENS = 4096;
    const chunks = chunkText(hugeText, MAX_TOKENS);

    expect(chunks.length).toBeGreaterThan(1);

    chunks.forEach((chunk) => {
      const estTokens = estimateTokenCount(chunk);
      expect(estTokens).toBeLessThan(MAX_TOKENS);
    });
  });

  test('combines paragraphs into large chunks near LLM context limit', () => {
    const smallText =
      `The sentence should appear in a single paragraph. \n`.repeat(50);

    const MAX_TOKENS = 4096;
    const chunks = chunkText(smallText, MAX_TOKENS);

    expect(chunks.length).toEqual(1);

    chunks.forEach((chunk) => {
      const estTokens = estimateTokenCount(chunk);
      expect(estTokens).toBeLessThan(MAX_TOKENS);
    });
  });

  test('chunks are close to the token limit without exceeding', () => {
    const hugeText = 'This sentence fills space. '.repeat(5000);

    const MAX_TOKENS = 4096;
    const SAFETY_MARGIN = 0.8;

    const chunks = chunkText(hugeText, MAX_TOKENS);

    chunks.forEach((chunk) => {
      const estTokens = estimateTokenCount(chunk);

      expect(estTokens).toBeLessThan(MAX_TOKENS);
      expect(estTokens).toBeGreaterThanOrEqual(MAX_TOKENS * SAFETY_MARGIN);
    });
  });

  // test('original text is preserved and in order', () => {
  //   let originalText = '';
  //   for (let i = 1; i <= 1000; i++) {
  //     originalText += `This is sentence ${i}. `;
  //   }
  //   originalText = originalText.trim();

  //   const chunkedText = chunkText(originalText, 100).join(' ');
  //   expect(chunkedText).toEqual(originalText);
  // });
});
