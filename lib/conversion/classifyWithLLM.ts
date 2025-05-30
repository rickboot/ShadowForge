import { callLLMAPI } from '../llm/callLLMAPI';
import { buildClassificationUserPrompt, CLASSIFICATION_SYSTEM_PROMPT } from '../prompts/classificationPrompt';
import { ClassifiedContent } from '../constants/content';
import { ContentBlock } from '../constants/content';

export async function classifyWithLLM(blocks: ContentBlock[]): Promise<ClassifiedContent[]> {
  const userPrompt = buildClassificationUserPrompt(blocks);

  const result = await callLLMAPI({
    systemPrompt: CLASSIFICATION_SYSTEM_PROMPT,
    userPrompt,
    temperature: 0,
  });

  // TODO: Shape checking and error handling
  return JSON.parse(result);
}
