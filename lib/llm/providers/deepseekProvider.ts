import OpenAI from 'openai';
import { ModelProvider } from '../../types/llm';
import { ChatCompletionMessageParam } from 'openai/resources';

export const deepseekProvider: ModelProvider = {
  name: 'deepseek',

  async call({ systemPrompt, userPrompt, model, temperature = 0 }) {
    const openai = new OpenAI({
      baseURL: 'https://api.deepseek.com/v1', // No trailing slash
      apiKey: process.env.DEEPSEEK_API_KEY,
      dangerouslyAllowBrowser: process.env.NODE_ENV !== 'production',
    });
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];
    try {
      const completion = await openai.chat.completions.create({
        model,
        temperature,
        messages,
      });
      return completion.choices[0]?.message?.content?.trim() || '';
    } catch (error) {
      console.error('[Deepseek] Error:', error);
      if (error instanceof Error) {
        return `Deepseek error: ${error.message}`;
      }
      return 'Deepseek error: Unknown error occurred.';
    }
  },
};
