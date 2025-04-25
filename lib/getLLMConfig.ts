import { llmConfig } from './llmConfig';

export function getLLMConfig() {
  const llm = process.env.LLM_PROVIDER || 'openai';
  const config = llmConfig[llm];
  return { ...config };
}
