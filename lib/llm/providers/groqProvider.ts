import OpenAI from 'openai';
import { ModelProvider } from '../../types/llm';
import { ChatCompletionMessageParam } from 'openai/resources';

const openai = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export const groqProvider: ModelProvider = {
  name: 'groq',

  async call({ systemPrompt, userPrompt, model, temperature = 0.3 }) {
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
      console.error('[Groq] Error:', error);
      if (error instanceof Error) {
        return `Groq error: ${error.message}`;
      }
      return 'Groq error: Unknown error occurred.';
    }
  },
};

