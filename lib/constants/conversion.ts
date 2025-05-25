export const MAX_HEADER_CHARS = 60;
export const MAX_LONG_HEADER_WORDS = 12;
export const MAX_SHORT_HEADER_WORDS = 5;

export const MINOR_TITLE_WORDS = new Set([
    'a', 'an', 'and', 'as', 'at', 'but', 'by', 'down', 'for', 'from', 'if', 'in', 'into', 'like', 'near', 'nor', 'of', 'off', 'on', 'once', 'onto', 'or', 'over', 'past', 'so', 'than', 'that', 'to', 'upon', 'when', 'with', 'yet'
]);

// note: classification is done in order so higher hierarchy types come first
export const CONTENT_TYPES = [
    'Adventure',
    'Region',
    'City',
    'Site',
    'Encounter',
    'Dungeon',
    'Room',
    'PointOfInterest',
    'Monster',
    'Treasure',
    'Character',
    'NPC',
    'MagicItem',
    'Intro',
    'Lore',
    'Quest',
    'CharacterBio',
    'GMGuidance',
    'TOC',
    'Credits',
    'Appendix',
    'Glossary',
    'Index',
    'Unknown',
] as const;

export const ContentTypeValues = CONTENT_TYPES;
export type ContentType = typeof ContentTypeValues[number];

export type ClassificationSource = 'Header' | 'Body' | 'Human' | 'LLM' | 'Unknown';
export type ClassificationConfidence = 1 | 2 | 3;
