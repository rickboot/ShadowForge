# ShadowForge

**Convert D&D 5e content to Shadowdark RPG using AI-powered tools.**

ShadowForge is a developer-friendly web app that helps Game Masters (GMs) convert Dungeons & Dragons 5th Edition (5e) materials into formats compatible with the Shadowdark RPG system. It supports PDF and DOCX file uploads or direct text input, and uses an AI-powered backend to provide plausible Shadowdark-style conversions for monsters, treasure, room text, and more.

## Features

- **AI-Powered Conversion:** Uses LLMs (via LangChain + OpenAI API) to generate Shadowdark equivalents of 5e content.
- **PDF/DOCX Uploads:** Extract content from 5e adventure files.
- **Text Input:** Paste or type 5e blocks directly.
- **Modular Backend:** Clean API routes and conversion service structure.
- **Prompt Engineering:** Custom prompt templates for monsters, treasure, and encounters.
- **Privacy First:** Uploaded content is processed ephemerally — never stored.

## Tech Stack

| Layer          | Stack                                   |
| -------------- | --------------------------------------- |
| Frontend       | Next.js, React, Tailwind CSS            |
| Backend        | Node.js, Next.js API Routes             |
| AI Integration | LangChain.js, OpenAI API                |
| File Handling  | Formidable (upload), pdf-parse, mammoth |
| Dev Tools      | TypeScript, ESLint, Prettier, Vercel    |

## 📂 File Structure

```bash
shadowforge/
├── pages/                 # Next.js routes
│   ├── api/convert/       # API endpoints (text, file)
│   └── index.tsx          # Main UI
├── lib/                   # Core logic (conversion modules, file utils)
├── prompts/               # PromptTemplates for each conversion type
├── styles/                # Tailwind setup
├── public/                # Static assets
├── .env.example           # Example env vars
└── README.md
```
