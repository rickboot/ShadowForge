export type ContentType =
  | 'Intro'
  | 'Lore'
  | 'Room'
  | 'Dungeon'
  | 'Encounter'
  | 'NPC'
  | 'Creature'
  | 'CharacterBio'
  | 'Treasure'
  | 'Unknown';

export type ClassifiedChunk = {
  id: string;
  text: string;
  contentType: ContentType;
  explanation: string;
  confidence: number;
};

export function classifyChunkHeuristically(
  id: string,
  text: string,
): ClassifiedChunk {
  const lower = text.toLowerCase();

  const checks: [ContentType, (s: string) => boolean][] = [
    ['Intro', (s) => s.includes('introduction')],
    [
      'Lore',
      (s) =>
        s.includes('lore') || s.includes('history') || s.includes('legend'),
    ],
    ['Room', (s) => s.includes('room') || s.includes('chamber')],
    ['Dungeon', (s) => s.includes('dungeon') || s.includes('cavern')],
    ['Encounter', (s) => s.includes('encounter') || s.includes('combat')],
    ['NPC', (s) => s.includes('npc')],
    ['Creature', (s) => s.includes('creature') || s.includes('monster')],
    ['CharacterBio', (s) => s.includes('character bio')],
    [
      'Treasure',
      (s) => s.includes('treasure') || s.includes('gold') || s.includes('gems'),
    ],
    ['Unknown', (s) => true],
  ];

  for (const [type, check] of checks) {
    if (check(lower)) {
      return {
        id,
        text,
        contentType: type,
        explanation: `Heuristically classified as ${type}`,
        confidence: 2,
      };
    }
  }

  return {
    id,
    text,
    contentType: 'Unknown',
    explanation: 'Heuristically classified as Unknown',
    confidence: 1,
  };
}

export function classifyChunks(
  chunks: { id: string; text: string }[],
): ClassifiedChunk[] {
  return chunks.map((chunk) =>
    classifyChunkHeuristically(chunk.id, chunk.text),
  );
}
