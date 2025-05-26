export const DEFAULT_INPUT_TEXT = `1. Maze of Twisty Little Passages (All Alike)
The narrow tunnels twist and turn in an impossible pattern.
Walls of rough-hewn stone close in from all sides. Every direction looks exactly the same, and the air carries a faint scent of mildew, wax, and despair.
Any attempt to map this area without magical aid results in confusion. A creature must succeed on a DC 13 Wisdom (Survival) check to track its progress; failure results in becoming lost for 1d4 hours.
Light sources here sputter unpredictably. Nonmagical light is dimmed to 10 feet. Magical light flickers and must succeed on a DC 15 spellcasting ability check to function for longer than 10 minutes.
Creatures
A Grue stalks these tunnels, feeding on lost adventurers.
It lurks just beyond the edge of the party's light, moving silently through the maze. It prefers to strike when only one character is isolated.
Treasure
The following items are scattered throughout the maze in dusty nooks, discarded packs, and forgotten corpses:
- A jewel-encrusted egg, filled with stale wax and smelling faintly of cinnamon. Worth 50 gp to the right kind of collector (i.e., a`;

export const ABOUT_TEXT = `
## About ShadowForge

ShadowForge is an AI-powered, web app designed to help tabletop RPG game masters (GMs) convert Dungeons & Dragons (D&D) content into the gritty, old-school format of the [Shadowdark](https://www.thearcanelibrary.com/pages/shadowdark) RPG (role-playing game) rules. It assists with transforming monster stats, treasure parcels, room descriptions, and rule mechanics (like skill checks) into formats suitable for direct use in Shadowdark games.

This tool addresses a common challenge faced by GMs wanting to use 5e adventures in Shadowdark: the conversion process is often slow, manual, and tedious, requiring constant referencing of multiple rulebooks. ShadowForge aims to make this process faster and easier, while ensuring the final creative decisions remain firmly in the hands of the GM.

_NOTE: The project is currently in the Minimum Viable Product (MVP) development stage; some features described below are planned or in progress._

Usage-limited [Shadowforge beta](https://shadow-forge-git-main-rickboots-projects.vercel.app/) is live. Don't tell your friends yet!
Nerdy types can view the code on the [Shadowforge Github repo](https://github.com/rickboot/ShadowForge).

**Features**

- **AI-Powered Conversion:** Uses multistage LLMs (via LangChain + OpenAI API) to generate Shadowdark equivalents of D&D adventure content.
- **Flexible Input:** Accepts direct text pasting or file uploads (PDF/txt).
- **Targeted Conversion:** Options to convert specific elements like **Monster Stats**, **Treasure Blocks** (adjusting for **Shadowdark economy/GP=XP**), **Encounters/Rooms** (including rule mechanics like **skill check DCs**), or generic text blocks.
- **Structured Prompts:** Leverages LangChain to route input to task-specific prompt templates that inject core Shadowdark design principles and rules for more accurate conversion.
- **GM-Friendly Output:** Results are formatted in text and markdown (e.g., using boxed text, clear headings, concise notes) designed for **easy readability and use by the GM at the table**.
- **Dual Output Modes:** (Planned) Option to generate both a GM version (with full details) and a player-facing version (e.g., read-aloud text only).
- **Original Text Preservation:** (Planned) Option to include the original 5e text alongside the conversion for easy comparison and reference.
- **LLM Token Estimation and Counting:** (Planned) Track, optimize, and limit LLM API spend.

**Example Use Case**

A GM uploads a text file of a D&D 5e adventure module. ShadowForge extracts the text, normalizes it, and breaks it into manageable chunks based on room descriptions. The GM selects the "Encounter/Room Text" conversion option. ShadowForge processes each chunk, returning Shadowdark-ready room versions—complete with appropriate read-aloud text, simplified monster stats reflecting Shadowdark lethality, potential light-based traps or environmental effects, and relevant treasure parcels adjusted for a GP=XP system.

**Tech Stack & Pipeline**

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Node.js, Next.js API Routes
- **LLM Pipeline:** LangChain.js utilizing GPT-3.5 Turbo (chosen for favorable token limits and cost-efficiency).
- **File Handling:** Text extraction from PDF/text uploads (using pdf-parse).
- **Preprocessing:** Includes text normalization routines to improve content quality from potential OCR errors and ensure input consistency for the LLM.
- **Processing Strategy:** Implements input chunking to manage LLM context window limitations, allowing for the processing of large documents.
- **Development:** TypeScript, ESLint, Prettier, and maybe a little Python
- **Deployment:** Vercel

**Prompt Strategy**

ShadowForge employs carefully engineered prompts designed to capture Shadowdark’s core gameplay principles:

- Stingy, loot-based economy (GP=XP focus)
- Low HP, high-tension encounters
- Emphasis on light/dark mechanics (integrated where appropriate)
- Classic fantasy tone

Each content type (monster, treasure, room) utilizes distinct PromptTemplate's within LangChain. These prompts were iteratively tested using content from official 5e modules (e.g., _Curse of Strahd_, _The Sunless Citadel_) to refine the output style, rules adherence, and overall pacing to feel appropriate for Shadowdark gameplay.

**Future Plans**

- Implement semantic memory for better context consistency between connected rooms or encounters.
- Develop full adventure chunking with automatic classification (Room vs. Lore vs. GM Guidance).
- Introduce user-editable conversion mappings for handling homebrew rules or custom preferences.
- Explore potential VTT integration (e.g., Fantasy Grounds, Foundry VTT).
- Automatic adventure generation.

`;
