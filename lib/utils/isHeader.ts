import { MAX_HEADER_CHARS, MAX_LONG_HEADER_WORDS, MAX_SHORT_HEADER_WORDS, MINOR_TITLE_WORDS } from "../constants/conversion";
import { HEADER_REGEX } from "../constants/regex";


// Header detection rules are evaluated in order
// 1. Numbered headers like "1. Introduction"
// 2. Short headers with no punctuation
// 3. Title case headers with no punctuation
// 4. Dramatic one-liners ending in ! or ?

export function isHeader(line: string): boolean {
    const trimmed = line.trim();
    if (trimmed.length === 0) return false;
    if (trimmed.length > MAX_HEADER_CHARS) return false;

    const hasHeaderAllowedCharacters = HEADER_REGEX.ALLOWED_CHARS.test(trimmed);
    const isNumbered = HEADER_REGEX.NUMBERED.test(trimmed);

    const wordCount = trimmed.split(/\s+/).length;
    const words = trimmed.split(/\s+/);

    const isFirstWordCapitalized = words.length > 0 && /^[A-Z]/.test(words[0]);
    const areOtherWordsTitleCase = words.slice(1).every(word =>
        MINOR_TITLE_WORDS.has(word.toLowerCase()) || /^[A-Z]/.test(word)
    );
    const isTitleCase = isFirstWordCapitalized && areOtherWordsTitleCase && wordCount > 2;

    const hasNoEndingPunctuation = HEADER_REGEX.HAS_NO_ENDING_PUNCTUATION.test(trimmed);

    const isDramaticHeader = HEADER_REGEX.DRAMATIC.test(trimmed) && wordCount <= 8;

    if (isNumbered && wordCount <= MAX_LONG_HEADER_WORDS) return true;
    if (hasHeaderAllowedCharacters && wordCount <= MAX_SHORT_HEADER_WORDS && hasNoEndingPunctuation) return true;
    if (hasHeaderAllowedCharacters && isTitleCase && wordCount <= MAX_LONG_HEADER_WORDS && hasNoEndingPunctuation) return true;
    if (isDramaticHeader) return true;
    return false;
}
