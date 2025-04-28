export function chunkText(input: string, maxTokens: number) {
  console.log('CHUNKING!');

  const TOKEN_MULTIPLIER = 1.5; // ~1.3 + 0.2 buffer
  const rawParagraphs = input.split(/\n\s*\n/); // split on vertical blank lines

  // chunk oversize paragraphs into smaller paragraphs
  const paragraphs: string[] = [];

  rawParagraphs.forEach((para) => {
    const words = para.split(/\s+/);
    const maxWords = maxTokens / TOKEN_MULTIPLIER;

    if (words.length >= maxWords) {
      while (words.length > 0) {
        paragraphs.push(words.splice(0, maxWords).join(' '));
      }
    } else {
      paragraphs.push(para);
    }
  });

  console.log('RAW PARAGRAPHS', rawParagraphs);
  console.log('CONVERTED PARAGRAPHS', paragraphs);

  // build up chunks from small paragraphs
  const chunks: string[] = [];
  let currentChunk = '';
  for (const para of paragraphs) {
    const wordCount = (currentChunk + para).split(/\s+/).length;
    const tokenEstimate = wordCount * TOKEN_MULTIPLIER;

    if (tokenEstimate > maxTokens) {
      chunks.push(currentChunk.trim());
      currentChunk = para;
    } else {
      currentChunk += (currentChunk ? /\n\n/ : '') + para;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
