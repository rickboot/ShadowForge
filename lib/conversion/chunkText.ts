import { getLLMConfig } from '@/lib/llm/llmConfig';

export function chunkInputText(input: string) {
  const maxTokens = getLLMConfig().contextWindow;
  console.log('CHUNKING!');

  const paragraphs = input.split(/\n\s*\n/); // split on vertical blank lines
  const chunks: string[] = [];
  let currentChunk = '';

  for (const para of paragraphs) {
    const wordCount = (currentChunk + para).split(/\s+/).length;
    const tokenEstimate = wordCount * 1.5;

    if (tokenEstimate > maxTokens) {
      chunks.push(currentChunk.trim());
      currentChunk = para;
      console.log('=== chunksize:', currentChunk.length);
    } else {
      currentChunk += (currentChunk ? /\n\n/ : '') + para;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
