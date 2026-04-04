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

// Minimal response from LLM — only the id→contentType mapping we need
export const ClassificationItemSchema = z.object({
  id: z.string(),
  contentType: z.preprocess(
    (v) => (CONTENT_TYPES as readonly string[]).includes(String(v)) ? v : 'Unknown',
    ContentTypeSchema,
  ),
});

export const ClassificationResponseSchema = z.object({
  blocks: z.array(ClassificationItemSchema),
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

export type ClassificationItem = z.infer<typeof ClassificationItemSchema>;
export type ClassificationResponse = z.infer<typeof ClassificationResponseSchema>;
export type ConvertedBlock = z.infer<typeof ConvertedBlockSchema>;
export type ConversionResponse = z.infer<typeof ConversionResponseSchema>;
export type Enemy = z.infer<typeof EnemySchema>;
export type Trap = z.infer<typeof TrapSchema>;
export type TreasureItem = z.infer<typeof TreasureItemSchema>;
