export function sanitizeText(text: string): string {
  return text
    // replace invalid characters from OCR with [INVALID] that LLM will ignore
    .replace(/\uFFFD/g, '[INVALID]')
    // remove control characters
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    // remove zero width spaces and other control characters
    .replace(/[\u200B-\u200F\u2028-\u202F\u00AD]/g, '')
    // convert \r\n and \r to \n
    .replace(/\r\n|\r/g, '\n')
    // remove extra newlines
    .replace(/\s*\n\s*/g, '\n')
    // remove extra spaces before newlines
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    //TODO: filter malicious attempts - LLM prompt and script injection, size limits, etc
    .trim()
}
