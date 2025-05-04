import { sanitizeText } from './sanitizeText';

export function normalizeText(text: string | null | undefined): string {
  if (!text || typeof text !== 'string') return '';

  text = sanitizeText(text);
  // remove Unicode Replacement Character
  text = text.replace(/\uFFFD/g, '');

  // Normalize line endings to '\n' and split into lines
  const lines = text.replace(/\r\n/g, '\n').trim().split('\n');

  const paragraphs: string[] = [];
  let currentParagraph = '';

  // Detect if line ends with common ending punctuation to help identify paragraph breaks
  const endsWithPunctuation = (line: string): boolean =>
    /[.?!]["')\]]?\s*$/.test(line);

  // Detect numbered headings ("1. Room", "A) Area")
  // const isNumberedHeader = /^\s*\d+\s*[.)]\s+/;
  const isNumberedHeader = (line: string): boolean =>
    /^\s*[\dA-Za-z]+[.)]\s+/.test(line) &&
    line.length <= 40 &&
    !line.endsWith(',');

  // Detect simple subheadings ("Treasure", "Monster Stats", "MONSTER STATS")
  const isHeader = (line: string): boolean =>
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*|[A-Z]+(?:\s+[A-Z]+)*)$/.test(line) &&
    line.length <= 40 &&
    !line.endsWith('.');

  const isBlank = (line: string) => line.trim() === '';

  const numberOfLines = lines.length;

  // MAIN LOOP
  for (let i = 0; i < numberOfLines; i++) {
    // trim leading/trailing whitespace, normalize inner whitespace to ' '
    const line = lines[i].trim().replace(/\s+/g, ' ');

    if (isBlank(line)) {
      if (!currentParagraph) continue;
      // Look ahead to next non-blank line to help determine if blank is a true break
      let next = '';
      for (let j = i + 1; j < numberOfLines; j++) {
        if (!isBlank(lines[j])) {
          next = lines[j].trim();
          break;
        }
      }

      // Decide if this blank line signifies a true paragraph break
      const isBreak =
        !next ||
        isNumberedHeader(next) ||
        isHeader(next) ||
        endsWithPunctuation(currentParagraph);

      if (isBreak) {
        paragraphs.push(currentParagraph);
        currentParagraph = '';
      }
    } else if (isNumberedHeader(line) || isHeader(line)) {
      // Treat detected headers/subheaders as paragraph breaks and add them as separate paragraphs
      if (currentParagraph) paragraphs.push(currentParagraph);
      paragraphs.push(line);
      currentParagraph = '';
    } else {
      currentParagraph += currentParagraph ? ' ' + line : line;
    }
  }

  if (currentParagraph) {
    paragraphs.push(currentParagraph);
  }

  // Join paragraphs with double newlines and clean up excessive newlines/trim final result
  return paragraphs
    .join('\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
