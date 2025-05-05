export interface LLMConfig {
  model: string;
  provider: 'openai' | 'deepseek' | 'gemini' | 'mistral' | 'anthropic' | 'groq';
  contextWindow: number;
  description?: string;
}

export const llmConfig: Record<string, LLMConfig> = {
  // --- Anthropic ---
  'claude-3-haiku': {
    model: 'claude-3-haiku-20240307',
    provider: 'anthropic',
    contextWindow: 200000,
    description: 'Anthropic Claude 3 Haiku (fastest, lowest-cost Claude)',
  },
  'claude-3-sonnet': {
    model: 'claude-3-sonnet-20240229',
    provider: 'anthropic',
    contextWindow: 200000,
    description: 'Anthropic Claude 3 Sonnet (balanced cost and reasoning)',
  },
  'claude-3-opus': {
    model: 'claude-3-opus-20240229',
    provider: 'anthropic',
    contextWindow: 200000,
    description: 'Anthropic Claude 3 Opus (highest reasoning, most expensive)',
  },

  // --- DeepSeek ---
  'deepseek-chat': {
    model: 'deepseek-chat',
    provider: 'deepseek',
    contextWindow: 16385,
    description: 'DeepSeek-Chat (GPT-4 level open-source model)',
  },
  'deepseek-v2': {
    model: 'deepseek-v2',
    provider: 'deepseek',
    contextWindow: 128000,
    description: 'DeepSeek V2 (advanced GPT-4+ class, open-weight)',
  },

  // --- Gemini ---
  'gemini-1.5-pro': {
    model: 'gemini-1.5-pro',
    provider: 'gemini',
    contextWindow: 1000000,
    description: 'Google Gemini 1.5 Pro (enormous context, beta access)',
  },

  // --- Groq ---
  'groq-llama3-70b-8192': {
    model: 'llama3-70b-8192',
    provider: 'groq',
    contextWindow: 8192,
    description: 'Meta LLaMA3 70B via Groq. Fast, strong general reasoning.',
  },
  'groq-llama3-8b-8192': {
    model: 'llama3-8b-8192',
    provider: 'groq',
    contextWindow: 8192,
    description:
      'Meta LLaMA3 8B via Groq. Very fast, lower cost, solid quality.',
  },
  'groq-mixtral-8x7b-32768': {
    model: 'mixtral-8x7b-32768',
    provider: 'groq',
    contextWindow: 32768,
    description:
      'Mixtral MoE 8x7B via Groq. Sparse activation, fast inference.',
  },
  'groq-gemma-7b-it': {
    model: 'gemma-7b-it',
    provider: 'groq',
    contextWindow: 8192,
    description:
      'Gemma 7B Instruct by Google, via Groq. Lightweight and efficient.',
  },

  // --- Mistral ---
  'mistral-7b-instruct': {
    model: 'mistral-7b-instruct',
    provider: 'mistral',
    contextWindow: 32768,
    description: 'Mistral 7B Instruct (open-weight assistant)',
  },
  'mixtral-8x7b': {
    model: 'mixtral-8x7b',
    provider: 'mistral',
    contextWindow: 65000,
    description: 'Mixtral-8x7B (MoE, high efficiency open-weight model)',
  },

  // --- OpenAI ---
  'chat-gpt3.5-turbo': {
    model: 'gpt-3.5-turbo',
    provider: 'openai',
    contextWindow: 16385,
    description: 'OpenAI GPT-3.5 Turbo (fast, low-cost)',
  },
  'gpt-4': {
    model: 'gpt-4',
    provider: 'openai',
    contextWindow: 8192,
    description: 'OpenAI GPT-4 (standard version)',
  },
  'gpt-4-turbo': {
    model: 'gpt-4-turbo',
    provider: 'openai',
    contextWindow: 128000,
    description: 'OpenAI GPT-4 Turbo (optimized for cost and speed)',
  },
  'gpt-4o': {
    model: 'gpt-4o',
    provider: 'openai',
    contextWindow: 128000,
    description: 'OpenAI GPT-4o (fastest, highest quality GPT-4 class)',
  },
};

export function getLLMConfig() {
  const llm = process.env.LLM_MODEL || 'chat-gpt3.5-turbo';
  const config = llmConfig[llm];
  if (!config) {
    throw new Error(`LLM model "${llm}" is not configured.`);
  }
  return { ...config };
}
