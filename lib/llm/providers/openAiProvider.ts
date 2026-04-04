import OpenAI from 'openai';
import { ModelProvider } from '../../types/llm';
import { ChatCompletionMessageParam } from 'openai/resources';

let client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!client) client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

export const openAIProvider: ModelProvider = {
  name: 'openai',

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
