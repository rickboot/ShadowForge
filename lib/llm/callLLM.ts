import { ModelProvider } from './types';
import { openAIProvider } from './providers/openAiProvider';

//todo: swap provider from config or env
const currentProvider: ModelProvider = openAIProvider;

interface CallLLMOptions {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  temperature?: number;
}

export async function callLLM(options: CallLLMOptions): Promise<string> {
  return currentProvider.call(options);
}
