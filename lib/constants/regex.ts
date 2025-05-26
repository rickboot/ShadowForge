export const HEADER_REGEX = {
    ALLOWED_CHARS: /^[A-Za-z0-9'"’“”\-–—:(),! ]+$/,
    NUMBERED: /^[A-Z\d]+[.)]\s+/, // e.g. "1.", "B)", "III)"
    TITLE_CASE: /^[A-Z][A-Za-z0-9'"’“”\-–—:(),! ]+$/,
    DRAMATIC: /^(["“”'])?.+[!?](["”’'])?$/,
    HAS_NO_ENDING_PUNCTUATION: /^[^.!?](["“”’])?$/,
}