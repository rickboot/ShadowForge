import { ModelProvider } from './types';
import { deepseekProvider } from './providers/deepseekProvider';
import { openAIProvider } from './providers/openAiProvider';
import { getLLMConfig } from '../getLLMConfig';

const providerName = getLLMConfig().provider;

const currentProvider: ModelProvider =
  // todo: more providers
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
