import { ModelProvider } from '@/lib/types/llm';
import { deepseekProvider } from '@/lib/llm/providers/deepseekProvider';
import { openAIProvider } from '@/lib/llm/providers/openAiProvider';
import { getLLMConfig } from '@/lib/llm/llmConfig';

const llmModel = getLLMConfig().model;

const currentProvider: ModelProvider =
  llmModel === 'chat-gpt3.5-turbo' ? openAIProvider : deepseekProvider;
interface CallLLMOptions {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  temperature?: number;
}

export async function callLLMAPI(options: CallLLMOptions): Promise<string> {
  return currentProvider.call(options);
}
