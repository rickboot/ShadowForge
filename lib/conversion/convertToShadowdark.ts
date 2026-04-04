import { callLLMStructured } from '@/lib/llm/callLLMAPI';
import { buildShadowdarkConversionPrompt, SHADOWDARK_SYSTEM_PROMPT } from '@/lib/prompts/shadowdarkPrompt';
import { ConvertedBlockSchema, ConvertedBlock } from '@/lib/schemas';
import { ContentType } from '@/lib/constants/conversion';

export async function convertToShadowdark(input: string, contentType?: ContentType): Promise<ConvertedBlock> {
  return callLLMStructured({
    systemPrompt: SHADOWDARK_SYSTEM_PROMPT,
    userPrompt: buildShadowdarkConversionPrompt(input, contentType),
    role: 'convert',
    schema: ConvertedBlockSchema,
  });
}
