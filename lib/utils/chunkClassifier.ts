//

import { Block } from '../conversion/convertToBlocks';

// note: classification is done in order so higher hierarchy types come first
// todo: review the rules and order
export type ContentType =
  | 'Adventure'
  | 'Region'
  | 'City'
  | 'Site'
  | 'Encounter'
  | 'Dungeon'
  | 'Room'
  | 'PointOfInterest'
  | 'Monster'
  | 'Treasure'
  | 'Character'
  | 'NPC'
  | 'MagicItem'
  | 'Intro'
  | 'Lore'
  | 'Quest'
  | 'CharacterBio'
  | 'TOC'
  | 'Credits'
  | 'Appendix'
  | 'Glossary'
  | 'Index'
  | 'Unknown';


type ClassificationSource = 'header' | 'body' | 'human' | 'llm' | 'unknown';

type ClassificationType =
  | 'LLM'
  | 'header-match'
  | 'body-match'
  | 'human'
  | 'unknown';

type ClassificationConfidence = 1 | 2 | 3;

// type ClassificationRule = {
//   type: ContentType;
//   test: (text: string) => boolean;
//   rationale: string;
// };

type ClassifiedContent = {
  adventureId: string;
  id: string;
  sequence: number;
  contentType: ContentType;
  header?: string;
  paragraphs: string[];
  explanation: string;
  confidence: ClassificationConfidence;
  source: ClassificationSource;
  rulesMatched: string[];
};

// const rules: ClassificationRule[] = [
//   {
//     type: 'Adventure',
//     test: (s) => /\badventure\b|\bcampaign\b/.test(s),
//     rationale: 'Mentions adventure or campaign setup.',
//   },
//   {
//     type: 'Region',
//     test: (s) => /\bregion\b|\barea\b/.test(s),
//     rationale: 'Mentions regions or defined areas.',
//   },
//   {
//     type: 'City',
//     test: (s) => /\bcity\b|\btown\b|\bvillage\b|\bsettlement\b/.test(s),
//     rationale: 'Mentions city or town.',
//   },
//   {
//     type: 'Intro',
//     test: (s) =>
//       /\bintroduction\b|\bthis book\b|\bhow to use\b|\bintended for the dungeon master\b/.test(
//         s,
//       ),
//     rationale: 'Module setup, not in-world content.',
//   },
//   {
//     type: 'Lore',
//     test: (s) =>
//       /\bhistory\b|\bancient\b|\blegend\b|\bcenturies ago\b|\blong ago\b/.test(
//         s,
//       ),
//     rationale: 'Backstory or historical exposition.',
//   },
//   {
//     type: 'Quest',
//     test: (s) => /\bquest\b|\bobjective\b|\bmission\b/.test(s),
//     rationale: 'Mentions objective or goal.',
//   },
//   {
//     type: 'Dungeon',
//     test: (s) => /\bdungeon\b|\bmap\b|\bkeyed encounter\b|\blayout\b/.test(s),
//     rationale: 'Structure or layout of a dungeon.',
//   },
//   {
//     type: 'Room',
//     test: (s) =>
//       /\broom\b|\bchamber\b|\bcave\b|\bhall\b|\bdoor\b|\bwalls\b|\bstatue\b/.test(
//         s,
//       ),
//     rationale: 'Describes a space or room.',
//   },
//   {
//     type: 'Monster',
//     test: (s) => /\bhp\b.*\bac\b|\bchallenge rating\b|\bstat block\b/.test(s),
//     rationale: 'Includes monster stats.',
//   },
//   {
//     type: 'Treasure',
//     test: (s) => /\bgp\b|\bgold\b|\bpotion\b|\bscroll\b|\btreasure\b/.test(s),
//     rationale: 'Mentions rewards or items of value.',
//   },
//   {
//     type: 'MagicItem',
//     test: (s) =>
//       /\bmagic (item|weapon|armor|scroll|potion)\b|\bspell\b/.test(s),
//     rationale: 'References magic gear or scrolls.',
//   },
//   {
//     type: 'NPC',
//     test: (s) =>
//       /\bdialogue\b|\bpersonality\b|\bsays\b|\bspeaks\b|\bmerchant\b|\bchild\b/.test(
//         s,
//       ),
//     rationale: 'NPC interaction or speech.',
//   },
//   {
//     type: 'CharacterBio',
//     test: (s) => /\bideal\b|\bbond\b|\bflaw\b|\btrait\b/.test(s),
//     rationale: '5e-style backstory terms.',
//   },
// ];

