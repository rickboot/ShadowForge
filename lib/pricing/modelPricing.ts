// USD per 1M tokens
const PRICING: Record<string, { input: number; output: number }> = {
  // OpenAI
  'gpt-4o':            { input: 2.50,  output: 10.00 },
  'gpt-4o-mini':       { input: 0.15,  output: 0.60  },
  'gpt-4':             { input: 30.00, output: 60.00 },
  'gpt-4-turbo':       { input: 10.00, output: 30.00 },
  'gpt-3.5-turbo':     { input: 0.50,  output: 1.50  },
  // Anthropic
  'claude-3-7-sonnet-20250219':  { input: 3.00,  output: 15.00 },
  'claude-3-5-sonnet-20241022':  { input: 3.00,  output: 15.00 },
  'claude-3-5-haiku-20241022':   { input: 0.80,  output: 4.00  },
  'claude-3-haiku-20240307':     { input: 0.25,  output: 1.25  },
  'claude-3-opus-20240229':      { input: 15.00, output: 75.00 },
  // DeepSeek
  'deepseek-chat':     { input: 0.27,  output: 1.10  },
  // Groq (pay-as-you-go rates)
  'llama-3.3-70b-versatile': { input: 0.59, output: 0.79 },
  'llama-3.1-8b-instant':    { input: 0.05, output: 0.08 },
  'llama3-70b-8192':         { input: 0.59, output: 0.79 },
  'llama3-8b-8192':          { input: 0.05, output: 0.08 },
  'mixtral-8x7b-32768':      { input: 0.24, output: 0.24 },
  'mistral-7b-instruct':     { input: 0.06, output: 0.06 },
  // Gemini
  'gemini-1.5-pro':    { input: 1.25,  output: 5.00  },
};

export interface CallCost {
  model: string;
  inputTokens: number;
  outputTokens: number;
}

/** Returns total cost in USD, or null if any model has no pricing data. */
export function calculateCost(calls: CallCost[]): number | null {
  let total = 0;
  for (const call of calls) {
    const price = PRICING[call.model];
    if (!price) return null;
    total += (call.inputTokens / 1_000_000) * price.input
           + (call.outputTokens / 1_000_000) * price.output;
  }
  return total;
}
