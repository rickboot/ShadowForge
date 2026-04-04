import fs from 'fs';
import path from 'path';

const cache = new Map<string, string>();

export function loadPrompt(name: 'classification' | 'conversion'): string {
  if (cache.has(name)) return cache.get(name)!;

  const filePath = path.join(process.cwd(), 'lib', 'prompts', 'system', `${name}.md`);
  const content = fs.readFileSync(filePath, 'utf-8').trim();
  cache.set(name, content);
  return content;
}
