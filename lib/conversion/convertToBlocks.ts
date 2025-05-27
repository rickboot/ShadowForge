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

  //! blocks are normally header + paragraphs, but can be just a header, or just paragraphs
  const blocks: ContentBlock[] = [];

  let sequence = 1;
  let prevHeader = '';
  let lineStart = 1;
  let paragraphs: string[] = [];

  lines.forEach((line, lineIndex) => {

    if (isHeader(line)) {
      //! if previous header or paragraphs, push block
      if (paragraphs.length > 0 || prevHeader) {
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

      //! start new block
      prevHeader = line;
      lineStart = lineIndex + 1;

    } else {
      paragraphs.push(line);
    }
  });

  //! final block
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
