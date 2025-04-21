export function estimateTokenCount(input: string): number {
  const wordCount = input.split(/\s+/).length;
  return wordCount * 1.5;
}
