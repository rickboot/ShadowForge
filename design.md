# ShadowForge Design Document

**AI-powered tool for converting D&D 5e content to Shadowdark RPG format**

---

## 1. Introduction & Overview

**Purpose:**  
ShadowForge is an AI-powered web tool for Game Masters (GMs) who want to convert Dungeons & Dragons 5e content (monsters, treasure, encounters) into Shadowdark RPG style and mechanics. The app uses a file/text input interface and a LangChain-powered LLM backend to provide plausible conversion suggestions.

**Target Audience:**  
GMs familiar with both 5e and Shadowdark RPG who wish to adapt published adventures, stat blocks, or content for use in Shadowdark campaigns.

**Core Functionality:**

- Convert 5e content into Shadowdark-style output
- Accept file uploads (PDF, DOCX) and direct text input
- Use LangChain and LLM API (e.g., OpenAI) to generate output
- Display clean, copyable results for GM editing
- Handle input ephemerally and securely

---

## 2. Goals

- Provide GMs with useful Shadowdark conversion suggestions
- Accept content via file uploads or text input
- Return plausible, readable Shadowdark-style output
- Operate transparently with clear limits on automation and copyright
- Function as a helpful assistant, not a replacement for GM judgment

---

## 3. Non-Goals

- Storing user input or uploaded files
- Providing perfectly balanced, ready-to-play stat blocks
- Supporting non-text formats (images, ZIPs, etc.)
- Integrating with VTTs or supporting exports beyond plain text
- User accounts, content history, or database storage (for now)

---

## 4. Architecture Overview

**Frontend:**

- Next.js + React (SPA)
- Tailwind CSS
- File upload + textarea input UI
- Displays AI-generated conversion

**Backend:**

- Next.js API Routes (Node.js, TypeScript)
- Formidable for file uploads
- pdf-parse (PDF) and mammoth (DOCX) for text extraction
- LangChain.js for prompt management and LLM calls
- OpenAI GPT-4 or Claude 3 via API key

**Data Flow:**

1. User inputs content (upload or text)
2. Frontend sends it to backend API
3. Backend extracts/processes input
4. LangChain builds and sends prompt to LLM
5. LLM responds with Shadowdark output
6. Backend returns the result to frontend
7. Frontend displays output and deletes temp file (if any)

---

## 5. UI/UX Design

- **Clean single-page interface**
- Toggle between “Text Input” and “File Upload”
- Dropdown to select conversion type:
  - Monster Stat Block
  - Treasure Parcel
  - Encounter Text
  - Generic Text Block
- Submit button: “Convert”
- Output area: formatted result with “Copy” button
- Error display: file type errors, LLM API failure, etc.

---

## 6. Backend API Design

| Endpoint            | Method | Description                        |
| ------------------- | ------ | ---------------------------------- |
| `/api/convert/text` | POST   | Accepts raw text + conversion type |
| `/api/convert/file` | POST   | Accepts DOCX/PDF + conversion type |

**Security:**

- Sanitize inputs
- API key stored in `.env.local`
- No persistent file storage
- Rate limiting (future)

---

## 7. LangChain Conversion Service

**Responsibilities:**

- Prompt construction (with few-shot examples)
- Shadowdark principles (low HP, gritty, GP=XP, etc.)
- Conversion types handled:
  - Monster stat blocks
  - Treasure items
  - Room/encounter text
  - Generic text
- LLM interaction via LangChain’s `LLMChain` or equivalent
- Result parsing and formatting

**Few-shot example prompt formats** will be stored in a `prompts/` folder and mapped to conversion types.

---

## 8. Data Handling & Storage

- Files stored temporarily in memory or disk using `formidable`
- Files deleted immediately after response or error
- Logging excludes user input or content
- API key stored securely

---

## 9. Legal & Ethical Considerations

- Users must confirm they own the rights to input content
- Output is AI-generated and not guaranteed balanced
- No Wizards of the Coast content may be referenced by name without the text
- No persistent data retention
- Use of tool constitutes agreement with terms (to be shown in UI)

---

## 10. Load & Save (MVP+1)

**Future Feature:**

- Allow user to export converted result as `.txt` or `.md`
- Allow local save/load of conversion sessions (in-browser storage or manual download)

---

## 11. Tickets / MVP Milestones

The project is tracked via GitHub Issues and categorized into:

- `frontend`
- `backend`
- `api`
- `infra`
- `ai/prompt`

Initial ticket list includes:

- Project scaffolding
- Upload handling
- File parsing
- API routes
- LangChain conversion service
- Prompt modules
- Output rendering
- Environment variable setup
- File deletion post-processing

---

## 12. Future Considerations

- Add sliders for tone/difficulty
- Support `.txt` or `.md` input
- User feedback rating per conversion
- Optional login for persistent sessions
- Previews: monster card formatting, treasure tables
- "Shadowdarkify" common 5e module names and room descriptions
