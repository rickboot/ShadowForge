import { NextRequest, NextResponse } from 'next/server';
import { convertToShadowdark } from '@/lib/convertToShadowdark';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const text = body.text;

  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const converted = await convertToShadowdark(text);
  return new NextResponse(JSON.stringify({ converted }), { status: 200 });
}
