import { ConvertedBlock } from '@/lib/schemas';

export function renderBlockToMarkdown(block: ConvertedBlock): string {
  const lines: string[] = [];

  lines.push(`### ${block.header}`, '');

  if (block.boxedText) {
    lines.push('**Boxed Text**', block.boxedText, '');
  }

  if (block.enemies?.length) {
    lines.push('**Enemies**');
    for (const e of block.enemies) {
      const morale = e.morale !== undefined ? `, morale ${e.morale}` : '';
      lines.push(`**${e.name}** (HD ${e.hd}, AC ${e.ac}, *${e.attack}*${morale})`);
      if (e.notes) lines.push(`*${e.notes}*`);
    }
    lines.push('');
  }

  if (block.traps?.length) {
    lines.push('**Traps and Secrets**');
    for (const t of block.traps) {
      const dc = t.dc !== undefined ? ` *(DC ${t.dc})*` : '';
      lines.push(`${t.description}${dc}${t.notes ? ` — ${t.notes}` : ''}`);
    }
    lines.push('');
  }

  if (block.treasure?.length) {
    lines.push('**Treasure**');
    for (const item of block.treasure) {
      const meta = [item.value, item.xp !== undefined ? `≈${item.xp} XP` : undefined]
        .filter(Boolean)
        .join(', ');
      const metaStr = meta ? ` (*${meta}*)` : '';
      const notes = item.notes ? ` — ${item.notes}` : '';
      lines.push(`- **${item.name}**${metaStr}${notes}`);
    }
    lines.push('');
  }

  if (block.gmNotes) {
    lines.push(`*GM Note: ${block.gmNotes}*`, '');
  }

  return lines.join('\n').trimEnd();
}

export function renderToMarkdown(blocks: ConvertedBlock[]): string {
  return blocks.map(renderBlockToMarkdown).join('\n\n');
}
