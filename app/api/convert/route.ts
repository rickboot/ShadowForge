import { NextRequest, NextResponse } from 'next/server';
import { convertToShadowdark } from '@/lib/convertToShadowdark';
import { normalizeInputText } from '@/lib/normalizeInputText';
import { chunkInputText } from '@/lib/chunkInputText';
import { logTokenUsage } from '@/lib/tokenTracker';

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

  let tokenTotal = 0;
  const convertedChunks: string[] = [];
  for (const [i, chunk] of chunks.entries()) {
    const converted = await convertToShadowdark(chunk);
    convertedChunks.push(converted);
    tokenTotal += logTokenUsage(`Input chunked ${i + 1}:`, chunk);
  }
  console.log(
    `\x1b[36m[Token Debug]\x1b[0m \x1b[33mTotal input usage: ${tokenTotal}\x1b[0m`,
  );

  const convertedText = convertedChunks.join('\n\n');
  logTokenUsage('Converted output:', convertedText);

  return new NextResponse(JSON.stringify({ convertedText }), {
    status: 200,
  });
}
