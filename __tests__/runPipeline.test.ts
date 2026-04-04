/**
 * @jest-environment node
 */
import { runPipeline } from '@/lib/conversion/runPipeline';

jest.mock('@/lib/conversion/classifyWithLLM');
jest.mock('@/lib/conversion/convertToShadowdark');

import { classifyWithLLM } from '@/lib/conversion/classifyWithLLM';
import { convertToShadowdark } from '@/lib/conversion/convertToShadowdark';

const mockClassify = classifyWithLLM as jest.MockedFunction<typeof classifyWithLLM>;
const mockConvert = convertToShadowdark as jest.MockedFunction<typeof convertToShadowdark>;

const makeClassified = (overrides = {}) => ({
  id: 'id-1',
  adventureId: 'adv-1',
  sequence: 1,
  header: '1. Cave Entrance',
  paragraphs: ['Dark and foreboding.'],
  contentType: 'Room' as const,
  ...overrides,
});

const convertedBlock = {
  header: '1. Cave Entrance',
  boxedText: 'Dark and foreboding.',
};

describe('runPipeline', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns no-content message for empty text', async () => {
    const result = await runPipeline('');
    expect(result.convertedText).toContain('No content blocks found');
    expect(mockClassify).not.toHaveBeenCalled();
  });

  it('filters out non-convertible block types', async () => {
    mockClassify.mockResolvedValue([
      makeClassified({ contentType: 'Lore' }),
      makeClassified({ id: 'id-2', sequence: 2, contentType: 'TOC' }),
    ]);

    const result = await runPipeline('1. Introduction\nSome lore text.');
    expect(result.convertedText).toContain('No convertible content found');
    expect(mockConvert).not.toHaveBeenCalled();
  });

  it('converts Room, Monster, Encounter, and NPC blocks', async () => {
    const convertibleTypes = ['Room', 'Monster', 'Encounter', 'NPC'] as const;
    for (const contentType of convertibleTypes) {
      jest.clearAllMocks();
      mockClassify.mockResolvedValue([makeClassified({ contentType })]);
      mockConvert.mockResolvedValue(convertedBlock);

      const result = await runPipeline('1. Cave Entrance\nSome text.');
      expect(mockConvert).toHaveBeenCalledTimes(1);
      expect(result.convertedText).toContain('### 1. Cave Entrance');
    }
  });

  it('calls convertToShadowdark with contentType hint', async () => {
    mockClassify.mockResolvedValue([makeClassified({ contentType: 'Room' })]);
    mockConvert.mockResolvedValue(convertedBlock);

    await runPipeline('1. Cave Entrance\nSome text.');
    expect(mockConvert).toHaveBeenCalledWith(expect.any(String), 'Room');
  });

  it('handles partial conversion failures gracefully', async () => {
    mockClassify.mockResolvedValue([
      makeClassified({ id: 'id-1', header: '1. Good Room' }),
      makeClassified({ id: 'id-2', header: '2. Bad Room', sequence: 2 }),
    ]);
    mockConvert
      .mockResolvedValueOnce({ header: '1. Good Room', boxedText: 'Converted.' })
      .mockRejectedValueOnce(new Error('LLM timeout'));

    const result = await runPipeline('1. Good Room\nText.\n\n2. Bad Room\nText.');
    expect(result.convertedText).toContain('### 1. Good Room');
    expect(result.convertedText).not.toContain('### 2. Bad Room');
  });

  it('returns failure message when all conversions fail', async () => {
    mockClassify.mockResolvedValue([makeClassified()]);
    mockConvert.mockRejectedValue(new Error('LLM error'));

    const result = await runPipeline('1. Cave Entrance\nSome text.');
    expect(result.convertedText).toContain('Conversion failed for all blocks');
  });
});
