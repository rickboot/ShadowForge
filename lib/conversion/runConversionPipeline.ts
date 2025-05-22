// import { chunkText } from '@/lib/conversion/chunkText';
// import { convertToShadowdark } from '@/lib/conversion/convertToShadowdark';
// import { logTokenUsage } from '@/lib/utils/tokenUtils';
// import { getLLMConfig } from '../llm/llmConfig';
import { convertToBlocks } from './convertToBlocks'
import { classifyWithKeywords } from './classifyWithKeywords'
import { classifyWithLLM } from './classifyWithLLM';

// TODO: Replace with actual adventure ID
const DUMMY_ADVENTURE_ID = 'adventure-1';

export type ContentBlock = {
  id: string;
  sequence: number;
  adventureId: string;
  header: string;
  paragraphs: string[];
};
interface runConversionPipelineProps {
  text: string;
  normalize: boolean;
}

export async function runConversionPipeline({
  text,
}: runConversionPipelineProps) {

  const blocksRaw = convertToBlocks(DUMMY_ADVENTURE_ID, text);

  const blocksAllKeywordClassified = classifyWithKeywords(blocksRaw);

  const blocksUnknown = blocksAllKeywordClassified.filter((block) => block.contentType === 'Unknown');

  const blocksToClassify: ContentBlock[] = blocksUnknown.map((block) => ({
    id: block.id,
    sequence: block.sequence,
    adventureId: block.adventureId,
    header: block.header,
    paragraphs: block.paragraphs,
  }));

  const blocksLLMClassified = await classifyWithLLM(blocksToClassify);

  const blocksKnown = blocksAllKeywordClassified.filter((block) => block.contentType !== 'Unknown');
  const blocksAllClassified = [...blocksKnown, ...blocksLLMClassified];

  console.log('########## Classified Blocks ##########');
  console.log(blocksAllClassified.sort((a, b) => a.sequence - b.sequence));

  //! Old conversion - may need for alternate conversion
  // const convertedChunks: string[] = [];
  let tokenUsage = 0;
  // for (const [i, chunk] of chunks.entries()) {
  //   const converted = await convertToShadowdark(chunk);
  //   convertedChunks.push(converted);
  //   tokenUsage += logTokenUsage(`Input chunk ${i + 1}:`, chunk);
  // }

  // const convertedText = convertedChunks.join('\n\n');
  // logTokenUsage('Converted output:', convertedText);

  const convertedText = 'LLM DISABLED';

  return { convertedText, tokenUsage };
}

