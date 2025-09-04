import { z } from "zod";

export const DnDFiveEStatBlock = z.object({
    name: z.string(),
    armor_class: z.number(),
    hit_points: z.number(),
    challenge_rating: z.number(),
    traits: z.array(z.object({ name: z.string(), text: z.string() })),
    actions: z.array(z.object({ name: z.string(), text: z.string() })),
})

export type DndFiveE = z.infer<typeof DnDFiveEStatBlock>;

export const SDStatBlock = z.object({
    name: z.string(),
    level: z.number(),
    AC: z.number(),
    HP: z.number(),
    attack_bonus: z.number(),
    damage_per_hit: z.number(),
    movement: z.number(),
    abilities: z.array(z.object({ name: z.string(), text: z.string() })),
})

export type SDStatBlock = z.infer<typeof SDStatBlock>;