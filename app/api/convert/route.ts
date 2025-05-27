import { NextRequest, NextResponse } from 'next/server';
import { runConversionPipeline } from '@/lib/conversion/runConversionPipeline';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const text = body.text;
  const blockBasedConversion = body.blockBasedConversion === true;

  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  //! Run conversion pipeline
  const result = await runConversionPipeline({
    text,
    blockBasedConversion,
  });

  if (!result) {
    return NextResponse.json({ error: 'Conversion failed' }, { status: 500 });
  }

  const { convertedText, tokenUsage } = result;
  return new NextResponse(JSON.stringify({ convertedText, tokenUsage }), {
    status: 200,
  });
}
