import { NextRequest, NextResponse } from 'next/server';
import { convertToShadowdark } from '@/lib/convertToShadowdark';
import { normalizeInputText } from '@/lib/normalizeInputText';
import { chunkInputText } from '@/lib/chunkInputText';

export async function POST(req: NextRequest) {
  const body = await req.json();
  let { text, normalize } = body;

  normalize = normalize === true;

  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  if (normalize) {
    text = normalizeInputText(text);
  }

  const chunks = chunkInputText(text);

  const convertedChunks = await Promise.all(
    chunks.map((chunk) => convertToShadowdark(chunk))
  );

  console.log('[convert] normalize:', normalize);
  console.log(`[convert] chunks created: ${chunks.length}`);

  return new NextResponse(
    JSON.stringify({ converted: convertedChunks.join('\n\n') }),
    { status: 200 }
  );
}
