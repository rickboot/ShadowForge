import { NextRequest, NextResponse } from 'next/server';
import { runConversionPipeline } from '@/lib/conversion/runConversionPipeline';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { text, adventureId } = body;

  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'Invalid input: text is required' }, { status: 400 });
  }

  const { convertedText } = await runConversionPipeline({ text, adventureId });

  return NextResponse.json({ convertedText });
}
