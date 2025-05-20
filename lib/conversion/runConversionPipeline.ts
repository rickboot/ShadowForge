import { chunkText } from '@/lib/conversion/chunkText';
import { convertToShadowdark } from '@/lib/conversion/convertToShadowdark';
import { logTokenUsage } from '@/lib/utils/tokenUtils';
import { getLLMConfig } from '../llm/llmConfig';
import { chunkTextToBlocks } from './convertToBlocks';
import { classifyBlocks } from '../utils/chunkClassifier';

interface runConversionPipelineProps {
  text: string;
  normalize: boolean;
}

// TODO: Replace with actual adventure ID
const DUMMY_ADVENTURE_ID = 'adventure-1';

export async function runConversionPipeline({
  text,
}: runConversionPipelineProps) {
  // console.log('Input text:', text);

  const contentBlocks = chunkTextToBlocks(DUMMY_ADVENTURE_ID, text);
  // console.log('Content blocks:', contentBlocks);

  const classifiedContent = classifyBlocks(contentBlocks);
  console.log('Classified content:', classifiedContent);

  const maxTokens = getLLMConfig().contextWindow;
  const chunks = chunkText(text, maxTokens);

  const convertedChunks: string[] = [];
  let tokenUsage = 0;
  for (const [i, chunk] of chunks.entries()) {
    const converted = await convertToShadowdark(chunk);
    convertedChunks.push(converted);
    tokenUsage += logTokenUsage(`Input chunk ${i + 1}:`, chunk);
  }

  const convertedText = convertedChunks.join('\n\n');

  console.log(
    `\x1b[36m[Token Debug]\x1b[0m \x1b[33mTotal input usage: ${tokenUsage}\x1b[0m`,
  );

  logTokenUsage('Converted output:', convertedText);

  return { convertedText, tokenUsage };
}
