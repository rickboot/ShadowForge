/**
 * @jest-environment node
 */
import {
  ClassificationResponseSchema,
  ConvertedBlockSchema,
  ConversionResponseSchema,
} from '@/lib/schemas';

describe('ClassificationResponseSchema', () => {
  it('accepts valid classification response', () => {
    const input = {
      blocks: [
        { id: 'abc', contentType: 'Room' },
        { id: 'def', contentType: 'Monster' },
      ],
    };
    expect(() => ClassificationResponseSchema.parse(input)).not.toThrow();
  });

  it('rejects unknown contentType', () => {
    const input = { blocks: [{ id: 'abc', contentType: 'FakeType' }] };
    expect(() => ClassificationResponseSchema.parse(input)).toThrow();
  });

  it('rejects missing id', () => {
    const input = { blocks: [{ contentType: 'Room' }] };
    expect(() => ClassificationResponseSchema.parse(input)).toThrow();
  });

  it('accepts all valid content types', () => {
    const types = ['Adventure', 'Region', 'City', 'Site', 'Encounter', 'Dungeon', 'Room',
      'PointOfInterest', 'Monster', 'Treasure', 'Character', 'NPC', 'MagicItem',
      'Intro', 'Lore', 'Quest', 'CharacterBio', 'GMGuidance', 'TOC', 'Credits',
      'Appendix', 'Glossary', 'Index', 'Unknown'];
    for (const contentType of types) {
      expect(() => ClassificationResponseSchema.parse({
        blocks: [{ id: 'x', contentType }],
      })).not.toThrow();
    }
  });
});

describe('ConvertedBlockSchema', () => {
  it('accepts minimal block (header only)', () => {
    expect(() => ConvertedBlockSchema.parse({ header: 'Room 1' })).not.toThrow();
  });

  it('accepts full block with all sections', () => {
    const block = {
      header: '1. Crypt Entrance',
      boxedText: 'The door creaks open.',
      enemies: [{ name: 'Skeleton', hd: '1', ac: 13, attack: '+2 (1d6)', morale: 12 }],
      traps: [{ description: 'Tripwire', dc: 13 }],
      treasure: [{ name: 'Gold', value: '5 gp', xp: 5 }],
      gmNotes: 'Watch for skeleton reinforcements.',
    };
    expect(() => ConvertedBlockSchema.parse(block)).not.toThrow();
  });

  it('rejects missing header', () => {
    expect(() => ConvertedBlockSchema.parse({ boxedText: 'Some text' })).toThrow();
  });

  it('rejects enemy with non-integer ac', () => {
    const block = {
      header: 'Room 1',
      enemies: [{ name: 'Goblin', hd: '1', ac: 12.5, attack: '+1 (1d4)' }],
    };
    expect(() => ConvertedBlockSchema.parse(block)).toThrow();
  });
});

describe('ConversionResponseSchema', () => {
  it('accepts array of converted blocks', () => {
    const input = {
      blocks: [
        { header: 'Room 1' },
        { header: 'Room 2', boxedText: 'Dark and damp.' },
      ],
    };
    expect(() => ConversionResponseSchema.parse(input)).not.toThrow();
  });
});
