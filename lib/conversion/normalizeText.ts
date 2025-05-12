import { classifyText } from '../utils/prototypeChunkClassifier';
import { sanitizeText } from './sanitizeText';

export function normalizeText(text: string | null | undefined): string {
  if (!text || typeof text !== 'string') return '';

  text = sanitizeText(text);

  // Normalize line endings to '\n' and split into lines
  const lines = text.replace(/\r\n/g, '\n').trim().split('\n');

  const paragraphs: string[] = [];
  let currentParagraph = '';

  const endsWithPunctuation = (line: string): boolean =>
    /[.?!]["')\]]?\s*$/.test(line);

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

  for (let i = 0; i < numberOfLines; i++) {
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

  console.log(
    '==========================paragraphs==========================',
    paragraphs,
  );

  // ------------------
  const classifiedText = classifyText(text);
  console.log('============classifiedText===========', classifiedText);
  // ------------------

  return paragraphs
    .join('\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
