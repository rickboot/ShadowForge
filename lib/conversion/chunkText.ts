import { estimateTokenCount } from '../utils/tokenUtils';

export function chunkText(input: string, maxTokens: number) {
  const rawParagraphs = input.split(/\n\s*\n/); // split on vertical blank lines

  const estTokens = estimateTokenCount(input);
  const estTokensPerWord = estTokens / input.split(/\s+/).length;
  const maxWords = Math.floor(maxTokens / estTokensPerWord);

  const paragraphs: string[] = [];

  // chunk oversize paragraphs into smaller paragraphs
  rawParagraphs.forEach((para) => {
    const words = para.split(/\s+/);
    if (words.length >= maxWords) {
      while (words.length > 0) {
        paragraphs.push(words.splice(0, maxWords).join(' '));
      }
    } else {
      paragraphs.push(para);
    }
  });

  // build up chunks from small paragraphs
  const chunks: string[] = [];
  let currentChunk = '';
  for (const para of paragraphs) {
    const wordCount = (currentChunk + para).split(/\s+/).length;
    const tokenEstimate = wordCount * estTokensPerWord;

    if (tokenEstimate > maxTokens) {
      chunks.push(currentChunk.trim());
      currentChunk = para;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + para;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
