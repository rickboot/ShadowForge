// import { normalizeText } from '@/lib/conversion/normalizeText';

// describe('normalizeText', () => {
//   // 1. Handles null, undefined, or non-string input
//   test('should return empty string for null, undefined, or non-string input', () => {
//     expect(normalizeText(null)).toBe('');
//     expect(normalizeText(undefined)).toBe('');
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     expect(normalizeText(123 as any)).toBe('');
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     expect(normalizeText({} as any)).toBe('');
//   });

//   test('should return empty string for empty string input', () => {
//     expect(normalizeText('')).toBe('');
//   });

//   test('should normalize line endings and trim overall whitespace', () => {
//     const input = ' \r\nLine 1\r\nLine 2\r\n ';
//     const expectedOutput = 'Line 1 Line 2';
//     expect(normalizeText(input)).toBe(expectedOutput);
//   });

//   test('should normalize mixed line endings', () => {
//     const input = 'Line 1\r\nLine 2\nLine 3';
//     const expectedOutput = 'Line 1 Line 2 Line 3';
//     expect(normalizeText(input)).toBe(expectedOutput);
//   });

//   test('should normalize multiple internal spaces and tabs', () => {
//     const input = 'Line   1\twith  \t spaces';
//     const expectedOutput = 'Line 1 with spaces';
//     expect(normalizeText(input)).toBe(expectedOutput);
//   });

//   test('should handle a single paragraph with line breaks', () => {
//     const input =
//       'This is the first sentence.\nThis is the second sentence.\nAnd the third.';
//     const expectedOutput =
//       'This is the first sentence. This is the second sentence. And the third.';
//     expect(normalizeText(input)).toBe(expectedOutput);
//   });

//   test('should break paragraph on blank line followed by a numbered header', () => {
//     const input = 'End of area description.\n\n1. New Room';
//     const expectedOutput = 'End of area description.\n\n1. New Room';
//     expect(normalizeText(input)).toBe(expectedOutput);
//   });

//   test('should break paragraph on blank line followed by a simple header', () => {
//     const input = 'End of area description.\n\nTREASURE';
//     const expectedOutput = 'End of area description.\n\nTREASURE';
//     expect(normalizeText(input)).toBe(expectedOutput);
//   });

//   test('should break paragraph on blank line if previous line ended with punctuation', () => {
//     const input =
//       'This is the end of the paragraph.\n\nThis is the start of a new one.';
//     const expectedOutput =
//       'This is the end of the paragraph.\n\nThis is the start of a new one.';
//     expect(normalizeText(input)).toBe(expectedOutput);
//   });

//   test('should treat numbered list item as a header', () => {
//     const input = 'Some text above.\n1. This is a section header';
//     const expectedOutput = 'Some text above.\n\n1. This is a section header';
//     expect(normalizeText(input)).toBe(expectedOutput);
//   });

//   test('should treat lettered list item as a header', () => {
//     const input = 'Some text above.\nA) This is another header';
//     const expectedOutput = 'Some text above.\n\nA) This is another header';
//     expect(normalizeText(input)).toBe(expectedOutput);
//   });

//   test('should treat all caps line as a header', () => {
//     const input = 'Description follows.\nMONSTER STATS\nDetails here.';
//     const expectedOutput =
//       'Description follows.\n\nMONSTER STATS\n\nDetails here.';
//     expect(normalizeText(input)).toBe(expectedOutput);
//   });

//   test('should treat title case line as a header', () => {
//     const input = 'Description follows.\nSpecial Treasure\nDetails here.';
//     const expectedOutput =
//       'Description follows.\n\nSpecial Treasure\n\nDetails here.';
//     expect(normalizeText(input)).toBe(expectedOutput);
//   });

//   test('should not treat a long line as a header', () => {
//     const input =
//       'Start of text.\nTHIS IS A VERY LONG SENTENCE THAT SHOULD NOT BE CONSIDERED A HEADER EVEN THOUGH IT IS ALL CAPS.\nMore text.';
//     const expectedOutput =
//       'Start of text. THIS IS A VERY LONG SENTENCE THAT SHOULD NOT BE CONSIDERED A HEADER EVEN THOUGH IT IS ALL CAPS. More text.';
//     expect(normalizeText(input)).toBe(expectedOutput);
//   });

