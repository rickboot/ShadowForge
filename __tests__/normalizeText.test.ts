import { normalizeText } from '@/lib/conversion/normalizeText';

describe('normalizeText', () => {
  it('removes extra spaces and normalizes line breaks', () => {
    const input = 'Hello    world!\n\n\nThis  is   ShadowForge.';
    const result = normalizeText(input);

    console.log(result);

    expect(result).toContain('Hello world!');
    expect(result).toContain('This is ShadowForge.');
    expect(result).not.toMatch(/ {2,}/); // No multiple spaces left
  });
});
