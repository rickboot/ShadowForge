import { z } from 'zod';
import { CONTENT_TYPES } from '@/lib/constants/conversion';

// ─── Content Types ────────────────────────────────────────────────────────────

export const ContentTypeSchema = z.enum(CONTENT_TYPES);

// ─── Classification ───────────────────────────────────────────────────────────

export const ContentBlockSchema = z.object({
  id: z.string(),
  adventureId: z.string(),
  sequence: z.number().int().positive(),
  header: z.string(),
  paragraphs: z.array(z.string()),
});

export const ClassifiedBlockSchema = ContentBlockSchema.extend({
  contentType: ContentTypeSchema,
  explanation: z.string(),
  confidence: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  source: z.literal('LLM'),
  rulesMatched: z.array(z.string()),
});

export const ClassificationResponseSchema = z.object({
  blocks: z.array(ClassifiedBlockSchema),
});

// ─── Conversion ───────────────────────────────────────────────────────────────

export const EnemySchema = z.object({
  name: z.string(),
  hd: z.string(),
  ac: z.number().int(),
  attack: z.string(),
  morale: z.number().int().optional(),
  notes: z.string().optional(),
});

export const TrapSchema = z.object({
  description: z.string(),
  dc: z.number().int().optional(),
  notes: z.string().optional(),
});

export const TreasureItemSchema = z.object({
  name: z.string(),
  value: z.string().optional(),
  xp: z.number().int().optional(),
  notes: z.string().optional(),
});

export const ConvertedBlockSchema = z.object({
  header: z.string(),
  boxedText: z.string().optional(),
  enemies: z.array(EnemySchema).optional(),
  traps: z.array(TrapSchema).optional(),
  treasure: z.array(TreasureItemSchema).optional(),
  gmNotes: z.string().optional(),
});

export const ConversionResponseSchema = z.object({
  blocks: z.array(ConvertedBlockSchema),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type ClassifiedBlock = z.infer<typeof ClassifiedBlockSchema>;
export type ClassificationResponse = z.infer<typeof ClassificationResponseSchema>;
export type ConvertedBlock = z.infer<typeof ConvertedBlockSchema>;
export type ConversionResponse = z.infer<typeof ConversionResponseSchema>;
export type Enemy = z.infer<typeof EnemySchema>;
export type Trap = z.infer<typeof TrapSchema>;
export type TreasureItem = z.infer<typeof TreasureItemSchema>;
