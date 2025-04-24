import { callLLM } from './llm/callLLM';
import { shadowdarkPrompt } from './prompts/shadowdarkPrompt';

export async function convertToShadowdark(input: string): Promise<string> {
  const userPrompt = `Convert this DnD 5e room to Shadowdark format:\n\n${input}`;

  const result = await callLLM({
    systemPrompt: shadowdarkPrompt,
    userPrompt,
    // model: 'gpt-3.5-turbo',
    temperature: 0.3,
  });

  return result || 'Conversion failed.';
}
