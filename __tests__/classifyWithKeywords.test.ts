import { classifyWithKeywords } from '../lib/conversion/classifyWithKeywords';
import { ContentBlock } from '../lib/constants/content';
import { ContentType } from '../lib/constants/conversion';

describe('classifyWithKeywords', () => {
    const baseBlock = (header: string, paragraphs: string[] = []): ContentBlock => ({
        id: `id-${header}`,
        sequence: 1,
        adventureId: 'test-adventure',
        header,
        paragraphs,
        lineStart: 1,
        lineEnd: 1,
    });

    const testCases: [string, ContentType][] = [
        ['Armory', 'Room'],
        ['Crypt', 'Room'],
        ['Halls of Madness', 'Room'],
        ['Caverns of Chaos', 'Region'],
        ['Village of Barovia', 'City'],
        ['Shrines of the Damned', 'Room'],
        ['Watchtowers', 'Site'],
        ['Caves of Hunger', 'Region'],
        ['Tomb of the Forgotten', 'Room'],
        ['Treasure Hoard', 'Treasure'],
        ['Beasts of the Wild', 'Monster'],
        ['Start', 'Intro'],
        ['The Forgotten Prophecy', 'Lore'],
        ['Skirmish at the Gate', 'Encounter'],
    ];

    test.each(testCases)('should classify header "%s" as %s', (header, expectedType) => {
        const blocks = [baseBlock(header)];
        const result = classifyWithKeywords(blocks);
        expect(result[0].contentType).toBe(expectedType);
        expect(result[0].confidence).toBeGreaterThanOrEqual(2);
        expect(result[0].source).toBe('Header');
    });

    test('should fallback to unknown when header and body don’t match', () => {
        const blocks = [baseBlock('Mysterious Blobular Entity', ['This text is nonsense.'])];
        const result = classifyWithKeywords(blocks);
        expect(result[0].contentType).toBe('Unknown');
        expect(result[0].confidence).toBe(1);
        expect(result[0].source).toBe('Unknown');
    });

    test('should handle plural forms like "Caves" or "Crypts"', () => {
        const blocks = [baseBlock('Crypts of Despair')];
        const result = classifyWithKeywords(blocks);
        expect(result[0].contentType).toBe('Room');
        expect(result[0].confidence).toBeGreaterThanOrEqual(2);
    });
});
