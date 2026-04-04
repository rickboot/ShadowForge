# ShadowForge Design Document

**AI-powered tool for converting D&D 5e content to Shadowdark RPG format**

---

## 1. Introduction & Overview

**Purpose:**
ShadowForge is an AI-powered web tool for Game Masters who want to convert D&D 5e content (monsters, treasure, encounters, rooms) into Shadowdark RPG format. It uses a multi-stage LLM pipeline to parse, classify, and convert adventure content, returning structured markdown ready for use at the table.

**Target Audience:**
GMs familiar with both 5e and Shadowdark who want to run published 5e adventures using Shadowdark rules without doing all the mechanical conversion by hand.

**Core Functionality:**

- Parse adventure text into semantic content blocks
- Classify blocks by type using a fast LLM
- Convert relevant blocks in parallel using a capable LLM with structured JSON output
- Render structured output to GM-ready Shadowdark markdown
- Accept text paste or PDF/txt file uploads
- No user data stored; all processing is ephemeral

---

## 2. Goals

- Fast, accurate Shadowdark conversion with minimal GM editing required
- Support multiple LLM providers with configurable model-per-task routing
- Reliable structured output via Zod schema validation
- Clean, maintainable codebase with full test coverage of core logic
- Prompt iteration without touching TypeScript source

---

## 3. Non-Goals

- Perfectly balanced, ready-to-play stat blocks (GM judgment always required)
- User accounts, session history, or persistent storage
- VTT integrations (future consideration)
- DOCX support (deferred; PDF partially supported via client-side extraction)
- Token tracking or client-side rate limiting (removed; server-side limits preferred)

---

## 4. Architecture

### Frontend

- Next.js 15 + React 19, TypeScript, Tailwind CSS 4
- Single-page UI: textarea input, file upload/drag-drop, markdown preview toggle, copy/download
- Three.js animated D20 wireframe background (React Three Fiber)
- Client calls `/api/convert` and renders the returned markdown

### Backend

- Next.js API Routes (Node.js, TypeScript)
- `POST /api/convert` — Zod-validated request, 20K character input limit, 60s LLM timeout
- Delegates to `runPipeline()`, returns `{ convertedText: string }`

### Pipeline (`lib/conversion/runPipeline.ts`)

```
Input text
  │
  ▼
sanitizeText()          — remove OCR artifacts, normalize whitespace
  │
  ▼
convertToBlocks()       — split into ContentBlock[] (header + paragraphs)
  │
  ▼
classifyWithLLM()       — single LLM call (classify role), returns {id, contentType}[]
  │
  ▼
filter()                — keep Room, Encounter, Dungeon, Site, PointOfInterest,
  │                        Monster, Treasure, Character, NPC
  ▼
Promise.allSettled()    — parallel LLM calls (convert role), each returns ConvertedBlock
  │
  ▼
renderToMarkdown()      — pure function, ConvertedBlock[] → markdown string
  │
  ▼
{ convertedText }
```

### LLM Layer (`lib/llm/`)

- `callLLMAPI()` — plain string response
- `callLLMStructured<T>()` — requests `json_object` format, JSON.parses, Zod-validates, returns typed `T`
- Both wrapped with `withTimeout()` (default 60s)
- `getLLMConfig(role?)` — reads `LLM_CLASSIFY_MODEL` / `LLM_CONVERT_MODEL` env vars with sensible defaults
- Providers: OpenAI, DeepSeek, Groq (all via OpenAI-compatible SDK); lazy singleton clients

### Schemas (`lib/schemas/index.ts`)

Key Zod schemas:

| Schema | Purpose |
|--------|---------|
| `ClassificationResponseSchema` | `{ blocks: [{ id, contentType }] }` — lightweight classify response |
| `ConvertedBlockSchema` | `{ header, boxedText?, enemies[]?, traps[]?, treasure[]?, gmNotes? }` |
| `ConversionResponseSchema` | Wraps array of `ConvertedBlock` |

### Prompts (`lib/prompts/system/`)

System prompts stored as `.md` files, loaded and cached at startup via `loadPrompt()`. Edit prompts without touching TypeScript.

- `classification.md` — instructs LLM to return `{ blocks: [{ id, contentType }] }`
- `conversion.md` — instructs LLM to return a `ConvertedBlock` JSON object with Shadowdark conversion rules

---

## 5. Conversion Rules

| Rule | Detail |
|------|--------|
| Coin scaling | Divide all 5e coin values by 10 |
| Currency | 1 gp = 10 sp = 100 cp; combine where possible |
| XP | 1 gp = 1 XP; shown inline next to treasure items |
| Magic items | +1/+2 included as-is; +3/legendary flagged in `gmNotes` |
| Enemies | Shadowdark format: HD, AC, attack+damage, morale |
| Traps | Mechanical traps + gameplay-affecting secrets only |
| Boxed text | Lightly edited from source; no invented mood or lighting |

---

## 6. API

### `POST /api/convert`

**Request:**
```json
{
  "text": "string (max 20,000 chars)",
  "adventureId": "string (optional)"
}
```

**Response:**
```json
{
  "convertedText": "string (markdown)"
}
```

**Errors:**

| Status | Cause |
|--------|-------|
| 400 | Missing/empty text, exceeds character limit, invalid JSON body |
| 500 | Pipeline or LLM failure |

---

## 7. Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `LLM_CLASSIFY_MODEL` | `openai-gpt-4o-mini` | Model key for block classification |
| `LLM_CONVERT_MODEL` | `openai-gpt-4o` | Model key for Shadowdark conversion |
| `LLM_MODEL` | `openai-gpt-4o-mini` | Legacy fallback if role vars not set |
| `OPENAI_API_KEY` | — | Required for OpenAI provider |
| `DEEPSEEK_API_KEY` | — | Required for DeepSeek provider |
| `GROQ_API_KEY` | — | Required for Groq provider |

Model keys are defined in `lib/llm/llmConfig.ts`.

---

## 8. Testing

42 tests, no live LLM calls required.

| Test file | Coverage |
|-----------|---------|
| `schemas.test.ts` | Zod schema validation — valid/invalid inputs |
| `renderToMarkdown.test.ts` | Pure renderer — all sections, formatting, edge cases |
| `classifyWithLLM.test.ts` | Classification — contentType merge, Unknown fallback, role |
| `runPipeline.test.ts` | Pipeline logic — filtering, parallel convert, failure handling |
| `api.convert.test.ts` | API route — validation, size limit, 400/500 responses |
| `convertToBlocks.test.ts` | Block parser — headers, paragraphs, edge cases |

---

## 9. Data Handling & Security

- No user input stored; all processing in-memory per request
- API keys in `.env.local`, never exposed to client
- Input size capped at 20,000 characters server-side
- LLM requests time out after 60 seconds
- Zod validation on all LLM outputs — malformed responses throw, not silently corrupt

---

## 10. Future Considerations

- Semantic memory via embeddings for cross-room context consistency
- User-editable conversion rule mappings (homebrew support)
- Adventure-level party scaling (monsters, traps, treasure adjusted by level/size)
- VTT integration (Foundry VTT, Fantasy Grounds)
- Server-side PDF extraction (current client-side extraction is fragile for complex layouts)
- Streaming API response for progressive output on large documents
- Automatic adventure generation
