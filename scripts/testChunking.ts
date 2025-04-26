import fs from 'fs';
import path from 'path';

import { chunkInputText } from '@/lib/conversion/chunkText';

const inputPath = path.resolve(__dirname, 'sample.txt');
const raw = fs.readFileSync(inputPath, 'utf-8');

const chunks = chunkInputText(raw);

console.log(`Chunks: ${chunks.length}`);

chunks.forEach((chunk, i) => {
  console.log(
    `\nChunk: ${i} ---------------------------------------------------------------------------------------\n`,
  );
  console.log(chunk);
  console.log('\n');
});
