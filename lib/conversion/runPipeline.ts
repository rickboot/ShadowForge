import { convertToBlocks } from './convertToBlocks';
import { classifyWithLLM } from './classifyWithLLM';
import { convertToShadowdark } from './convertToShadowdark';
import { renderToMarkdown } from './renderToMarkdown';
import { ConvertedBlock } from '@/lib/schemas';
import { DEFAULT_ADVENTURE_ID } from '@/lib/constants/app';
import { Telemetry, LLMResult } from '@/lib/types/llm';
import { calculateCost } from '@/lib/pricing/modelPricing';

const CONVERTIBLE_TYPES = new Set([
  'Room', 'Encounter', 'Dungeon', 'Site', 'PointOfInterest',
  'Treasure', 'Monster', 'Character', 'NPC',
]);

function aggregateTelemetry(results: LLMResult[]): Telemetry {
  const models = [...new Set(results.map(r => r.model))];
  const inputTokens = results.reduce((sum, r) => sum + r.usage.inputTokens, 0);
  const outputTokens = results.reduce((sum, r) => sum + r.usage.outputTokens, 0);
  const cost = calculateCost(results.map(r => ({ model: r.model, inputTokens: r.usage.inputTokens, outputTokens: r.usage.outputTokens })));
  return { models, inputTokens, outputTokens, cost };
}

export async function runPipeline(
  text: string,
  adventureId?: string,
): Promise<{ convertedText: string; telemetry: Telemetry }> {
  // 1. Parse text into blocks
  const blocks = convertToBlocks(adventureId ?? DEFAULT_ADVENTURE_ID, text);
  if (blocks.length === 0) {
    return { convertedText: 'No content blocks found.', telemetry: { models: [], inputTokens: 0, outputTokens: 0, cost: 0 } };
  }

  // 2. Classify all blocks in a single LLM call
  const { blocks: classified, llmResult: classifyResult } = await classifyWithLLM(blocks);
  const llmResults: LLMResult[] = [classifyResult];

  // 3. Filter to convertible types
  const toConvert = classified.filter(b => CONVERTIBLE_TYPES.has(b.contentType));
  if (toConvert.length === 0) {
    return { convertedText: 'No convertible content found in the input.', telemetry: aggregateTelemetry(llmResults) };
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
      convertedBlocks.push(result.value.block);
      llmResults.push(result.value.llmResult);
    } else {
      console.error(`[runPipeline] Block "${toConvert[i].header}" failed:`, result.reason);
    }
  }

  if (convertedBlocks.length === 0) {
    return { convertedText: 'Conversion failed for all blocks.', telemetry: aggregateTelemetry(llmResults) };
  }

  // 6. Render to markdown
  return { convertedText: renderToMarkdown(convertedBlocks), telemetry: aggregateTelemetry(llmResults) };
}
