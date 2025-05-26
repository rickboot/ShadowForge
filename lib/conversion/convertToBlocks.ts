import { sanitizeText } from './sanitizeText';
import { v4 as uuidv4 } from 'uuid';
import { ContentBlock } from '@/lib/constants/content';
import { isHeader } from '@/lib/utils/isHeader';


export function convertToBlocks(
  adventureId: string,
  text: string | null | undefined,
): ContentBlock[] {
  if (!text || typeof text !== 'string') return [];

  text = sanitizeText(text);
  const lines = text.split('\n');

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
