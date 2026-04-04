export interface ModelProvider {
  name: string;
  call(params: {
    systemPrompt: string;
    userPrompt: string;
    model: string;
    temperature?: number;
    responseFormat?: 'json_object';
  }): Promise<string>;
}
