# Universal Conversion Mechanics

**Purpose:** Core formulas and tables for converting any D&D edition to Shadowdark RPG.

## Armor Class Conversions

### From Descending AC (B/X, AD&D)
**Formula:** Shadowdark AC = 20 - Old School AC

| Old AC | New AC | Armor Type |
|--------|--------|------------|
| 10 | 10 | Unarmored |
| 9 | 11 | Leather |
| 7 | 13 | Chain Mail |
| 5 | 15 | Plate Mail |
| 2 | 18 | Magical Plate |
| 0 | 20 | Heavy Magical |

### From THAC0 (AD&D)
**Attack Bonus Formula:** Attack Bonus = 20 - THAC0

| THAC0 | Attack Bonus |
|-------|--------------|
| 20 | +0 |
| 15 | +5 |
| 10 | +10 |

### From Ascending AC (3E+, 5E)
**Direct conversion** - use existing AC values

## Hit Points & Levels

### Monster Level Conversion
| Source | Shadowdark Level |
|--------|------------------|
| 1 HD | Level 1 |
| 2 HD | Level 2 |
| 3 HD | Level 3 |
| 4 HD | Level 4 |
| 5 HD | Level 5 |
| CR 1/4 | Level 1 |
| CR 1/2 | Level 1 |
| CR 1 | Level 2 |
| CR 2 | Level 3 |
| CR 3 | Level 4 |
| CR 4 | Level 5 |
| CR 5 | Level 6 |

### Hit Points Formula
**HP = Monster Level × d8 + CON modifier**

### Attack Bonus Formula
**Attack Bonus = Monster Level** (maximum +10)

## Spell Conversions

### Spell Level to Tier
| Source Level | Shadowdark Tier |
|--------------|-----------------|
| 0 (Cantrips) | Tier 1 |
| 1 | Tier 1 |
| 2 | Tier 2 |
| 3 | Tier 2 |
| 4 | Tier 3 |
| 5 | Tier 3 |
| 6 | Tier 4 |
| 7 | Tier 4 |
| 8 | Tier 5 |
| 9 | Tier 5 |

### Spell Save DCs
| Caster Level | DC |
|--------------|-----|
| 1-2 | 12 |
| 3-4 | 13 |
| 5-6 | 14 |
| 7+ | 15 |

## Treasure Scaling

### Monetary Conversion
- **From B/X, AD&D:** Divide by 10
- **From 3E/3.5:** Divide by 20  
- **From 5E:** Divide by 10

### Experience Points
- **Poor treasure:** 1 XP
- **Normal treasure:** 2 XP
- **Fabulous treasure:** 3 XP
- **+1 magic items:** 3 XP
- **Significant items:** 5 XP

## Saving Throws

### Universal Save Conversion
| Old Save Type | Shadowdark Save |
|---------------|-----------------|
| Death/Poison | Death (STR) |
| Wands/Devices | Spells (WIS) |
| Paralysis/Stone | Death (STR) |
| Dragon Breath | Death (DEX) |
| Spells/Magic | Spells (WIS) |
| Fortitude | Death (STR/CON) |
| Reflex | Death (DEX) |
| Will | Spells (WIS) |

## Output Templates

### Monster Stat Block
```
[Monster Name]
Level: [X]
AC: [Y] 
HP: [Z]
Attacks: [Number] [Type] +[Level] ([Damage])
STR +X, DEX +X, CON +X, INT +X, WIS +X, CHA +X
[Special abilities - max 3]
```

### Spell Conversion
```
[Spell Name] (Tier [1-5])
Range: [Close/Near/Far]
Duration: [Time or Focus]
Effect: [Simple description]
```

## Conversion Rules
1. **Preserve adventure structure** - don't change narrative
2. **Convert mechanics only** - stats, numbers, dice
3. **Simplify special abilities** - maximum 3 per creature
4. **Use advantage/disadvantage** instead of complex modifiers
5. **Maintain relative threat levels** between encounters