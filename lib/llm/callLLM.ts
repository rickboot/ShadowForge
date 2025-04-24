import { ModelProvider } from './types';
import { deepseekProvider } from './providers/deepseekProvider';
import { openAIProvider } from './providers/openAiProvider';

const providerName = process.env.LLM_PROVIDER || 'openai';

const currentProvider: ModelProvider =
  providerName === 'openai' ? openAIProvider : deepseekProvider;
interface CallLLMOptions {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  temperature?: number;
}

export async function callLLM(options: CallLLMOptions): Promise<string> {
  return currentProvider.call(options);
}
