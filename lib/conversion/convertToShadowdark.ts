import { callLLMAPI } from '@/lib/llm/callLLMAPI';
import { buildShadowdarkConversionPrompt, SHADOWDARK_SYSTEM_PROMPT } from '@/lib/prompts/shadowdarkPrompt';

export async function convertToShadowdark(input: string): Promise<string> {
  const userPrompt = buildShadowdarkConversionPrompt(input);

  const result = await callLLMAPI({
    systemPrompt: SHADOWDARK_SYSTEM_PROMPT,
    userPrompt,
    temperature: 0,
  });

  return result || 'Conversion failed.';
}
