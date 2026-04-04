import { CONTENT_TYPES } from '@/lib/constants/conversion';

interface BlockInput {
  id: string;
  header: string;
  paragraphs: string[];
}

export function buildClassificationUserPrompt(blocks: BlockInput[]): string {
  return JSON.stringify(blocks, null, 2);
}

export const CLASSIFICATION_SYSTEM_PROMPT = `
You are an expert TTRPG game master classifying sections of a D&D 5e adventure module.

You will receive a JSON array of blocks. Each block has an "id", a "header", and "paragraphs".

Classify each block into one of these content types:
${CONTENT_TYPES.join(', ')}

Return a JSON object with this exact structure:
{
  "blocks": [
    { "id": "<id from input>", "contentType": "<ContentType>" }
  ]
}

Rules:
- Return one entry per input block, in any order
- Use the exact id from the input
- Choose the single most appropriate contentType
- Use "Unknown" only if no other type fits

Return only the JSON object — no explanation or commentary.
`.trim();
