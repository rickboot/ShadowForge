import { z } from 'zod';
import { ModelProvider, LLMResult } from '@/lib/types/llm';
import { LLMRole, getLLMConfig } from '@/lib/llm/llmConfig';
import { deepseekProvider } from '@/lib/llm/providers/deepseekProvider';
import { openAIProvider } from '@/lib/llm/providers/openAiProvider';
import { groqProvider } from './providers/groqProvider';
import { LLM_TIMEOUT_MS } from '@/lib/constants/limits';

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

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`LLM request timed out after ${ms}ms`)), ms),
    ),
  ]);
}

export async function callLLMAPI({ systemPrompt, userPrompt, temperature = 0, role }: CallLLMOptions): Promise<LLMResult> {
  const llm = getLLMConfig(role);
  const provider = getProvider(llm.provider);
  return withTimeout(
    provider.call({ model: llm.model, systemPrompt, userPrompt, temperature }),
    LLM_TIMEOUT_MS,
  );
}

export async function callLLMStructured<T>(
  options: CallLLMOptions & { schema: z.ZodType<T> },
): Promise<{ data: T; llmResult: LLMResult }> {
  const { systemPrompt, userPrompt, temperature = 0, role, schema } = options;
  const llm = getLLMConfig(role);
  const provider = getProvider(llm.provider);

  const llmResult = await withTimeout(
    provider.call({ model: llm.model, systemPrompt, userPrompt, temperature, responseFormat: 'json_object' }),
    LLM_TIMEOUT_MS,
  );

  let parsed: unknown;
  try {
    parsed = JSON.parse(llmResult.text);
  } catch {
    throw new Error(`LLM returned invalid JSON: ${llmResult.text.slice(0, 200)}`);
  }

  return { data: schema.parse(parsed), llmResult };
}
