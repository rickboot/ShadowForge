export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
}

export interface LLMResult {
  text: string;
  model: string;
  usage: TokenUsage;
}

export interface Telemetry {
  models: string[];
  inputTokens: number;
  outputTokens: number;
}

export interface ModelProvider {
  name: string;
  call(params: {
    systemPrompt: string;
    userPrompt: string;
    model: string;
    temperature?: number;
    responseFormat?: 'json_object';
  }): Promise<LLMResult>;
}
