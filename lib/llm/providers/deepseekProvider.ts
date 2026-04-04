import OpenAI from 'openai';
import { ModelProvider, LLMResult } from '../../types/llm';
import { ChatCompletionMessageParam } from 'openai/resources';

let client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!client) client = new OpenAI({ baseURL: 'https://api.deepseek.com/v1', apiKey: process.env.DEEPSEEK_API_KEY });
  return client;
}

export const deepseekProvider: ModelProvider = {
  name: 'deepseek',

  async call({ systemPrompt, userPrompt, model, temperature = 0, responseFormat }): Promise<LLMResult> {
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

    return {
      text: completion.choices[0]?.message?.content?.trim() ?? '',
      model,
      usage: {
        inputTokens: completion.usage?.prompt_tokens ?? 0,
        outputTokens: completion.usage?.completion_tokens ?? 0,
      },
    };
  },
};
