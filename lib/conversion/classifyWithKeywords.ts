import { HEADER_KEYWORD_MAP } from "../constants/keywords";
import { ContentBlock } from '@/lib/constants/content'
import { ClassifiedContent } from '@/lib/constants/content'

function cleanHeader(raw: string): string {
  return raw
    .replace(/^\s*[\dA-Za-z]+[.)]\s+/, '') // Remove leading numbered/lettered labels like "1.", "B)", "III)"
    .replace(/[()[\]]/g, '') // Remove all parentheses and brackets
    .replace(/^["“”']+|["“”'!]+$/g, '') // Remove surrounding quotes and trailing punctuation
    .replace(/:$/, '') // Remove trailing colon
    .trim();
}

export function classifyBlock(block: ContentBlock): ClassifiedContent {
  const headerWords = cleanHeader(block.header).toLowerCase().split(/\s+/);

  for (const word of headerWords) {
    const contentType = HEADER_KEYWORD_MAP[word];
    if (contentType) {
      return {
        id: block.id,
        sequence: block.sequence,
        adventureId: block.adventureId,
        header: block.header,
        paragraphs: block.paragraphs,
        contentType,
        explanation: `Header contains keyword: ${word}`,
        confidence: 2,
        source: 'Header',
        rulesMatched: [`header-match: ${contentType}`],
      };
    }
  }

  // TODO: Re-enable when we have a better text cleaning strategy
  // Fallback: Search body text for any keyword match

  // const bodyText = block.paragraphs.join(' ').toLowerCase();
  // for (const [keyword, contentType] of Object.entries(headerKeywordMap)) {
  //   const keywordPattern = new RegExp(`\\b${keyword}\\b`, 'i'); // Match whole words only - 'crypt' not 'encrypted
  //   if (keywordPattern.test(bodyText)) {
  //     return {
  //       id: block.id,
  //       sequence: block.sequence,
  //       adventureId: block.adventureId,
  //       header: block.header,
  //       paragraphs: block.paragraphs,
  //       contentType,
  //       explanation: `Body contains keyword: ${keyword}`,
  //       confidence: 1,
  //       source: 'Body',
  //       rulesMatched: [`body-match: ${contentType}`],
  //     };
  //   }
  // }


  return {
    id: block.id,
    sequence: block.sequence,
    adventureId: block.adventureId,
    header: block.header,
    paragraphs: block.paragraphs,
    contentType: 'Unknown',
    explanation: 'No rule matched.',
    confidence: 1,
    source: 'Unknown',
    rulesMatched: [],
  };
}

export function classifyWithKeywords(blocks: ContentBlock[]): ClassifiedContent[] {
  return blocks.map(classifyBlock);
}
