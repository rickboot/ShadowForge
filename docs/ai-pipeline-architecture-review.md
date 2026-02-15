# AI Pipeline Architecture Review

## 1. Classification is solving the wrong problem

The current pipeline does: **split into blocks by headers → classify blocks**. This means the entire pipeline depends on `isHeader()` being right. With noisy OCR input, headers might be:
- Missing entirely
- Mangled (`"R00M 3. TH E CRYPT"`)
- Merged with body text
- Formatted in ways the heuristic doesn't expect

The deeper issue: **segmentation and classification are separated, but they're the same problem.** Knowing where a "Room" starts and knowing that it *is* a Room is the same cognitive act. The keyword classifier is trying to do classification without understanding — and the LLM fallback is a band-aid for when that fails.

**The architectural shift:** Let the LLM do both segmentation and classification in a single pass. Send it raw text and ask: "Identify the logical sections in this adventure text, and classify each one." The LLM is far better at handling noisy, malformed, inconsistent input than any regex. It can recognize that `"R00M 3. TH E CRYPT"` is a room header even with OCR errors.

The keyword classifier doesn't go away — it becomes a **post-validation layer**. After the LLM segments and classifies, cross-check with keywords: "The LLM says this is a Room, and the header contains 'crypt' — confirmed." That's a confidence booster, not the primary classifier.

---

## 2. Token tracking: use what the API gives you

Right now the pipeline imports `js-tiktoken` with `cl100k_base` — that's an OpenAI-specific tokenizer. If someone selects Groq or DeepSeek, the counts are wrong. And `estimateTokenCount` and `countTokens` are literally the same function duplicated.

But the real architectural issue: **the code estimates what the API already tells you.** Every LLM provider returns `usage.prompt_tokens` and `usage.completion_tokens` in the response. The pipeline does client-side guesswork instead of reading the actual answer.

**The shift:** The `ModelProvider.call()` interface should return more than just a string. It should return:

```ts
{ content: string, promptTokens: number, completionTokens: number }
```

Each provider reads these values from the actual API response and passes them up. No estimation needed for tracking. `tokenUtils.ts` shrinks to just the tracking/limiting logic.

Keep estimation for only one purpose: **pre-call chunking decisions** ("will this fit in the context window?"). And for that, a simple heuristic like `words × 1.3` is fine — no tokenizer library needed for a rough size check.

---

## 3. Chunking should follow from classification, not precede it

Right now `chunkText` splits on blank lines and word counts — pure syntactic boundaries. This means a chunk might split a room description in half, or merge the end of one encounter with the start of another.

The insight: **if #1 is solved correctly, chunking solves itself.** When the LLM segments the text into logical sections (rooms, encounters, monsters), each section IS the chunk. The section boundaries ARE the semantic boundaries.

So the pipeline becomes:

```
Raw text
  → sanitize
  → LLM segments + classifies (batched by context window)
  → each segment = one conversion unit
  → convert each segment to Shadowdark
```

No separate chunking step needed. The only "chunking" required is splitting the *input to the segmentation LLM* if it's too long for one call — and that's a simpler problem because it's just dividing raw text for analysis, not trying to preserve semantic boundaries.

---

## 4. Structured output — the biggest single improvement

Right now `convertToShadowdark` returns free-form markdown text. A long prompt asks the LLM to format things a certain way, but there's no guarantee. The LLM might:
- Omit monster AC
- Use `**HD 3**` one time and `HD: 3` the next
- Forget the XP calculation
- Invent sections that weren't asked for

**The shift:** Don't ask the LLM to produce formatted output. Ask it to produce **structured data**. Then render the markdown from that data deterministically.

Instead of "give me formatted Shadowdark markdown," the conversion prompt says "extract and convert this into the following JSON structure":

```json
{
  "header": "string",
  "boxedText": "string",
  "enemies": [{ "name": "", "hd": 0, "ac": 0, "attack": "", "damage": "", "morale": 0 }],
  "traps": [{ "description": "", "dc": 0, "trigger": "", "effect": "" }],
  "treasure": [{ "name": "", "valueSp": 0, "weight": "", "xp": 0, "isMagic": false, "gmNote": "" }]
}
```

Most providers support this — OpenAI calls it "Structured Outputs" (JSON Schema mode), Anthropic has tool use, etc. Validate with Zod after the call and **retry** if the shape is wrong.

Why this matters beyond consistency:
- **Control rendering** — change the markdown template without changing the prompt
- **Validate** — is AC a number between 5-20? Is HD positive? Retry or flag if not
- **Store the data** — save structured room data to a database, not just rendered text
- **Export to multiple formats** — same data renders to markdown, HTML, VTT, PDF
- **Test** — unit test the rendering logic separately from the LLM

---

## The revised pipeline

Putting it all together:

```
Raw text (PDF, OCR, paste)
  → sanitize (strip noise, normalize whitespace)
  → LLM: segment + classify (returns structured sections)
  → validate classifications (keyword cross-check, confidence scoring)
  → filter to convertible types
  → LLM: convert each section → structured JSON (with schema enforcement)
  → validate output (Zod schema, retry on failure)
  → render structured data → markdown (deterministic template)
```

Every LLM call returns structured data. Every return value gets validated. The rendering is deterministic code you control.

---

## Suggested implementation order

1. **#4 (structured output)** — highest leverage, improves output quality immediately, informs data structure design for #1 and #3
2. **#1 (LLM-first classification)** — eliminates the fragile header detection, handles noisy input
3. **#3 (semantic chunking)** — falls out naturally once #1 is solved
4. **#2 (token tracking from API responses)** — cleanest change, update provider interface and plumb usage data through
