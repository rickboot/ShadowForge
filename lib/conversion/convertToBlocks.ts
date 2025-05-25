import { sanitizeText } from './sanitizeText';
import { v4 as uuidv4 } from 'uuid';
import { ContentBlock } from '@/lib/constants/content';
import { isHeader } from '@/lib/utils/isHeader';


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
