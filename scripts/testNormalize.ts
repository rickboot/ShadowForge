import fs from 'fs';
import path from 'path';
import { normalizeInputText } from '@/lib/conversion/normalizeText';

const inputPath = path.resolve(__dirname, 'sample.txt');
const raw = fs.readFileSync(inputPath, 'utf-8');

const normalized = normalizeInputText(raw);

console.log('✅ Normalized Output:\n');
console.log(normalized);
