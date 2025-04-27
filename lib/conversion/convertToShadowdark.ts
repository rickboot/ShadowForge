import { callLLMAPI } from '@/lib/llm/callLLMAPI';
import { shadowdarkPrompt } from '@/lib/prompts/shadowdarkPrompt';

export async function convertToShadowdark(input: string): Promise<string> {
  const userPrompt = `Convert this DnD 5e room to Shadowdark format:\n\n${input}`;

  const result = await callLLMAPI({
    systemPrompt: shadowdarkPrompt,
    userPrompt,
    temperature: 0.3,
  });

  return result || 'Conversion failed.';
}
