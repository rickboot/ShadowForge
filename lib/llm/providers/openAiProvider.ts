import OpenAI from 'openai';
import { ModelProvider } from '../../types/llm';
import { ChatCompletionMessageParam } from 'openai/resources';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const openAIProvider: ModelProvider = {
  name: 'openai',

  async call({ systemPrompt, userPrompt, model, temperature }) {
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
      console.log(`CALLING ${model}`);
      return completion.choices[0]?.message?.content?.trim() || '';
    } catch (error) {
      console.error('[OpenAIProvider] Error:', error);
      if (error instanceof Error) {
        return `OpenAI error: ${error.message}`;
      }
      return 'OpenAI error: Unknown error occurred.';
    }
  },
};