export const headerKeywordMap: Record<string, ContentType> = {
  // Room
  altar: 'Room', attic: 'Room', ballroom: 'Room', barracks: 'Room', bath: 'Room',
  bedchamber: 'Room', bedroom: 'Room', chamber: 'Room', closet: 'Room', court: 'Room',
  crypt: 'Room', dining: 'Room', door: 'Room', elevator: 'Room', entryway: 'Room',
  foyer: 'Room', gallery: 'Room', hall: 'Room', jail: 'Room', kitchen: 'Room', lair: 'Room',
  landing: 'Room', library: 'Room', lounge: 'Room', morgue: 'Room', nursery: 'Room',
  observatory: 'Room', office: 'Room', pantry: 'Room', parlor: 'Room', portal: 'Room',
  prison: 'Room',
  restroom: 'Room', room: 'Room', shrine: 'Room', spire: 'Room',
  stable: 'Room', stairs: 'Room', stairwell: 'Room', storage: 'Room', study: 'Room',
  suite: 'Room', theater: 'Room', toilet: 'Room', trap: 'Room', turret: 'Room',
  vault: 'Room', vestibule: 'Room', well: 'Room', workshop: 'Room',
  tomb: 'Room', area: 'Room', gateway: 'Room', gate: 'Room', portcullis: 'Room',

  // Point of Interest
  statue: 'PointOfInterest', alcove: 'PointOfInterest', plaque: 'PointOfInterest',
  inscription: 'PointOfInterest', fresco: 'PointOfInterest', relief: 'PointOfInterest',
  mural: 'PointOfInterest', pedestal: 'PointOfInterest', sigil: 'PointOfInterest',
  carving: 'PointOfInterest', niche: 'PointOfInterest', symbol: 'PointOfInterest',

  // Dungeon
  catacomb: 'Dungeon', chasm: 'Dungeon', dungeon: 'Dungeon', oubliette: 'Dungeon',
  pit: 'Dungeon', shaft: 'Dungeon', stronghold: 'Dungeon',

  // City (settlements like towns, villages, hamlets)
  village: 'City', town: 'City', hamlet: 'City', city: 'City', settlement: 'City',

  // Site or Subarea within City
  apothecary: 'Site', blacksmith: 'Site', brothel: 'Site', casino: 'Site',
  chapel: 'Site', church: 'Site', cottage: 'Site', forge: 'Site', guild: 'Site',
  hospital: 'Site', house: 'Site', inn: 'Site', manor: 'Site', mansion: 'Site',
  market: 'Site', mill: 'Site', monastery: 'Site', orphanage: 'Site', ruins: 'Site',
  shop: 'Site', shoppe: 'Site', smithy: 'Site', square: 'Site', store: 'Site',
  tavern: 'Site', tenement: 'Site', townhouse: 'Site', tower: 'Site', wall: 'Site',
  watchtower: 'Site', zoo: 'Site', hostel: 'Site', hovel: 'Site',

  // Region
  badlands: 'Region', beacon: 'Region', bog: 'Region', brambles: 'Region',
  bridge: 'Region', brook: 'Region', canyon: 'Region', cave: 'Region', cavern: 'Region',
  cliff: 'Region', clearing: 'Region', creek: 'Region', desert: 'Region', dunes: 'Region',
  falls: 'Region', fen: 'Region', field: 'Region', forest: 'Region', garden: 'Region',
  glade: 'Region', gorge: 'Region', graveyard: 'Region', grove: 'Region', hill: 'Region',
  island: 'Region', jungle: 'Region', lake: 'Region', land: 'Region', meadow: 'Region',
  memorial: 'Region', moor: 'Region', mount: 'Region', mountain: 'Region', ocean: 'Region',
  overlook: 'Region', pass: 'Region', plateau: 'Region', ridge: 'Region', river: 'Region',
  road: 'Region', savanna: 'Region', sea: 'Region', stream: 'Region', swamp: 'Region',
  trail: 'Region', tundra: 'Region', valley: 'Region', vineyard: 'Region', volcano: 'Region',
  windmill: 'Region', woods: 'Region',

  // Treasure, Monster, Encounter, Character, NPC, MagicItem, etc.
  hoard: 'Treasure', stash: 'Treasure', loot: 'Treasure', cache: 'Treasure',
  beast: 'Monster', horror: 'Monster', creature: 'Monster', aberration: 'Monster',
  // trap: 'Hazard', snare: 'Hazard', pitfall: 'Hazard',
  ambush: 'Encounter', skirmish: 'Encounter', conflict: 'Encounter',
  artifact: 'MagicItem', wand: 'MagicItem', relic: 'MagicItem',
  journal: 'Lore', prophecy: 'Lore', legend: 'Lore',
  biography: 'CharacterBio', epitaph: 'CharacterBio',
  barkeep: 'NPC', merchant: 'NPC', mayor: 'NPC', guard: 'NPC',

  // Appendix, Intro, Quest
  appendix: 'Appendix', glossary: 'Glossary', credits: 'Credits',
  prologue: 'Intro', foreword: 'Intro', preface: 'Intro', introduction: 'Intro', start: 'Intro',
  quest: 'Quest', objective: 'Quest', mission: 'Quest', goal: 'Quest',
};



export function classifyBlock(block: Block): ClassifiedContent {
  const headerWords = block.header.toLowerCase().split(/\s+/);
  // const body = block.paragraphs.join(' ').toLowerCase();
  // const fullText = header + ' ' + body;

  for (const word of headerWords) {
    const contentType = headerKeywordMap[word];
    if (contentType) {
      return {
        id: block.id,
        sequence: block.sequence,
        adventureId: block.adventureId,
        header: block.header,
        paragraphs: block.paragraphs,
        contentType,
        explanation: `Header contains keyword: ${word}`,
        confidence: 2,
        source: 'header',
        rulesMatched: [`header-match: ${contentType}`],
      };
    }
  }

  // for (const rule of rules) {
  //   if (rule.test(fullText)) {
  //     return {
  //       id: block.id,
  //       sequence: block.sequence,
  //       adventureId: block.adventureId,
  //       header: block.header,
  //       paragraphs: block.paragraphs,
  //       contentType: rule.type,
  //       explanation: rule.rationale,
  //       confidence: 2,
  //       rulesMatched: [`rules-engine-v1:${rule.type}`],
  //       source: 'header'
  //     };
  //   }
  // }

  return {
    id: block.id,
    sequence: block.sequence,
    adventureId: block.adventureId,
    header: block.header,
    paragraphs: block.paragraphs,
    contentType: 'Unknown',
    explanation: 'No rule matched.',
    confidence: 1,
    source: 'unknown',
    rulesMatched: [],
  };
}

export function classifyBlocks(blocks: Block[]): ClassifiedContent[] {
  return blocks.map(classifyBlock);
}
