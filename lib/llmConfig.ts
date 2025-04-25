export interface LLMConfig {
  model: string;
  provider: 'openai' | 'deepseek' | 'gemini' | 'mistral' | 'anthropic';
  contextWindow: number;
  description?: string;
}

export const llmConfig: Record<string, LLMConfig> = {
  'chat-gpt3.5-turbo': {
    model: 'chat-gpt3.5-turbo',
    provider: 'openai',
    contextWindow: 16385,
  },
  'gpt-4': {
    model: 'chat-gpt4',
    provider: 'openai',
    contextWindow: 8192,
  },
  'gpt-4-turbo': {
    model: 'chat-gpt4-turbo',
    provider: 'openai',
    contextWindow: 128000,
  },
  'deepseek-chat': {
    model: 'deepseek-chat',
    provider: 'deepseek',
    contextWindow: 16385,
  },
  'mistral-7b-instruct': {
    model: 'mistral-7b-instruct',
    provider: 'mistral',
    contextWindow: 32768,
  },
  'claude-3-opus': {
    model: 'claude-3-opus',
    provider: 'anthropic',
    contextWindow: 200000,
  },
};

export function getLLMConfig() {
  const llm = process.env.LLM_MODEL || 'chat-gpt3.5-turbo';
  const config = llmConfig[llm];
  return { ...config };
}
