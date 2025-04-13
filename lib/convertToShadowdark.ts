import OpenAI from 'openai';
import { shadowdarkPrompt } from './prompts/shadowdarkPrompt';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function convertToShadowdark(input: string): Promise<string> {
  const userPrompt = `Convert this DnD 5e room to Shadowdark format:\n\n${input}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    temperature: 0.3,
    messages: [
      { role: 'system', content: shadowdarkPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  const content = completion.choices[0]?.message?.content?.trim();
  return content || 'Conversion failed.';
}
