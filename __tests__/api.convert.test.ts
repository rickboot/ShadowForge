/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/convert/route';
import { MAX_INPUT_CHARS } from '@/lib/constants/limits';

jest.mock('@/lib/conversion/runPipeline', () => ({
  runPipeline: jest.fn().mockResolvedValue({ convertedText: '### Converted Room\nSome content.' }),
}));

import { runPipeline } from '@/lib/conversion/runPipeline';
const mockRunPipeline = runPipeline as jest.MockedFunction<typeof runPipeline>;

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/convert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('POST /api/convert', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 400 for missing text', async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeTruthy();
  });

  it('returns 400 for empty text', async () => {
    const res = await POST(makeRequest({ text: '' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 for non-string text', async () => {
    const res = await POST(makeRequest({ text: 42 }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when input exceeds MAX_INPUT_CHARS', async () => {
    const res = await POST(makeRequest({ text: 'a'.repeat(MAX_INPUT_CHARS + 1) }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain('character limit');
  });

  it('returns 400 for invalid JSON body', async () => {
    const req = new NextRequest('http://localhost/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ invalid json',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 200 with convertedText on success', async () => {
    const res = await POST(makeRequest({ text: 'Some valid D&D content here.' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.convertedText).toBe('### Converted Room\nSome content.');
  });

  it('calls runPipeline with text and optional adventureId', async () => {
    await POST(makeRequest({ text: 'Content.', adventureId: 'my-adventure' }));
    expect(mockRunPipeline).toHaveBeenCalledWith('Content.', 'my-adventure');
  });

  it('returns 500 when pipeline throws', async () => {
    mockRunPipeline.mockRejectedValueOnce(new Error('LLM failure'));
    const res = await POST(makeRequest({ text: 'Valid content.' }));
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBeTruthy();
  });
});
