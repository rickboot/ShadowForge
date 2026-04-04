import { z } from 'zod';
import { ModelProvider } from '@/lib/types/llm';
import { LLMRole, getLLMConfig } from '@/lib/llm/llmConfig';
import { deepseekProvider } from '@/lib/llm/providers/deepseekProvider';
import { openAIProvider } from '@/lib/llm/providers/openAiProvider';
import { groqProvider } from './providers/groqProvider';

interface CallLLMOptions {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  role?: LLMRole;
}

function getProvider(providerName: string): ModelProvider {
  switch (providerName) {
    case 'openai':
      return openAIProvider;
    case 'deepseek':
      return deepseekProvider;
    case 'groq':
      return groqProvider;
    default:
      throw new Error(`Unsupported LLM provider: ${providerName}`);
  }
}

export async function callLLMAPI({ systemPrompt, userPrompt, temperature = 0, role }: CallLLMOptions): Promise<string> {
  const llm = getLLMConfig(role);
  const provider = getProvider(llm.provider);
  return provider.call({ model: llm.model, systemPrompt, userPrompt, temperature });
}

export async function callLLMStructured<T>(
  options: CallLLMOptions & { schema: z.ZodType<T> }
): Promise<T> {
  const { systemPrompt, userPrompt, temperature = 0, role, schema } = options;
  const llm = getLLMConfig(role);
  const provider = getProvider(llm.provider);

  const raw = await provider.call({
    model: llm.model,
    systemPrompt,
    userPrompt,
    temperature,
    responseFormat: 'json_object',
  });

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`LLM returned invalid JSON: ${raw.slice(0, 200)}`);
  }

  return schema.parse(parsed);
}
