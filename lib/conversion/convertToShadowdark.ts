import { callLLMStructured } from '@/lib/llm/callLLMAPI';
import { buildShadowdarkConversionPrompt, getShadowdarkSystemPrompt } from '@/lib/prompts/shadowdarkPrompt';
import { ConvertedBlockSchema, ConvertedBlock } from '@/lib/schemas';
import { ContentType } from '@/lib/constants/conversion';
import { LLMResult } from '@/lib/types/llm';

export async function convertToShadowdark(input: string, contentType?: ContentType): Promise<{ block: ConvertedBlock; llmResult: LLMResult }> {
  const { data, llmResult } = await callLLMStructured({
    systemPrompt: getShadowdarkSystemPrompt(),
    userPrompt: buildShadowdarkConversionPrompt(input, contentType),
    role: 'convert',
    schema: ConvertedBlockSchema,
  });
  return { block: data, llmResult };
}
