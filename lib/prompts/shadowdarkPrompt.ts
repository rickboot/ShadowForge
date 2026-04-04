import { ContentType } from '@/lib/constants/conversion';
import { loadPrompt } from './loadPrompt';

export function getShadowdarkSystemPrompt(): string {
  return loadPrompt('conversion');
}

export function buildShadowdarkConversionPrompt(input: string, contentType?: ContentType): string {
  const hint = contentType ? ` [Content type: ${contentType}]` : '';
  return `Convert this D&D 5e content block to Shadowdark format.${hint}\n\n${input}`;
}
