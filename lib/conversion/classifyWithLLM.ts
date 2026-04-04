import { callLLMStructured } from '@/lib/llm/callLLMAPI';
import { buildClassificationUserPrompt, getClassificationSystemPrompt } from '@/lib/prompts/classificationPrompt';
import { ClassificationResponseSchema } from '@/lib/schemas';
import { ContentBlock } from '@/lib/constants/content';
import { ContentType } from '@/lib/constants/conversion';
import { LLMResult } from '@/lib/types/llm';

export type ClassifiedBlock = ContentBlock & { contentType: ContentType };

export async function classifyWithLLM(blocks: ContentBlock[]): Promise<{ blocks: ClassifiedBlock[]; llmResult: LLMResult }> {
  const input = blocks.map(b => ({ id: b.id, header: b.header, paragraphs: b.paragraphs }));

  const { data: response, llmResult } = await callLLMStructured({
    systemPrompt: getClassificationSystemPrompt(),
    userPrompt: buildClassificationUserPrompt(input),
    role: 'classify',
    schema: ClassificationResponseSchema,
  });

  const typeMap = new Map<string, ContentType>(
    response.blocks.map(b => [b.id, b.contentType as ContentType])
  );

  return {
    blocks: blocks.map(b => ({
      ...b,
      contentType: (typeMap.get(b.id) ?? 'Unknown') as ContentType,
    })),
    llmResult,
  };
}
