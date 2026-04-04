import { callLLMStructured } from '@/lib/llm/callLLMAPI';
import { buildClassificationUserPrompt, getClassificationSystemPrompt } from '@/lib/prompts/classificationPrompt';
import { ClassificationResponseSchema } from '@/lib/schemas';
import { ContentBlock } from '@/lib/constants/content';
import { ContentType } from '@/lib/constants/conversion';

export type ClassifiedBlock = ContentBlock & { contentType: ContentType };

export async function classifyWithLLM(blocks: ContentBlock[]): Promise<ClassifiedBlock[]> {
  const input = blocks.map(b => ({ id: b.id, header: b.header, paragraphs: b.paragraphs }));

  const response = await callLLMStructured({
    systemPrompt: getClassificationSystemPrompt(),
    userPrompt: buildClassificationUserPrompt(input),
    role: 'classify',
    schema: ClassificationResponseSchema,
  });

  const typeMap = new Map(response.blocks.map(b => [b.id, b.contentType]));

  return blocks.map(b => ({
    ...b,
    contentType: typeMap.get(b.id) ?? 'Unknown',
  }));
}
