import { convertToBlocks } from './convertToBlocks'
import { classifyWithKeywords } from './classifyWithKeywords'
import { classifyWithLLM } from './classifyWithLLM';
import { DEFAULT_ADVENTURE_ID } from '@/lib/constants/app';
import { convertToShadowdark } from './convertToShadowdark';
import { logTokenUsage } from '../utils/tokenUtils';

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

  const CONTENT_TYPES_TO_CONVERT = ['Room', 'Encounter', 'Dungeon', 'Site', 'PointOfInterest', 'Treasure', 'Monster', 'NPC'];

  const blocksToConvert = allClassified.filter((block) => CONTENT_TYPES_TO_CONVERT.includes(block.contentType));
  let tokenUsage = 0;
  const convertedChunks: string[] = [];

  for (const block of blocksToConvert) {
    const inputText = block.header + '\n\n' + block.paragraphs.join('\n');
    const convertedText = await convertToShadowdark(inputText);
    convertedChunks.push(convertedText);

    tokenUsage += logTokenUsage(`Input chunk ${block.sequence}:`, inputText);
    tokenUsage += logTokenUsage(`Converted chunk ${block.sequence}:`, convertedText);
  }

  const convertedText = convertedChunks.join('\n\n');
  if (convertedText.trim() === '') {
    return { convertedText: 'Conversion failed.', tokenUsage };
  }

  return { convertedText, tokenUsage };
}



// 'Adventure',
// 'Region',
// 'City',
// 'Site',
// 'Encounter',
// 'Dungeon',
// 'Room',
// 'PointOfInterest',
// 'Monster',
// 'Treasure',
// 'Character',
// 'NPC',
// 'MagicItem',
// 'Intro',
// 'Lore',
// 'Quest',
// 'CharacterBio',
// 'GMGuidance',
// 'TOC',
// 'Credits',
// 'Appendix',
// 'Glossary',
// 'Index',
// 'Unknown',