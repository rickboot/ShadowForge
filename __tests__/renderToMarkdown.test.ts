/**
 * @jest-environment node
 */
import { renderBlockToMarkdown, renderToMarkdown } from '@/lib/conversion/renderToMarkdown';
import { ConvertedBlock } from '@/lib/schemas';

const minimalBlock: ConvertedBlock = { header: '1. Empty Room' };

const fullBlock: ConvertedBlock = {
  header: '2. Guard Post',
  boxedText: 'Two guards slouch over a table covered in empty flagons.',
  enemies: [
    { name: 'Guard', hd: '1', ac: 13, attack: '+2 (1d6 spear)', morale: 8 },
    { name: 'Guard Captain', hd: '2', ac: 15, attack: '+3 (1d8 sword)', morale: 10, notes: 'Has a key.' },
  ],
  traps: [
    { description: 'Tripwire across doorway', dc: 12 },
  ],
  treasure: [
    { name: 'Silver coins', value: '3 sp', xp: 0 },
    { name: 'Potion of healing', xp: 50, notes: 'Hidden under table' },
  ],
  gmNotes: 'The captain will surrender if reduced below half HP.',
};

describe('renderBlockToMarkdown', () => {
  it('renders minimal block with just a header', () => {
    const md = renderBlockToMarkdown(minimalBlock);
    expect(md).toContain('### 1. Empty Room');
    expect(md).not.toContain('**Enemies**');
    expect(md).not.toContain('**Treasure**');
  });

  it('renders boxed text', () => {
    const md = renderBlockToMarkdown(fullBlock);
    expect(md).toContain('**Boxed Text**');
    expect(md).toContain('Two guards slouch');
  });

  it('renders enemies with stat line format', () => {
    const md = renderBlockToMarkdown(fullBlock);
    expect(md).toContain('**Enemies**');
    expect(md).toContain('**Guard**');
    expect(md).toContain('HD 1, AC 13');
    expect(md).toContain('morale 8');
  });

  it('renders enemy notes', () => {
    const md = renderBlockToMarkdown(fullBlock);
    expect(md).toContain('Has a key.');
  });

  it('renders traps with DC', () => {
    const md = renderBlockToMarkdown(fullBlock);
    expect(md).toContain('**Traps and Secrets**');
    expect(md).toContain('Tripwire across doorway');
    expect(md).toContain('DC 12');
  });

  it('renders treasure with XP', () => {
    const md = renderBlockToMarkdown(fullBlock);
    expect(md).toContain('**Treasure**');
    expect(md).toContain('**Silver coins**');
    expect(md).toContain('**Potion of healing**');
    expect(md).toContain('≈50 XP');
  });

  it('renders treasure notes', () => {
    const md = renderBlockToMarkdown(fullBlock);
    expect(md).toContain('Hidden under table');
  });

  it('renders GM notes', () => {
    const md = renderBlockToMarkdown(fullBlock);
    expect(md).toContain('GM Note:');
    expect(md).toContain('surrender');
  });
});

describe('renderToMarkdown', () => {
  it('separates multiple blocks with double newline', () => {
    const md = renderToMarkdown([minimalBlock, fullBlock]);
    const parts = md.split('\n\n');
    expect(parts.length).toBeGreaterThanOrEqual(2);
    expect(md).toContain('### 1. Empty Room');
    expect(md).toContain('### 2. Guard Post');
  });

  it('returns empty string for empty array', () => {
    expect(renderToMarkdown([])).toBe('');
  });
});