//   test('should not treat a line ending with period as a simple header', () => {
//     const input = 'Notes:\nNOTE.\nSome important note.';
//     const expectedOutput = 'Notes: NOTE. Some important note.';
//     expect(normalizeText(input)).toBe(expectedOutput);
//   });

//   test('should handle multiple paragraphs separated by blank lines and punctuation', () => {
//     const input =
//       'First paragraph ends here.\n\nSecond paragraph starts here. It continues on this line.\n\nThird paragraph.';
//     const expectedOutput =
//       'First paragraph ends here.\n\nSecond paragraph starts here. It continues on this line.\n\nThird paragraph.';
//     expect(normalizeText(input)).toBe(expectedOutput);
//   });

//   test('should handle mixed headers and paragraphs', () => {
//     const input =
//       'Introduction text.\n\n1. First Section\nContent of first section.\nMore content.\n\nTREASURE\nDetails about treasure.';
//     const expectedOutput =
//       'Introduction text.\n\n1. First Section\n\nContent of first section. More content.\n\nTREASURE\n\nDetails about treasure.';
//     expect(normalizeText(input)).toBe(expectedOutput);
//   });

//   test('should handle excessive blank lines between paragraphs', () => {
//     const input = 'Paragraph one.\n\n\n\nParagraph two.';
//     const expectedOutput = 'Paragraph one.\n\nParagraph two.'; // Should collapse multiple newlines
//     expect(normalizeText(input)).toBe(expectedOutput);
//   });

//   test('should handle leading/trailing whitespace on lines within paragraphs', () => {
//     const input = ' Line 1\n  Line 2  \nLine 3 ';
//     const expectedOutput = 'Line 1 Line 2 Line 3';
//     expect(normalizeText(input)).toBe(expectedOutput);
//   });
// });
import { normalizeText } from '@/lib/conversion/normalizeText';

