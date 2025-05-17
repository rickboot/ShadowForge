import { sanitizeText } from './sanitizeText';
import { v4 as uuidv4 } from 'uuid';
// import { classifyText } from '../utils/prototypeChunkClassifier';

type Block = {
  id: string;
  sequence: number;
  header: string;
  paragraphs: string[];
  lineStart: number;
  lineEnd: number;
};

function isHeader(line: string): boolean {
  if (line.length > 60) return false;
  if (/[.?!]$/.test(line)) return false;
  if (line === '') return false;

  const isNumbered = /^[\dA-Za-z]+[\).:\-–—]\s+/.test(line);
  const isFormattedHeader = /^[A-Z0-9'’\-:(), ]+$/i.test(line);
  return isNumbered || isFormattedHeader;
}

export function chunkTextToBlocks(text: string | null | undefined): Block[] {
  if (!text || typeof text !== 'string') return [];

  text = sanitizeText(text);

  console.log('************ConvertToBlocks: text', text);

  // converts \r\n or \r to \n, trims lines, and removes extra newlines
  const lines = text
    .replace(/\r\n|\r/g, '\n')
    .replace(/\s*\n\s*/g, '\n')
    .trim()
    .split('\n');

  const blocks: Block[] = [];

  let sequence = 1;
  let header = '';
  let lineStart = 1;
  let paragraphs: string[] = [];

  lines.forEach((line, lineIndex) => {
    if (isHeader(line)) {
      if (paragraphs.length > 0) {
        // flush previous block
        blocks.push({
          id: uuidv4(),
          sequence,
          header,
          paragraphs,
          lineStart,
          lineEnd: lineIndex,
        });
        sequence++;
        paragraphs = [];
      }
      // new block
      header = line;
      lineStart = lineIndex + 1;
    } else {
      paragraphs.push(line);
    }
  });

  // final block
  if (paragraphs.length > 0) {
    blocks.push({
      id: uuidv4(),
      sequence,
      header,
      paragraphs,
      lineStart,
      lineEnd: lines.length,
    });
  }

  return blocks;
}
