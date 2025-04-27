import fs from 'fs';
import path from 'path';
import { normalizeText } from '../lib/conversion/normalizeText';

try {
  const inputFile = process.argv[2] || 'sample.txt';
  const inputPath = path.resolve(__dirname, inputFile);
  const raw = fs.readFileSync(inputPath, 'utf-8');
  const normalized = normalizeText(raw);

  console.log('✅ Normalized Output:\n');
  console.log(normalized);

  fs.writeFileSync(
    path.resolve(__dirname, 'sample_normalized.txt'),
    normalized,
  );
  console.log('✅ Normalized output written to sample_normalized.txt');
} catch (err) {
  console.error('❌ Failed to read or normalize file:', err);
}
