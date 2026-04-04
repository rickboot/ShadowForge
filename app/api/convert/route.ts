import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
import { z } from 'zod';
import { convertToBlocks } from '@/lib/conversion/convertToBlocks';
import { classifyWithLLM } from '@/lib/conversion/classifyWithLLM';
import { convertToShadowdark } from '@/lib/conversion/convertToShadowdark';
import { renderBlockToMarkdown } from '@/lib/conversion/renderToMarkdown';
import { calculateCost } from '@/lib/pricing/modelPricing';
import { LLMResult, Telemetry } from '@/lib/types/llm';
import { MAX_INPUT_CHARS } from '@/lib/constants/limits';
import { DEFAULT_ADVENTURE_ID } from '@/lib/constants/app';

const CONVERTIBLE_TYPES = new Set([
  'Room', 'Encounter', 'Dungeon', 'Site', 'PointOfInterest',
  'Treasure', 'Monster', 'Character', 'NPC',
]);

const RequestSchema = z.object({
  text: z.string().min(1, 'text is required').max(MAX_INPUT_CHARS, `Input exceeds ${MAX_INPUT_CHARS} character limit`),
  adventureId: z.string().optional(),
});

const encoder = new TextEncoder();

function aggregateTelemetry(results: LLMResult[]): Telemetry {
  const models = [...new Set(results.map(r => r.model))];
  const inputTokens = results.reduce((sum, r) => sum + r.usage.inputTokens, 0);
  const outputTokens = results.reduce((sum, r) => sum + r.usage.outputTokens, 0);
  const cost = calculateCost(results.map(r => ({
    model: r.model,
    inputTokens: r.usage.inputTokens,
    outputTokens: r.usage.outputTokens,
  })));
  return { models, inputTokens, outputTokens, cost };
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response('{"error":"Invalid JSON body"}', { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? 'Invalid request';
    return new Response(JSON.stringify({ error: message }), { status: 400 });
  }

  const { text, adventureId } = parsed.data;

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  const send = (data: object) =>
    writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

  (async () => {
    try {
      const blocks = convertToBlocks(adventureId ?? DEFAULT_ADVENTURE_ID, text);

      if (blocks.length === 0) {
        await send({ type: 'error', message: 'No content blocks found.' });
        return;
      }

      await send({ type: 'start' });

      const { blocks: classified, llmResult: classifyResult } = await classifyWithLLM(blocks);
      const toConvert = classified.filter(b => CONVERTIBLE_TYPES.has(b.contentType));

      if (toConvert.length === 0) {
        await send({ type: 'error', message: 'No convertible content found in the input.' });
        return;
      }

      await send({ type: 'classified', total: toConvert.length });

      const llmResults: LLMResult[] = [classifyResult];
      let completed = 0;

      await Promise.allSettled(
        toConvert.map(async (block) => {
          try {
            const input = [block.header, ...block.paragraphs].filter(Boolean).join('\n\n');
            const { block: converted, llmResult } = await convertToShadowdark(input, block.contentType);
            llmResults.push(llmResult);
            completed++;
            await send({
              type: 'block',
              content: renderBlockToMarkdown(converted),
              completed,
              total: toConvert.length,
            });
          } catch (err) {
            completed++;
            console.error(`[/api/convert] Block "${block.header}" failed:`, err);
            await send({ type: 'block_error', completed, total: toConvert.length });
          }
        }),
      );

      await send({ type: 'done', telemetry: aggregateTelemetry(llmResults) });
    } catch (err) {
      console.error('[/api/convert] Pipeline error:', err);
      await send({ type: 'error', message: 'Conversion failed.' });
    } finally {
      writer.close();
    }
  })();

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
