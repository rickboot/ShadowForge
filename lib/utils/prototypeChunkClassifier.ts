import { runConversionPipeline } from '@/lib/conversion/runConversionPipeline';
type ContentType =
  | 'Adventure'
  | 'Region'
  | 'City'
  | 'Encounter'
  | 'Dungeon'
  | 'Room'
  | 'Monster'
  | 'Treasure'
  | 'Character'
  | 'NPC'
  | 'MagicItem'
  | 'Intro'
  | 'Lore'
  | 'Quest'
  | 'CharacterBio'
  | 'Unknown';

type ClassifiedContent = {
  id: string;
  sequence: number;
  adventureId: string;
  header?: string;
  contentType: ContentType;
  parentId?: string;
  originalText?: string;
  convertedText?: string;
  explanation: string;
  confidence: number;
  rulesMatched: string[];
};

type RuleType = 'LLM' | 'rules-engine-v1' | 'human-review';

const checks: [ContentType, (text: string) => boolean, string][] = [
  [
    'Adventure',
    (s) => s.includes('adventure') || s.includes('campaign'),
    'Mentions adventure or campaign.',
  ],
  [
    'Region',
    (s) => s.includes('region') || s.includes('area'),
    'Mentions region or area.',
  ],
  [
    'City',
    (s) => s.includes('city') || s.includes('town'),
    'Mentions city or town.',
  ],
  [
    'Encounter',
    (s) =>
      s.includes('combat') || s.includes('attack') || s.includes('initiative'),
    'Combat triggers or tactical action.',
  ],
  [
    'Dungeon',
    (s) => s.includes('keyed encounter') || s.includes('complex layout'),
    'Suggests dungeon layout or map notes.',
  ],
  [
    'Room',
    (s) => s.includes('room') || s.includes('walls') || s.includes('door'),
    'Environmental description: room, walls, or door.',
  ],
  [
    'Monster',
    (s) => s.includes('hp') && s.includes('ac'),
    'Stat blocks typically include HP and AC.',
  ],
  [
    'Treasure',
    (s) => s.includes('gp') || s.includes('treasure') || s.includes('potion'),
    'Mentions gold, treasure, or magic items.',
  ],
  [
    'MagicItem',
    (s) => s.includes('magic') || s.includes('spell'),
    'Mentions magic or spell.',
  ],
  [
    'NPC',
    (s) => s.includes('dialogue') || s.includes('personality'),
    'Describes how an NPC speaks or behaves.',
  ],
  [
    'Intro',
    (s) =>
      s.includes('this book') ||
      s.includes('how to use') ||
      s.includes('intended for the dungeon master'),
    'Module preface or setup guidance.',
  ],
  [
    'Lore',
    (s) =>
      s.includes('legend') || s.includes('long ago') || s.includes('history'),
    'Narrative exposition or past events.',
  ],
  [
    'Quest',
    (s) => s.includes('quest') || s.includes('objective'),
    'Mentions quest or objective.',
  ],
  [
    'CharacterBio',
    (s) => s.includes('ideal') || s.includes('bond') || s.includes('flaw'),
    'Player/NPC backstory with 5e trait terms.',
  ],
];

function classifyChunk(id: string, text: string): ClassifiedContent {
  const textLower = text.toLowerCase();

  for (const [type, match, explanation] of checks) {
    if (match(textLower)) {
      return {
        id,
        sequence: 1,
        adventureId: 'adventure-1',
        originalText: text,
        contentType: type,
        explanation,
        confidence: 2,
        rulesMatched: ['rules-engine-v1'],
      };
    }
  }

  return {
    id,
    sequence: 1,
    adventureId: 'adventure-1',
    originalText: text,
    contentType: 'Unknown',
    explanation: 'No rule matched.',
    confidence: 1,
    rulesMatched: [],
  };
}

type ContentSection = {
  id: string;
  adventureId: string;
  sequence: number;
  contentType: ContentType;
  confidence: number;
  rationale: string;
  header: string;
  headerId?: string;
  parentId?: string;
  originalText?: string;
  convertedText?: string;
  rulesMatched: RuleType[];
};

export function classifyChunks(
  chunks: { id: string; sequence: number; adventureId: string; text: string }[],
): ClassifiedContent[] {
  return chunks.map((chunk) => classifyChunk(chunk.id, chunk.text));
}

export function chunkContent(
  text: string,
): { id: string; sequence: number; adventureId: string; text: string }[] {
  const chunks: {
    id: string;
    sequence: number;
    adventureId: string;
    text: string;
  }[] = [];
  text.split('\n\n').map((chunk, index) => {
    chunks.push({
      id: `chunk-${index + 1}`,
      sequence: index + 1,
      adventureId: 'adventure-1',
      text: chunk,
    });
  });
  return chunks;
}

export function classifyText(text: string): ClassifiedContent[] {
  const chunks = chunkContent(text);
  return classifyChunks(chunks);
}

const temp = {
  heading: 'The Shadow of the Tomb Raider',
  text: 'Paragraph 1',
};

type RawBlock = {
  id: string; // UUID or slug
  heading: string;
  body: string;
  lineStart: number;
  lineEnd: number;
};