describe('normalizeText', () => {
  // Input Validation
  describe('[Normalization] Input Validation', () => {
    test('returns empty string for null, undefined, or non-string input', () => {
      expect(normalizeText(null)).toBe('');
      expect(normalizeText(undefined)).toBe('');
      expect(normalizeText(123 as any)).toBe('');
      expect(normalizeText({} as any)).toBe('');
    });

    test('returns empty string for empty string input', () => {
      expect(normalizeText('')).toBe('');
    });
  });

  // Line Ending and Whitespace Normalization
  describe('[Normalization] Line endings and internal whitespace', () => {
    test('normalizes Windows and Unix line endings to Unix', () => {
      const input = 'Line 1\r\nLine 2\nLine 3';
      const expectedOutput = 'Line 1 Line 2 Line 3';
      expect(normalizeText(input)).toBe(expectedOutput);
    });

    test('removes excess internal spaces and tabs', () => {
      const input = 'Line   1\twith  \t spaces';
      const expectedOutput = 'Line 1 with spaces';
      expect(normalizeText(input)).toBe(expectedOutput);
    });

    test('trims leading and trailing whitespace within lines', () => {
      const input = ' Line 1\n  Line 2  \nLine 3 ';
      const expectedOutput = 'Line 1 Line 2 Line 3';
      expect(normalizeText(input)).toBe(expectedOutput);
    });
  });

  // Paragraph Preservation
  describe('[Preservation] Merging lines into paragraphs', () => {
    test('merges lines into a single paragraph when no blank lines', () => {
      const input =
        'This is the first sentence.\nThis is the second sentence.\nAnd the third.';
      const expectedOutput =
        'This is the first sentence. This is the second sentence. And the third.';
      expect(normalizeText(input)).toBe(expectedOutput);
    });
  });

  // Paragraph Segmentation
  describe('[Segmentation] Paragraph splitting', () => {
    test('splits paragraphs on blank line followed by a numbered header', () => {
      const input = 'End of area description.\n\n1. New Room';
      const expectedOutput = 'End of area description.\n\n1. New Room';
      expect(normalizeText(input)).toBe(expectedOutput);
    });

    test('splits paragraphs on blank line followed by a simple header', () => {
      const input = 'End of area description.\n\nTREASURE';
      const expectedOutput = 'End of area description.\n\nTREASURE';
      expect(normalizeText(input)).toBe(expectedOutput);
    });

    test('splits paragraphs on blank line following a line ending with punctuation', () => {
      const input =
        'This is the end of the paragraph.\n\nThis is the start of a new one.';
      const expectedOutput =
        'This is the end of the paragraph.\n\nThis is the start of a new one.';
      expect(normalizeText(input)).toBe(expectedOutput);
    });

    test('splits paragraphs on multiple blank lines reduced to single break', () => {
      const input = 'Paragraph one.\n\n\n\nParagraph two.';
      const expectedOutput = 'Paragraph one.\n\nParagraph two.';
      expect(normalizeText(input)).toBe(expectedOutput);
    });
  });

  // Header Detection
  describe('[Segmentation] Header detection and splitting', () => {
    test('splits before numbered list headers', () => {
      const input = 'Some text above.\n1. This is a section header';
      const expectedOutput = 'Some text above.\n\n1. This is a section header';
      expect(normalizeText(input)).toBe(expectedOutput);
    });

    test('splits before lettered list headers', () => {
      const input = 'Some text above.\nA) This is another header';
      const expectedOutput = 'Some text above.\n\nA) This is another header';
      expect(normalizeText(input)).toBe(expectedOutput);
    });

    test('splits before all-caps headers', () => {
      const input = 'Description follows.\nMONSTER STATS\nDetails here.';
      const expectedOutput =
        'Description follows.\n\nMONSTER STATS\n\nDetails here.';
      expect(normalizeText(input)).toBe(expectedOutput);
    });

    test('splits before title case headers', () => {
      const input = 'Description follows.\nSpecial Treasure\nDetails here.';
      const expectedOutput =
        'Description follows.\n\nSpecial Treasure\n\nDetails here.';
      expect(normalizeText(input)).toBe(expectedOutput);
    });

    test('does not treat a long all-caps line as a header', () => {
      const input =
        'Start of text.\nTHIS IS A VERY LONG SENTENCE THAT SHOULD NOT BE CONSIDERED A HEADER EVEN THOUGH IT IS ALL CAPS.\nMore text.';
      const expectedOutput =
        'Start of text. THIS IS A VERY LONG SENTENCE THAT SHOULD NOT BE CONSIDERED A HEADER EVEN THOUGH IT IS ALL CAPS. More text.';
      expect(normalizeText(input)).toBe(expectedOutput);
    });

    test('does not treat a line ending with a period as a header', () => {
      const input = 'Notes:\nNOTE.\nSome important note.';
      const expectedOutput = 'Notes: NOTE. Some important note.';
      expect(normalizeText(input)).toBe(expectedOutput);
    });
  });

  // Mixed Complex Cases
  describe('[Mixed] Complex mixed paragraphs and headers', () => {
    test('handles multiple paragraphs separated by blank lines and punctuation', () => {
      const input =
        'First paragraph ends here.\n\nSecond paragraph starts here. It continues on this line.\n\nThird paragraph.';
      const expectedOutput =
        'First paragraph ends here.\n\nSecond paragraph starts here. It continues on this line.\n\nThird paragraph.';
      expect(normalizeText(input)).toBe(expectedOutput);
    });

    test('handles mixed headers and paragraphs correctly', () => {
      const input =
        'Introduction text.\n\n1. First Section\nContent of first section.\nMore content.\n\nTREASURE\nDetails about treasure.';
      const expectedOutput =
        'Introduction text.\n\n1. First Section\n\nContent of first section. More content.\n\nTREASURE\n\nDetails about treasure.';
      expect(normalizeText(input)).toBe(expectedOutput);
    });
  });
});
