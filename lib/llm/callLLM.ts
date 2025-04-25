import { ModelProvider } from './types';
import { deepseekProvider } from './providers/deepseekProvider';
import { openAIProvider } from './providers/openAiProvider';
import { getLLMConfig } from '../llmConfig';

const llmModel = getLLMConfig().model;

const currentProvider: ModelProvider =
  llmModel === 'chat-gpt3.5-turbo' ? openAIProvider : deepseekProvider;
interface CallLLMOptions {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  temperature?: number;
}

export async function callLLM(options: CallLLMOptions): Promise<string> {
  return currentProvider.call(options);
}
