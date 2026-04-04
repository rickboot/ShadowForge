import { convertToBlocks } from './convertToBlocks';
import { classifyWithLLM } from './classifyWithLLM';
import { convertToShadowdark } from './convertToShadowdark';
import { renderToMarkdown } from './renderToMarkdown';
import { ConvertedBlock } from '@/lib/schemas';
import { DEFAULT_ADVENTURE_ID } from '@/lib/constants/app';

const CONVERTIBLE_TYPES = new Set([
  'Room', 'Encounter', 'Dungeon', 'Site', 'PointOfInterest',
  'Treasure', 'Monster', 'Character', 'NPC',
]);

export async function runPipeline(
  text: string,
  adventureId?: string,
): Promise<{ convertedText: string }> {
  // 1. Parse text into blocks
  const blocks = convertToBlocks(adventureId ?? DEFAULT_ADVENTURE_ID, text);
  if (blocks.length === 0) {
    return { convertedText: 'No content blocks found.' };
  }

  // 2. Classify all blocks in a single LLM call
  const classified = await classifyWithLLM(blocks);

  // 3. Filter to convertible types
  const toConvert = classified.filter(b => CONVERTIBLE_TYPES.has(b.contentType));
  if (toConvert.length === 0) {
    return { convertedText: 'No convertible content found in the input.' };
  }

  // 4. Convert all blocks in parallel
  const results = await Promise.allSettled(
    toConvert.map(block => {
      const input = [block.header, ...block.paragraphs].filter(Boolean).join('\n\n');
      return convertToShadowdark(input, block.contentType);
    }),
  );

  // 5. Collect successes, log failures
  const convertedBlocks: ConvertedBlock[] = [];
  for (const [i, result] of results.entries()) {
    if (result.status === 'fulfilled') {
      convertedBlocks.push(result.value);
    } else {
      console.error(`[runPipeline] Block "${toConvert[i].header}" failed:`, result.reason);
    }
  }

  if (convertedBlocks.length === 0) {
    return { convertedText: 'Conversion failed for all blocks.' };
  }

  // 6. Render to markdown
  return { convertedText: renderToMarkdown(convertedBlocks) };
}
