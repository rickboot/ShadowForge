# ShadowForge — Product Specification

**Version:** 0.1 (MVP)
**Date:** March 2026
**Status:** Active Development

---

## 1. Overview

ShadowForge is an AI-powered web application that converts Dungeons & Dragons 5th Edition (5e) content into the gritty, old-school format of the [Shadowdark RPG](https://www.thearcanelibrary.com/pages/shadowdark) ruleset. It helps Game Masters (GMs) adapt published 5e adventures, monster stat blocks, treasure parcels, and encounter text into Shadowdark-ready material — quickly, without losing creative control.

The project is currently in **MVP development**. A usage-limited beta is live on Vercel.

---

## 2. Problem Statement

GMs who want to run 5e published adventures using Shadowdark rules face a slow, tedious manual conversion process:

- Different math and economy (HP, AC, XP vs GP=XP)
- Different encounter design philosophy (lethality, light mechanics, tension)
- No tooling exists for this conversion workflow

ShadowForge eliminates the busywork while keeping the GM in the creative driver's seat. It provides **plausible conversion suggestions**, not finished output — the GM edits and owns the final product.

---

## 3. Target Users

- Game Masters familiar with both D&D 5e and Shadowdark RPG
- Indie TTRPG enthusiasts wanting to reuse purchased 5e content
- Shadowdark convention or one-shot runners working from existing modules

---

## 4. Goals

- Convert 5e content to Shadowdark format via AI-generated suggestions
- Accept content via text input or file upload (PDF/txt)
- Return clean, copyable, GM-ready Shadowdark output
- Handle large documents via chunking
- Operate ephemerally — no persistent user data or file storage
- Remain cost-efficient via smart model selection

---

## 5. Non-Goals (MVP)

- Perfectly balanced, play-tested stat blocks
- VTT (Virtual Tabletop) integration or structured export formats
- User accounts, content history, or cloud storage
- Image or audio processing
- Copyright-protected content reproduction

---

## 6. Core Features (Current MVP)

### 6.1 Input Handling

| Feature | Status |
|---|---|
| Direct text paste | Implemented |
| PDF file upload and text extraction | Implemented |
| Text normalization (OCR cleanup, whitespace) | Implemented |
| Input sanitization | Implemented |

### 6.2 Conversion Pipeline

ShadowForge uses a **multi-stage LLM pipeline** with two modes:

**Simple Pipeline**
- Single-pass conversion: input text → LLM → Shadowdark output
- Best for short, well-structured inputs

**Block-Based Pipeline**
- Input text → chunk → classify each block (Monster / Treasure / Encounter / Other) → convert each block with a type-specific prompt → assemble output
- Best for long-form adventure text
- Classification uses LLM or keyword heuristics as fallback

### 6.3 Content Types

| Conversion Type | Description |
|---|---|
| Monster Stat Block | Converts 5e monster stats to Shadowdark format (HP, AC, attacks, morale) |
| Treasure Parcel | Adjusts treasure for Shadowdark's GP=XP economy |
| Encounter / Room Text | Rewrites room descriptions with Shadowdark tone, light mechanics, simplified DCs |
| Generic Text Block | General text conversion with Shadowdark principles applied |

### 6.4 Prompt Strategy

Prompts are engineered around Shadowdark's core design principles:

- **GP=XP economy** — stingy treasure, meaningful rewards
- **Low HP, high lethality** — encounters should be dangerous
- **Light/dark tension** — light sources are a survival resource
- **Old-school tone** — sparse, punchy prose; no read-aloud text bloat

Prompt templates are stored in `lib/prompts/` and mapped by content type.

### 6.5 Multi-Provider LLM Support

The app supports configurable LLM backends via environment variable (`LLM_MODEL`). Provider adapters are implemented for:

- **OpenAI** — primary production provider
- **DeepSeek** — cost-efficient alternative
- **Groq** — high-speed inference

---

## 7. Architecture

### 7.1 Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, Tailwind CSS |
| 3D / Visual FX | Three.js, React Three Fiber, Postprocessing |
| Backend | Next.js API Routes (Node.js, TypeScript) |
| LLM Calls | Direct provider APIs (OpenAI SDK) |
| File Parsing | pdfjs-dist |
| Token Counting | js-tiktoken |
| Testing | Jest, Testing Library |
| Deployment | Vercel |

### 7.2 API Routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/convert` | POST | Accepts text or file + conversion options; returns converted content |

### 7.3 Data Flow

```
User Input (text / PDF)
  → Text Extraction & Normalization
    → Pipeline Selection (simple / block-based)
      → Block Classification (LLM or keyword)
        → Type-Specific Prompt Construction
          → LLM Call (configured provider)
            → Response Parsing & Formatting
              → GM-Ready Output
```

---

## 8. Current LLM Models & Providers

These models are currently configured in `lib/llm/llmConfig.ts`:

### Anthropic
| Key | Model | Context Window | Notes |
|---|---|---|---|
| `anthropic-claude-3-haiku` | claude-3-haiku-20240307 | 200K | Fastest, lowest cost |
| `anthropic-claude-3-sonnet` | claude-3-sonnet-20240229 | 200K | Balanced |
| `anthropic-claude-3-opus` | claude-3-opus-20240229 | 200K | Highest reasoning |

### OpenAI
| Key | Model | Context Window | Notes |
|---|---|---|---|
| `openai-gpt-3.5-turbo` | gpt-3.5-turbo | 4K | Fast, low cost |
| `openai-gpt-3.5-turbo-16k` | gpt-3.5-turbo-16k | 16K | Extended context |
| `openai-gpt-4` | gpt-4 | 8K | Standard GPT-4 |
| `openai-gpt-4-turbo` | gpt-4-turbo | 128K | Cost-optimized GPT-4 |
| `openai-gpt-4o` | gpt-4o | 128K | Fastest, highest quality |
| `openai-gpt-4o-mini` | gpt-4o-mini | 128K | Default; cost-efficient |

### DeepSeek
| Key | Model | Context Window | Notes |
|---|---|---|---|
| `deepseek-chat` | deepseek-chat | 16K | GPT-4 class, open-source |
| `deepseek-v2` | deepseek-v2 | 128K | GPT-4+ class, open-weight |

### Gemini
| Key | Model | Context Window | Notes |
|---|---|---|---|
| `gemini-1.5-pro` | gemini-1.5-pro | 1M | Enormous context (beta) |

### Groq
| Key | Model | Context Window | Notes |
|---|---|---|---|
| `groq-llama3-70b` | llama3-70b-8192 | 8K | Strong reasoning, fast |
| `groq-llama3-8b` | llama3-8b-8192 | 8K | Very fast, lower cost |
| `groq-mixtral-8x7b` | mixtral-8x7b-32768 | 32K | Sparse MoE, fast |
| `groq-gemma-7b` | gemma-7b-it | 8K | Lightweight, Google |

### Mistral
| Key | Model | Context Window | Notes |
|---|---|---|---|
| `mistral-mistral-7b-instruct` | mistral-7b-instruct | 32K | Open-weight assistant |
| `mistral-mixtral-8x7b` | mixtral-8x7b | 65K | High-efficiency MoE |

---

## 9. Future: APIs & Models to Explore

These are newer models and APIs that have launched since initial development and are strong candidates for improving quality, speed, or cost efficiency in the pipeline.

### 9.1 Anthropic — Claude 3.5 / 3.7 / 4 Family

The Claude 3 models currently configured are outdated. Anthropic has released significantly improved successors:

| Model | ID | Context | Notes |
|---|---|---|---|
| Claude 3.5 Haiku | `claude-haiku-4-5-20251001` | 200K | Fast, cheap; major quality leap over Claude 3 Haiku |
| Claude 3.5 Sonnet | `claude-3-5-sonnet-20241022` | 200K | Strong reasoning, best balance of speed/quality in Claude 3.5 |
| Claude 3.7 Sonnet | `claude-3-7-sonnet-20250219` | 200K | Hybrid extended thinking; best reasoning in the 3.x line |
| Claude Opus 4.6 | `claude-opus-4-6` | 200K | Most capable Claude overall |
| Claude Sonnet 4.6 | `claude-sonnet-4-6` | 200K | High capability at lower cost than Opus |
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` | 200K | Fastest Claude; ideal for classification blocks |

**Exploration priority:** High. Claude 3.7 Sonnet's extended thinking mode could significantly improve conversion quality for complex encounters. The multi-stage pipeline (classify → convert) maps well to a thinking-then-output pattern.

**Extended Thinking:** Claude 3.7+ supports a budget-token extended thinking mode where the model reasons internally before producing output. This could be valuable for the monster stat block and encounter conversion steps where accuracy matters more than speed.

### 9.2 OpenAI — o-Series Reasoning Models

OpenAI's reasoning models use chain-of-thought internally and excel at structured transformation tasks:

| Model | Notes |
|---|---|
| o1 | Strong multi-step reasoning; slower, higher cost |
| o3-mini | Faster reasoning model; good cost/quality tradeoff |
| o4-mini | Latest reasoning model; strong performance at lower cost |
| GPT-4.5 | Improved GPT-4 class, better instruction following |

**Exploration priority:** Medium. Reasoning models may improve conversion accuracy but at higher latency and cost — likely best for async or batch use cases rather than real-time UI.

### 9.3 Google Gemini 2.x

| Model | Context | Notes |
|---|---|---|
| Gemini 2.0 Flash | 1M | Fast, cost-efficient; strong at structured output |
| Gemini 2.5 Pro | 1M+ | Top-tier reasoning; multimodal (could support image-based content in future) |
| Gemini 2.0 Flash Thinking | 1M | Thinking variant for better accuracy |

**Exploration priority:** Medium-High. The 1M+ context window is particularly interesting for processing full adventure books in a single pass, avoiding the chunking overhead entirely.

### 9.4 DeepSeek R1 / V3

| Model | Notes |
|---|---|
| DeepSeek R1 | Open-weight reasoning model; strong at structured tasks, very cost-competitive |
| DeepSeek V3 | Latest general-purpose model; significantly improved over V2 |

**Exploration priority:** High. DeepSeek models are extremely cost-competitive. R1 in particular rivals frontier models on reasoning tasks and runs via the DeepSeek API (already integrated as a provider).

### 9.5 Meta LLaMA 3.1 / 3.2 / 3.3 (via Groq or direct)

| Model | Context | Notes |
|---|---|---|
| LLaMA 3.1 70B | 128K | Large context (big upgrade from 8K); strong quality |
| LLaMA 3.1 405B | 128K | Largest open-weight model; near-frontier quality |
| LLaMA 3.3 70B | 128K | Improved 70B, matches older 405B on many tasks |

**Exploration priority:** Medium. Available on Groq with fast inference. The 128K context window on LLaMA 3.1 would be a major upgrade over the current 8K Groq configurations.

### 9.6 Mistral — Large & Small 3

| Model | Notes |
|---|---|
| Mistral Large 2 | Frontier-class open-weight model; strong at instruction following |
| Mistral Small 3 | High efficiency at low cost; solid for classification tasks |
| Codestral | Code-focused, but strong at structured output tasks |

**Exploration priority:** Low-Medium. Mistral's API is already integrated. Updated model IDs would be a low-effort improvement.

### 9.7 Groq — Updated Model Lineup

Groq has expanded its hosted model library significantly. Updated options worth testing:

- `llama-3.3-70b-versatile` — LLaMA 3.3 70B, updated from current 3 70B
- `llama-3.1-70b-versatile` — 128K context version
- `deepseek-r1-distill-llama-70b` — DeepSeek R1 reasoning distilled into LLaMA, on Groq infrastructure
- `qwen-qwq-32b` — Alibaba reasoning model, fast inference via Groq

**Exploration priority:** Medium. Low-effort additions since the Groq provider is already implemented.

### 9.8 Structured Output APIs

Several providers now support native structured/JSON output modes that could improve the reliability of block parsing and classification:

- **OpenAI** — `response_format: { type: "json_schema" }` with strict mode
- **Anthropic** — Tool use for structured output extraction
- **Google Gemini** — `responseMimeType: "application/json"` with schema

**Exploration priority:** High. The classification step currently relies on LLM text output followed by regex parsing. Structured output would make the pipeline more robust and reduce parsing errors.

---

## 10. Planned Features (Roadmap)

### Near-Term (MVP+1)

- [ ] **Token tracking UI** — Show estimated and actual token usage per conversion; help GMs understand cost
- [ ] **Export as .txt / .md** — Download converted output as a file
- [ ] **Original text comparison** — Side-by-side view of 5e input and Shadowdark output
- [ ] **Dual output mode** — GM version (full details) and Player version (read-aloud text only)
- [ ] **Rate limiting** — Protect API endpoints from abuse
- [ ] **Model selector UI** — Let users pick between speed/cost/quality presets

### Medium-Term

- [ ] **Adventure-level chunking** — Auto-classify full adventure document into Room / Lore / GM Guidance / Appendix sections before conversion
- [ ] **Semantic memory / context** — Maintain consistency between connected rooms (e.g., a monster referenced in room 1 has the same stat block in room 3)
- [ ] **User-editable conversion rules** — Allow GMs to override specific mappings (homebrew rules, custom economy)
- [ ] **Batch mode** — Submit full document; receive chunked output with per-block review
- [ ] **Conversion history** — In-browser session history using localStorage

### Long-Term / Exploratory

- [ ] **VTT integration** — Export to Fantasy Grounds or Foundry VTT JSON format
- [ ] **PDF-native processing** — Use vision-capable models (Gemini 2.5, GPT-4o) to parse PDFs with layout context (tables, sidebars, formatted stat blocks)
- [ ] **Adventure generation** — Generate original Shadowdark adventures from a prompt or theme
- [ ] **User accounts** — Optional login for saved sessions and usage history
- [ ] **Feedback loop** — Per-block GM rating to improve prompt tuning over time
- [ ] **Homebrew rules engine** — Define and apply custom conversion rules beyond stock Shadowdark

---

## 11. Legal & Ethical Considerations

- Users must own or have rights to any content they upload
- Output is AI-generated and not guaranteed balanced or rules-legal
- No user content is stored persistently
- No reproduction of copyright-protected material by name
- Use of the tool constitutes agreement with terms of service (to be surfaced in UI)

---

## 12. Open Questions

- What is the right default model for production — cost vs. quality tradeoff?
- Should classification run on the same model as conversion, or a smaller/faster one?
- How do we handle content that spans multiple rooms (narrative continuity)?
- Is it worth building a streaming response UI for large documents?
- Should we pursue OpenAI's structured output mode to harden the block pipeline?
