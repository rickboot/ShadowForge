import { convertToBlocks } from './convertToBlocks'
import { classifyWithKeywords } from './classifyWithKeywords'
import { classifyWithLLM } from './classifyWithLLM';
import { DEFAULT_ADVENTURE_ID } from '@/lib/constants/app';

interface runConversionPipelineProps {
  text: string;
  adventureId?: string;
}

export async function runConversionPipeline({
  text,
  adventureId,
}: runConversionPipelineProps) {

  const blocksRaw = convertToBlocks(adventureId ?? DEFAULT_ADVENTURE_ID, text);

  const keywordClassified = classifyWithKeywords(blocksRaw);

  const unknownBlocks = keywordClassified.filter((block) => block.contentType === 'Unknown');
  const llmClassified = await classifyWithLLM(unknownBlocks);

  const allClassified = [...keywordClassified.filter((block) => block.contentType !== 'Unknown'), ...llmClassified];

  if (process.env.NODE_ENV !== 'production') {
    console.log('########## Classified Blocks ##########');
    console.log(allClassified.sort((a, b) => a.sequence - b.sequence));
  }


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

