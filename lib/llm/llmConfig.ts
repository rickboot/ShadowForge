export type LLMRole = 'classify' | 'convert';

export interface LLMConfig {
  model: string;
  provider: 'openai' | 'deepseek' | 'gemini' | 'mistral' | 'anthropic' | 'groq';
  contextWindow: number;
  description?: string;
}

export const llmConfig: Record<string, LLMConfig> = {
  // ─── OpenAI ───────────────────────────────────────────────────────────────
  'openai-gpt-4o': {
    model: 'gpt-4o',
    provider: 'openai',
    contextWindow: 128000,
    description: 'OpenAI GPT-4o — top quality, multimodal',
  },
  'openai-gpt-4o-mini': {
    model: 'gpt-4o-mini',
    provider: 'openai',
    contextWindow: 128000,
    description: 'OpenAI GPT-4o Mini — fast, cheap, strong at structured tasks',
  },
  // Legacy — kept for backwards compatibility
  'openai-gpt-4': {
    model: 'gpt-4',
    provider: 'openai',
    contextWindow: 8192,
    description: 'OpenAI GPT-4 (legacy)',
  },
  'openai-gpt-4-turbo': {
    model: 'gpt-4-turbo',
    provider: 'openai',
    contextWindow: 128000,
    description: 'OpenAI GPT-4 Turbo (legacy)',
  },
  'openai-gpt-3.5-turbo': {
    model: 'gpt-3.5-turbo',
    provider: 'openai',
    contextWindow: 16384,
    description: 'OpenAI GPT-3.5 Turbo (legacy)',
  },

  // ─── Anthropic ────────────────────────────────────────────────────────────
  'anthropic-claude-3-7-sonnet': {
    model: 'claude-3-7-sonnet-20250219',
    provider: 'anthropic',
    contextWindow: 200000,
    description: 'Claude 3.7 Sonnet — strongest reasoning, extended thinking',
  },
  'anthropic-claude-3-5-sonnet': {
    model: 'claude-3-5-sonnet-20241022',
    provider: 'anthropic',
    contextWindow: 200000,
    description: 'Claude 3.5 Sonnet — excellent quality and speed',
  },
  'anthropic-claude-3-5-haiku': {
    model: 'claude-3-5-haiku-20241022',
    provider: 'anthropic',
    contextWindow: 200000,
    description: 'Claude 3.5 Haiku — fast and affordable',
  },
  // Legacy
  'anthropic-claude-3-haiku': {
    model: 'claude-3-haiku-20240307',
    provider: 'anthropic',
    contextWindow: 200000,
    description: 'Claude 3 Haiku (legacy)',
  },
  'anthropic-claude-3-opus': {
    model: 'claude-3-opus-20240229',
    provider: 'anthropic',
    contextWindow: 200000,
    description: 'Claude 3 Opus (legacy)',
  },

  // ─── DeepSeek ─────────────────────────────────────────────────────────────
  'deepseek-v3': {
    model: 'deepseek-chat',
    provider: 'deepseek',
    contextWindow: 64000,
    description: 'DeepSeek V3 — GPT-4 class, very low cost',
  },
  // Legacy
  'deepseek-chat': {
    model: 'deepseek-chat',
    provider: 'deepseek',
    contextWindow: 64000,
    description: 'DeepSeek Chat (legacy alias for deepseek-v3)',
  },

  // ─── Groq ─────────────────────────────────────────────────────────────────
  'groq-llama-3-3-70b': {
    model: 'llama-3.3-70b-versatile',
    provider: 'groq',
    contextWindow: 128000,
    description: 'LLaMA 3.3 70B via Groq — strong reasoning, fast inference',
  },
  'groq-llama-3-1-8b': {
    model: 'llama-3.1-8b-instant',
    provider: 'groq',
    contextWindow: 128000,
    description: 'LLaMA 3.1 8B via Groq — very fast, low cost, good for classification',
  },
  // Legacy
  'groq-llama3-70b': {
    model: 'llama3-70b-8192',
    provider: 'groq',
    contextWindow: 8192,
    description: 'LLaMA3 70B via Groq (legacy)',
  },
  'groq-llama3-8b': {
    model: 'llama3-8b-8192',
    provider: 'groq',
    contextWindow: 8192,
    description: 'LLaMA3 8B via Groq (legacy)',
  },
  'groq-mixtral-8x7b': {
    model: 'mixtral-8x7b-32768',
    provider: 'groq',
    contextWindow: 32768,
    description: 'Mixtral 8x7B via Groq (legacy)',
  },

  // ─── Mistral ──────────────────────────────────────────────────────────────
  'mistral-mistral-7b-instruct': {
    model: 'mistral-7b-instruct',
    provider: 'mistral',
    contextWindow: 32768,
    description: 'Mistral 7B Instruct (legacy)',
  },

  // ─── Gemini ───────────────────────────────────────────────────────────────
  'gemini-1.5-pro': {
    model: 'gemini-1.5-pro',
    provider: 'gemini',
    contextWindow: 1000000,
    description: 'Google Gemini 1.5 Pro — massive context window',
  },
};

const ROLE_DEFAULTS: Record<LLMRole, string> = {
  classify: 'openai-gpt-4o-mini',
  convert: 'openai-gpt-4o',
};

const ROLE_ENV_VARS: Record<LLMRole, string> = {
  classify: 'LLM_CLASSIFY_MODEL',
  convert: 'LLM_CONVERT_MODEL',
};

const LEGACY_FALLBACK = 'openai-gpt-4o-mini';

export function getLLMConfig(role?: LLMRole): LLMConfig {
  let key: string;

  if (role) {
    key = process.env[ROLE_ENV_VARS[role]] ?? ROLE_DEFAULTS[role];
  } else {
    key = process.env.LLM_MODEL ?? LEGACY_FALLBACK;
  }

  const config = llmConfig[key];
  if (!config) {
    console.warn(`[LLMConfig] Unknown model key "${key}", falling back to ${LEGACY_FALLBACK}`);
    return llmConfig[LEGACY_FALLBACK];
  }

  return { ...config };
}
