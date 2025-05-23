import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { normalizeText } from '../lib/conversion/normalizeText';

// Rebuild __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
