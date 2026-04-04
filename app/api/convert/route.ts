import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runPipeline } from '@/lib/conversion/runPipeline';
import { MAX_INPUT_CHARS } from '@/lib/constants/limits';

const RequestSchema = z.object({
  text: z.string().min(1, 'text is required').max(MAX_INPUT_CHARS, `Input exceeds ${MAX_INPUT_CHARS} character limit`),
  adventureId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? 'Invalid request' },
      { status: 400 },
    );
  }

  const { text, adventureId } = parsed.data;

  try {
    const { convertedText, telemetry } = await runPipeline(text, adventureId);
    return NextResponse.json({ convertedText, telemetry });
  } catch (error) {
    console.error('[/api/convert] Pipeline error:', error);
    return NextResponse.json({ error: 'Conversion failed' }, { status: 500 });
  }
}
