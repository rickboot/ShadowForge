import { chunkText } from '@/lib/conversion/chunkText';
import { convertToShadowdark } from '@/lib/conversion/convertToShadowdark';
import { logTokenUsage } from '@/lib/utils/tokenUtils';
import { getLLMConfig } from '../llm/llmConfig';
import { convertToBlocks } from './convertToBlocks';
import { classifyBlocks } from './classifyBlocks';

interface runConversionPipelineProps {
  text: string;
  normalize: boolean;
}

// TODO: Replace with actual adventure ID
const DUMMY_ADVENTURE_ID = 'adventure-1';

export async function runConversionPipeline({
  text,
}: runConversionPipelineProps) {

  const contentBlocks = convertToBlocks(DUMMY_ADVENTURE_ID, text);

  const classifiedContent = classifyBlocks(contentBlocks);
  // console.log('\n\n*********classifiedContent*********\n\n', classifiedContent);

  const maxTokens = getLLMConfig().contextWindow;
  const chunks = chunkText(text, maxTokens);

  const convertedChunks: string[] = [];
  let tokenUsage = 0;
  for (const [i, chunk] of chunks.entries()) {
    const converted = await convertToShadowdark(chunk);
    convertedChunks.push(converted);
    tokenUsage += logTokenUsage(`Input chunk ${i + 1}:`, chunk);
  }

  //TODO! Commented out to avoid charge during development
  console.log('\n\n!!!!!!!!!! LLM DISABLED !!!!!!!!!!\n\n');
  const convertedText = 'LLM DISABLED';
  // const convertedText = convertedChunks.join('\n\n');

  logTokenUsage('Converted output:', convertedText);

  return { convertedText, tokenUsage };
}
