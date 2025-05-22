import { CONTENT_TYPES } from "../conversion/classifyWithKeywords";

export const CLASSIFICATION_PROMPT = `
You are an expert TTRPG game master and software engineer.

You have been given a JSON array of object blocks.  
Each block describes a small section of text from a D&D 5e adventure.  
Each block contains a single \`header\` string and an array of \`paragraphs\` strings.  
Either the header or the paragraphs may be empty, but not both.

Your task is to classify each block into the most appropriate content type from the following list:
${CONTENT_TYPES.join(', ')}

---

### Block Input Format

Each block is an object with the following structure:

{
    id: string,
    sequence: number,
    adventureId: string,
    header: string,
    paragraphs: string[]
}

---

### Example Input

{
    id: "id-1",
    sequence: 1,
    adventureId: "adventure-1",
    header: "Cave of Doom",
    paragraphs: [
        "The cave is dark and foreboding.",
        "Dripping water creates a constant pinging sound somewhere out of sight."
    ]
}

---

### Your Instructions

For each block in the input array:

1. Read the \`header\` and \`paragraphs\`.
2. Choose the most appropriate \`contentType\` from the list above.
3. Return the following fields for each block:
    - \`id\`, \`sequence\`, \`adventureId\`, \`header\`, \`paragraphs\` (copied from the input)
    - \`contentType\`: one of the valid content types
    - \`explanation\`: why you chose this type (in 20 words or less)
    - \`confidence\`: 1 (low), 2 (medium), or 3 (high)
    - \`source\`: use 'LLM'
    - \`rulesMatched\`: use ['LLM']

Return an array of all classification results.

---

### Classification Output Format

Each result should follow this format:

{
    id: string,
    sequence: number,
    adventureId: string,
    header: string,
    paragraphs: string[],
    contentType: string,
    explanation: string,
    confidence: 1 | 2 | 3,
    source: "LLM",
    rulesMatched: ["LLM"]
}

---

### Example Output

[
    {
    id: "id-1",
    sequence: 1,
    adventureId: "adventure-1",
    header: "Playground of Terror",
    paragraphs: [
        "The playground is dark and foreboding.",
    "Dripping water creates a constant pinging sound somewhere out of sight."
    ],
    contentType: "Room",
    explanation: "Describes a discrete location with features and obstacles",
    confidence: 3,
    source: "LLM",
    rulesMatched: ["LLM"]
    },
    {
    id: "id-2",
    sequence: 2,
    adventureId: "adventure-1",
    header: "Shrubbery of Earthly Delights",
    paragraphs: [
        "The garden is a beautiful place with flowers and trees, but everything is overgrown and full of thorns."
    ],
    contentType: "PointOfInterest",
    explanation: "Overgrown garden fits point-of-interest classification",
    confidence: 3,
    source: "LLM",
    rulesMatched: ["LLM"]
    }
]

---

Return only the array of classification objects — no extra commentary.
`;