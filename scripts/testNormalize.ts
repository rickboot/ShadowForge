import fs from 'fs';
import path from 'path';
import { normalizeInputText } from '../lib/normalizeInputText';

const inputPath = path.resolve(__dirname, 'sample.txt');
const raw = fs.readFileSync(inputPath, 'utf-8');

const normalized = normalizeInputText(raw);

console.log('✅ Normalized Output:\n');
console.log(normalized);
