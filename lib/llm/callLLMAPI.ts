import { ModelProvider } from '@/lib/types/llm';
import { deepseekProvider } from '@/lib/llm/providers/deepseekProvider';
import { openAIProvider } from '@/lib/llm/providers/openAiProvider';
import { getLLMConfig } from '@/lib/llm/llmConfig';
import { groqProvider } from './providers/groqProvider';

interface CallLLMOptions {
  systemPrompt: string;
  userPrompt: string;
  temperature: number;
}

export async function callLLMAPI({
  systemPrompt,
  userPrompt,
  temperature,
}: CallLLMOptions) {
  const llm = getLLMConfig();
  console.log('LLM', llm);

  let provider: ModelProvider = openAIProvider;

  switch (llm.provider) {
    case 'openai':
      provider = openAIProvider;
      break;
    case 'deepseek':
      provider = deepseekProvider;
      break;
    case 'groq':
      provider = groqProvider;
      break;
    default:
      throw new Error(`Unsupported LLM provider: ${llm.provider}`);
  }

  return provider.call({
    model: llm.model,
    systemPrompt,
    userPrompt,
    temperature,
  });
}
