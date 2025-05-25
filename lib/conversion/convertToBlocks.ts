import { sanitizeText } from './sanitizeText';
import { v4 as uuidv4 } from 'uuid';
import { MINOR_TITLE_WORDS, MAX_LONG_HEADER_WORDS, MAX_SHORT_HEADER_WORDS, MAX_HEADER_CHARS } from '@/lib/constants/conversion';
import { ContentBlock } from '@/lib/constants/content';

function isHeader(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.length === 0) return false;
  if (trimmed.length > MAX_HEADER_CHARS) return false;

  const hasHeaderAllowedCharacters = /^[A-Za-z0-9'"’“”\-–—:(),! ]+$/.test(trimmed);
  const isNumbered = /^[A-Z\d]+[.)]\s+/.test(trimmed);
  const wordCount = trimmed.split(/\s+/).length;



  const words = trimmed.split(/\s+/);
  const isFirstWordCapitalized = words.length > 0 && /^[A-Z]/.test(words[0]);
  const areOtherWordsTitleCase = words.slice(1).every(word =>
    MINOR_TITLE_WORDS.has(word.toLowerCase()) || /^[A-Z]/.test(word)
  );
  const isTitleCase = isFirstWordCapitalized && areOtherWordsTitleCase && wordCount > 2;

  const hasNoEndingPunctuation = !/[.!?](['”’"])?$/.test(trimmed);

  const isDramaticHeader = /^(["“”'])?.+[!?](["”’'])?$/.test(trimmed) && wordCount <= 8;

  if (isNumbered && wordCount <= MAX_LONG_HEADER_WORDS) return true;
  if (hasHeaderAllowedCharacters && wordCount <= MAX_SHORT_HEADER_WORDS && hasNoEndingPunctuation) return true;
  if (hasHeaderAllowedCharacters && isTitleCase && wordCount <= MAX_LONG_HEADER_WORDS && hasNoEndingPunctuation) return true;
  if (isDramaticHeader) return true;
  return false;
}

export function convertToBlocks(
  adventureId: string,
  text: string | null | undefined,
): ContentBlock[] {
  if (!text || typeof text !== 'string') return [];

  // sanitize and normalize text
  // TODO: Re-enable when we have a better text cleaning strategy
  text = sanitizeText(text);

  // convert \r\n or \r to \n, trim leading/trailing whitespace, remove extra newlines
  const lines = text
    .replace(/\r\n|\r/g, '\n')
    .replace(/\s*\n\s*/g, '\n')
    .trim()
    .split('\n');

  const blocks: ContentBlock[] = [];

  let sequence = 1;
  let prevHeader = '';
  let lineStart = 1;
  let paragraphs: string[] = [];

  lines.forEach((line, lineIndex) => {

    if (isHeader(line)) {

      if (paragraphs.length > 0 || prevHeader) {
        // flush previous block
        blocks.push({
          id: uuidv4(),
          adventureId,
          sequence,
          header: prevHeader,
          paragraphs,
          lineStart,
          lineEnd: lineIndex,
        });
        sequence++;
        paragraphs = [];
      }

      // new block
      prevHeader = line;
      lineStart = lineIndex + 1;

    } else {
      paragraphs.push(line);
    }
  });

  // final block
  if (paragraphs.length > 0 || prevHeader) {
    blocks.push({
      id: uuidv4(),
      adventureId,
      sequence,
      header: prevHeader,
      paragraphs,
      lineStart,
      lineEnd: lines.length,
    });
  }

  return blocks;
}
