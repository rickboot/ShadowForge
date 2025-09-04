import { z } from "zod";

export const DnDFiveEStatBlock = z.object({
    name: z.string(),
    armor_class: z.number(),
    hit_points: z.number(),
    challenge_rating: z.union([
        z.number().min(0).max(30), // Integer CR values 0-30
        z.enum(["1/8", "1/4", "1/2"]) // Fractional CR values
    ]),
    traits: z.array(z.object({ name: z.string(), text: z.string() })).default([]),
    actions: z.array(z.object({ name: z.string(), text: z.string() })).default([]),
})

export type DndFiveE = z.infer<typeof DnDFiveEStatBlock>;

export const SDStatBlock = z.object({
    name: z.string(),
    level: z.number().int().min(0).max(10),
    armor_class: z.number().int().min(1).max(25),
    hit_points: z.number().int().min(1).max(300),
    attack_bonus: z.number().int().min(0).max(15),
    damage_per_hit: z.string(), // eg. '2d8'
    movement: z.number().int().min(0).max(100),
    abilities: z.array(z.object({ name: z.string(), text: z.string() })).default([]),
})

export type SD = z.infer<typeof SDStatBlock>;