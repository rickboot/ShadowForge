import OpenAI from 'openai';
import { ModelProvider } from '../../types/llm';
import { ChatCompletionMessageParam } from 'openai/resources';

let client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!client) client = new OpenAI({ baseURL: 'https://api.groq.com/openai/v1', apiKey: process.env.GROQ_API_KEY });
  return client;
}

export const groqProvider: ModelProvider = {
  name: 'groq',

  async call({ systemPrompt, userPrompt, model, temperature = 0, responseFormat }) {
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const completion = await getClient().chat.completions.create({
      model,
      temperature,
      messages,
      ...(responseFormat === 'json_object' && { response_format: { type: 'json_object' } }),
    });

    return completion.choices[0]?.message?.content?.trim() ?? '';
  },
};
