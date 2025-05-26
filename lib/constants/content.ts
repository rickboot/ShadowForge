import { ClassificationConfidence, ClassificationSource } from "./conversion";
import { ContentType } from './conversion';

export type ContentBlock = {
    id: string;
    adventureId: string;
    sequence: number;
    header: string;
    paragraphs: string[];
    lineStart?: number;
    lineEnd?: number;
};

export type ClassifiedContent = {
    id: string;
    sequence: number;
    adventureId: string;
    header: string;
    contentType: ContentType;
    paragraphs: string[];
    explanation: string;
    confidence: ClassificationConfidence;
    source: ClassificationSource;
    rulesMatched: string[];
};