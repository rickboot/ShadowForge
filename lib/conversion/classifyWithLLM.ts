import { callLLMAPI } from '../llm/callLLMAPI';
import { CLASSIFICATION_PROMPT } from '../prompts/classificationPrompt';
import { ClassifiedContent } from './classifyWithKeywords';
import { ContentBlock } from './runConversionPipeline';

export async function classifyWithLLM(blocks: ContentBlock[]): Promise<ClassifiedContent[]> {
  const userPrompt = `Classify the following DnD 5e room to Shadowdark format:\n\n${JSON.stringify(blocks)}`;

  const result = await callLLMAPI({
    systemPrompt: CLASSIFICATION_PROMPT,
    userPrompt,
    temperature: 0,
  });

  return JSON.parse(result);
}
