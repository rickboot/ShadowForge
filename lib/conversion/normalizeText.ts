export function normalizeInputText(text: string | null | undefined): string {
  if (!text || typeof text !== 'string') return '';

  const lines = text.replace(/\r\n/g, '\n').trim().split('\n');
  const paragraphs: string[] = [];
  let currentParagraph = '';

  const endsWithPunctuation = /[.?!]["')\]]?\s*$/;
  const isNumberedHeader = /^\s*\d+\s*[.)]\s+/; // Matches "12. Room" or "5) Vault"
  const isSubheader = (line: string): boolean =>
    /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*$/.test(line) &&
    line.length <= 40 &&
    !line.endsWith('.'); // e.g. "Dumbwaiter", "Secret Door", "Treasure"
  const isBlank = (line: string) => line.trim() === '';

  const n = lines.length;

  for (let i = 0; i < n; i++) {
    const line = lines[i].trim();

    if (isBlank(line)) {
      if (!currentParagraph) continue;

      // Look ahead to next non-blank line
      let next = '';
      for (let j = i + 1; j < n; j++) {
        if (!isBlank(lines[j])) {
          next = lines[j].trim();
          break;
        }
      }

      const isBreak =
        !next ||
        isNumberedHeader.test(next) ||
        isSubheader(next) ||
        endsWithPunctuation.test(currentParagraph);

      if (isBreak) {
        paragraphs.push(currentParagraph);
        currentParagraph = '';
      }
      // If not a real break, skip the blank and continue appending
    } else if (isNumberedHeader.test(line) || isSubheader(line)) {
      // Push paragraph before headers or subheadings
      if (currentParagraph) paragraphs.push(currentParagraph);
      paragraphs.push(line);
      currentParagraph = '';
    } else {
      currentParagraph += currentParagraph ? ' ' + line : line;
    }
  }

  if (currentParagraph) {
    paragraphs.push(currentParagraph);
  }

  return paragraphs
    .join('\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
