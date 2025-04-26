import { chunkText } from '@/lib/conversion/chunkText';
import { convertToShadowdark } from '@/lib/conversion/convertToShadowdark';
import { logTokenUsage } from '@/lib/utils/tokenUtils';
import { normalizeText } from '@/lib/conversion/normalizeText';

interface runConversionPipelineProps {
  text: string;
  normalize: boolean;
}

export async function runConversionPipeline({
  text,
  normalize,
}: runConversionPipelineProps) {
  if (normalize) {
    text = normalizeText(text);
  }

  const chunks = chunkText(text);

  const convertedChunks: string[] = [];
  let tokenUsage = 0;

  for (const [i, chunk] of chunks.entries()) {
    const converted = await convertToShadowdark(chunk);
    convertedChunks.push(converted);
    tokenUsage += logTokenUsage(`Input chunk ${i + 1}:`, chunk);
  }

  const convertedText = convertedChunks.join('\n\n');

  console.log(
    `\x1b[36m[Token Debug]\x1b[0m \x1b[33mTotal input usage: ${tokenUsage}\x1b[0m`,
  );
  logTokenUsage('Converted output:', convertedText);

  return { convertedText, tokenUsage };
}
