import OpenAI from 'openai';
import { ModelProvider } from '../types';
import { ChatCompletionMessageParam } from 'openai/resources';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const openAIProvider: ModelProvider = {
  name: 'openai',

  async call({
    systemPrompt,
    userPrompt,
    model = 'gpt-3.5-turbo',
    temperature = 0.3,
  }) {
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const completion = await openai.chat.completions.create({
      model,
      temperature,
      messages,
    });

    return completion.choices[0]?.message?.content?.trim() || '';
  },
};
