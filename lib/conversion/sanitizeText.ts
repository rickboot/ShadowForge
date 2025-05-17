export function sanitizeText(text: string): string {
  // Replace Unicode Replacement Character with [INVALID]

  let invalidCount = 0;
  text.replace(/\uFFFD/g, () => {
    invalidCount++;
    return '[INVALID]';
  });

  if (invalidCount > 0)
    console.log(
      `sanitizeText: Replaced ${invalidCount} invalid Unicode character(s) with [INVALID]`,
    );

  // remove misc unicode characters
  text
    .replace(/\uFFFD/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[\u200B-\u200F\u2028-\u202F\u00AD]/g, '');

  return text;
}
