import { loadPrompt } from './loadPrompt';

interface BlockInput {
  id: string;
  header: string;
  paragraphs: string[];
}

export function getClassificationSystemPrompt(): string {
  return loadPrompt('classification');
}

export function buildClassificationUserPrompt(blocks: BlockInput[]): string {
  return JSON.stringify(blocks, null, 2);
}
