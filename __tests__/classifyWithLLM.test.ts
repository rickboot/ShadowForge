/**
 * @jest-environment node
 */
import { classifyWithLLM } from '@/lib/conversion/classifyWithLLM';
import { ContentBlock } from '@/lib/constants/content';

jest.mock('@/lib/llm/callLLMAPI', () => ({
  callLLMStructured: jest.fn(),
}));

jest.mock('@/lib/prompts/classificationPrompt', () => ({
  getClassificationSystemPrompt: () => 'mock system prompt',
  buildClassificationUserPrompt: (blocks: unknown) => JSON.stringify(blocks),
}));

import { callLLMStructured } from '@/lib/llm/callLLMAPI';
const mockCallLLMStructured = callLLMStructured as jest.MockedFunction<typeof callLLMStructured>;

const makeBlock = (overrides: Partial<ContentBlock> = {}): ContentBlock => ({
  id: 'test-id',
  adventureId: 'adv-1',
  sequence: 1,
  header: 'Goblin Den',
  paragraphs: ['Goblins lurk here.'],
  ...overrides,
});

describe('classifyWithLLM', () => {
  beforeEach(() => jest.clearAllMocks());

  it('merges LLM contentType into ContentBlocks', async () => {
    const blocks = [
      makeBlock({ id: 'id-1', header: 'Cave Entrance' }),
      makeBlock({ id: 'id-2', header: 'Introduction', sequence: 2 }),
    ];
    mockCallLLMStructured.mockResolvedValue({
      blocks: [
        { id: 'id-1', contentType: 'Room' },
        { id: 'id-2', contentType: 'Intro' },
      ],
    });

    const result = await classifyWithLLM(blocks);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ id: 'id-1', contentType: 'Room', header: 'Cave Entrance' });
    expect(result[1]).toMatchObject({ id: 'id-2', contentType: 'Intro', header: 'Introduction' });
  });

  it('defaults to Unknown when LLM omits a block', async () => {
    const blocks = [
      makeBlock({ id: 'id-1' }),
      makeBlock({ id: 'id-2', sequence: 2 }),
    ];
    mockCallLLMStructured.mockResolvedValue({
      blocks: [{ id: 'id-1', contentType: 'Room' }],
    });

    const result = await classifyWithLLM(blocks);

    expect(result[0].contentType).toBe('Room');
    expect(result[1].contentType).toBe('Unknown');
  });

  it('calls LLM with classify role', async () => {
    mockCallLLMStructured.mockResolvedValue({ blocks: [] });
    await classifyWithLLM([makeBlock()]);
    expect(mockCallLLMStructured).toHaveBeenCalledWith(
      expect.objectContaining({ role: 'classify' }),
    );
  });

  it('returns empty array for empty input', async () => {
    mockCallLLMStructured.mockResolvedValue({ blocks: [] });
    const result = await classifyWithLLM([]);
    expect(result).toEqual([]);
  });
});
