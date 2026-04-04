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
  const trimmed = blocks.map(b => ({
    id: b.id,
    header: b.header,
    firstParagraph: b.paragraphs[0] ?? '',
  }));
  return JSON.stringify(trimmed, null, 2);
}
