import { estimateTokenCount } from "../utils/tokenUtils";

export function chunkText(input: string, maxTokens: number) {
  console.log('==========CHUNKING==========');

  // const TOKEN_MULTIPLIER = 1.5; 
  const rawParagraphs = input.split(/\n\s*\n/); // split on vertical blank lines

  //! TEST
  const estTokens = estimateTokenCount(input);
  const estTokensPerWord = estTokens / input.split(/\s+/).length
  const maxWords = Math.floor(maxTokens / estTokensPerWord)
    
  console.log('MAX TOKENS', maxTokens);
  console.log('EST TOKENS', estTokens);
  console.log('EST TOKENS PER WORD', estTokensPerWord);
  console.log('EST WORDS', input.split(/\s+/).length);
  console.log('MAX WORDS', maxWords);
  console.log('EST CHUNKS', Math.ceil(estTokens / maxTokens));
  
  // chunk oversize paragraphs into smaller paragraphs
  const paragraphs: string[] = [];
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

  // console.log('RAW PARAGRAPHS', rawParagraphs);
  // console.log('CONVERTED PARAGRAPHS', paragraphs);

  // build up chunks from small paragraphs
  const chunks: string[] = [];
  let currentChunk = '';
  for (const para of paragraphs) {
    const wordCount = (currentChunk + para).split(/\s+/).length;
    // const tokenEstimate = wordCount * TOKEN_MULTIPLIER;
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
