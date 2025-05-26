import { NextRequest, NextResponse } from 'next/server';
import { runConversionPipeline } from '@/lib/conversion/runConversionPipeline';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const text = body.text;
  const blockBasedConversion = body.blockBasedConversion === true;

  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { convertedText, tokenUsage } = await runConversionPipeline({
    text,
    blockBasedConversion,
  });

  return new NextResponse(JSON.stringify({ convertedText, tokenUsage }), {
    status: 200,
  });
}
