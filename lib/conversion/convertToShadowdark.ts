import { callLLMStructured } from '@/lib/llm/callLLMAPI';
import { buildShadowdarkConversionPrompt, getShadowdarkSystemPrompt } from '@/lib/prompts/shadowdarkPrompt';
import { ConvertedBlockSchema, ConvertedBlock } from '@/lib/schemas';
import { ContentType } from '@/lib/constants/conversion';

export async function convertToShadowdark(input: string, contentType?: ContentType): Promise<ConvertedBlock> {
  return callLLMStructured({
    systemPrompt: getShadowdarkSystemPrompt(),
    userPrompt: buildShadowdarkConversionPrompt(input, contentType),
    role: 'convert',
    schema: ConvertedBlockSchema,
  });
}
