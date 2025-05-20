function isHeader(line: string): boolean {
  if (line.length > 60) return false;
  if (/[.?!]$/.test(line)) return false;
  if (line.trim() === '') return false;

  const isNumbered = /^[A-Z\d]+[.)]\s+/.test(line);
  const isFormatted = /^[A-Z0-9'"’“”\-–—:(), ]+$/i.test(line);

  return isNumbered || isFormatted;
}

const testLines = [
  'bucket hangs from a rope-and-pulley mechanism bolted',
  'Five side rooms once served as quarters for senior',
  'straw mattress and a wooden chest to hold personal',
  'that can be picked with thieves\' tools and a successful',
];

testLines.forEach(line => {
  console.log(`'${line}' => isHeader:`, isHeader(line));
});
