export function chunkInputText(input: string, maxTokens = 1000) {
  const paragraphs = input.split(/\n\s*\n/); // split on vertical blank lines
  const chunks: string[] = [];
  let currentChunk = '';

  for (const para of paragraphs) {
    const wordCount = (currentChunk + para).split(/\s+/).length;
    const tokenEstimate = wordCount * 0.75; // assume 1 word = 0.75 tokens

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
