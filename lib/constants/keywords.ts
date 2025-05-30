import { ContentType } from "./conversion";

export const HEADER_KEYWORD_MAP: Record<string, ContentType> = {
    // Room
    altar: 'Room', altars: 'Room', attic: 'Room', balcony: 'Room', ballrooms: 'Room', ballroom: 'Room',
    barracks: 'Room', bath: 'Room', baths: 'Room', bathroom: 'Room', bedchamber: 'Room', bedroom: 'Room',
    chamber: 'Room', chambers: 'Room', closet: 'Room', closets: 'Room', conservatory: 'Room',
    crypt: 'Room', crypts: 'Room', dining: 'Room', door: 'Room', doors: 'Room',
    dumbwaiter: 'Room',
    elevator: 'Room', entrance: 'Room', entryway: 'Room', foyer: 'Room', gallery: 'Room', galleries: 'Room',
    hall: 'Room', halls: 'Room', jail: 'Room', kitchen: 'Room', kitchens: 'Room',
    lair: 'Room', landing: 'Room', larder: 'Room', library: 'Room', libraries: 'Room', lounge: 'Room',
    maze: 'Room', morgue: 'Room', nursery: 'Room', observatory: 'Room', office: 'Room',
    offices: 'Room', pantry: 'Room', pantries: 'Room', parlor: 'Room', passage: 'Room',
    passages: 'Room', pit: 'Room', pits: 'Room', portal: 'Room', portals: 'Room', prison: 'Room', prisons: 'Room',
    quarters: 'Room', restroom: 'Room', room: 'Room', rooms: 'Room', shrine: 'Room', shrines: 'Room',
    spire: 'Room', stables: 'Room', stable: 'Room', stairs: 'Room', stairwell: 'Room',
    stairwells: 'Room', staircase: 'Room', staircases: 'Room', storage: 'Room', storages: 'Room', study: 'Room', suite: 'Room',
    suites: 'Room', theater: 'Room', toilet: 'Room', trap: 'Room', traps: 'Room', trapdoor: 'Room',
    turret: 'Room', vault: 'Room', vaults: 'Room', vestibule: 'Room', well: 'Room',
    wells: 'Room', workshop: 'Room', workshops: 'Room', tomb: 'Room', tombs: 'Room',
    area: 'Room', areas: 'Room', gateway: 'Room', gateways: 'Room', gate: 'Room',
    gates: 'Room', portcullis: 'Room',
    hideout: 'Room', hideouts: 'Room', den: 'Room', dens: 'Room', cellar: 'Room', cellars: 'Room',
    farm: 'Room', farms: 'Room', garrison: 'Room', garrisons: 'Room', entry: 'Room', entries: 'Room',
    temple: 'Room', temples: 'Room', floor: 'Room', floors: 'Room', winery: 'Room', wineries: 'Room',
    pens: 'Room', armory: 'Room', armories: 'Room', crevasse: 'Room', crevasses: 'Room',
    castle: 'Room', castles: 'Room', camp: 'Room', camps: 'Room', post: 'Room', posts: 'Room',
    storeroom: 'Room', storerooms: 'Room', treasury: 'Room', treasuries: 'Room', arena: 'Room', arenas: 'Room',
    cemetery: 'Room', cemeteries: 'Room', reliquary: 'Room',

    // Point of Interest
    statue: 'PointOfInterest', statues: 'PointOfInterest', alcove: 'PointOfInterest',
    alcoves: 'PointOfInterest', plaque: 'PointOfInterest', plaques: 'PointOfInterest',
    inscription: 'PointOfInterest', inscriptions: 'PointOfInterest', fresco: 'PointOfInterest',
    frescoes: 'PointOfInterest', relief: 'PointOfInterest', reliefs: 'PointOfInterest',
    mural: 'PointOfInterest', murals: 'PointOfInterest', pedestal: 'PointOfInterest',
    pedestals: 'PointOfInterest', sigil: 'PointOfInterest', sigils: 'PointOfInterest',
    carving: 'PointOfInterest', carvings: 'PointOfInterest', niche: 'PointOfInterest',
    niches: 'PointOfInterest', symbol: 'PointOfInterest', symbols: 'PointOfInterest',

    // Dungeon
    catacomb: 'Dungeon', catacombs: 'Dungeon', chasm: 'Dungeon', chasms: 'Dungeon',
    dungeon: 'Dungeon', dungeons: 'Dungeon', oubliette: 'Dungeon', oubliettes: 'Dungeon',
    shaft: 'Dungeon', shafts: 'Dungeon',
    stronghold: 'Dungeon', strongholds: 'Dungeon',

    // City
    village: 'City', villages: 'City', town: 'City', towns: 'City', hamlet: 'City',
    hamlets: 'City', city: 'City', cities: 'City', settlement: 'City', settlements: 'City',

    // Site
    apothecary: 'Site', blacksmith: 'Site', brothel: 'Site', casino: 'Site', chapel: 'Site',
    chapels: 'Site', church: 'Site', churches: 'Site', cottage: 'Site', cottages: 'Site',
    forge: 'Site', forges: 'Site', guild: 'Site', hospital: 'Site', house: 'Site', houses: 'Site',
    inn: 'Site', inns: 'Site', manor: 'Site', manors: 'Site', mansion: 'Site',
    mansions: 'Site', market: 'Site', markets: 'Site', mill: 'Site', mills: 'Site',
    monastery: 'Site', monasteries: 'Site', orphanage: 'Site', ruins: 'Site', shop: 'Site',
    shops: 'Site', shoppe: 'Site', smithy: 'Site', square: 'Site', squares: 'Site',
    store: 'Site', stores: 'Site', tavern: 'Site', taverns: 'Site', tenement: 'Site',
    tenements: 'Site', townhouse: 'Site', townhouses: 'Site', tower: 'Site', towers: 'Site',
    wall: 'Site', walls: 'Site', watchtower: 'Site', watchtowers: 'Site', zoo: 'Site',
    hostel: 'Site', hostels: 'Site', hovel: 'Site', hovels: 'Site',

    // Region
    badlands: 'Region', beacon: 'Region', beacons: 'Region', bog: 'Region', brambles: 'Region',
    bridge: 'Region', bridges: 'Region', brook: 'Region', brooks: 'Region', canyon: 'Region',
    canyons: 'Region', cave: 'Region', caves: 'Region', cavern: 'Region', caverns: 'Region',
    cliff: 'Region', cliffs: 'Region', clearing: 'Region', creek: 'Region', creeks: 'Region',
    desert: 'Region', deserts: 'Region', dunes: 'Region', falls: 'Region', fen: 'Region',
    fens: 'Region', field: 'Region', fields: 'Region', forest: 'Region', forests: 'Region',
    garden: 'Region', gardens: 'Region', glade: 'Region', glades: 'Region', gorge: 'Region',
    gorges: 'Region', graveyard: 'Region', graveyards: 'Region', grove: 'Region',
    groves: 'Region', hill: 'Region', hills: 'Region', island: 'Region', islands: 'Region',
    jungle: 'Region', jungles: 'Region', lake: 'Region', lakes: 'Region', land: 'Region', mists: 'Region',
    lands: 'Region', meadow: 'Region', meadows: 'Region', memorial: 'Region', memorials: 'Region',
    moor: 'Region', moors: 'Region', mount: 'Region', mountain: 'Region', mountains: 'Region',
    ocean: 'Region', oceans: 'Region', overlook: 'Region', overlooks: 'Region', pass: 'Region',
    passes: 'Region', plateau: 'Region', plateaus: 'Region', ridge: 'Region', ridges: 'Region',
    river: 'Region', rivers: 'Region', road: 'Region', roads: 'Region', savanna: 'Region',
    sea: 'Region', seas: 'Region', stream: 'Region', streams: 'Region', swamp: 'Region',
    swamps: 'Region', trail: 'Region', trails: 'Region', tundra: 'Region', valley: 'Region',
    valleys: 'Region', vineyard: 'Region', vineyards: 'Region', volcano: 'Region',
    volcanoes: 'Region', windmill: 'Region', woods: 'Region',

    // Treasure, Monster, Encounter, Character, NPC, MagicItem, etc.
    chest: 'Treasure', chests: 'Treasure', hoard: 'Treasure', hoards: 'Treasure', stash: 'Treasure', stashes: 'Treasure',
    loot: 'Treasure', loots: 'Treasure', cache: 'Treasure', caches: 'Treasure',
    treasure: 'Treasure', treasures: 'Treasure', coffer: 'Treasure', coffers: 'Treasure',
    footlocker: 'Treasure', footlockers: 'Treasure',

    beast: 'Monster', beasts: 'Monster', horror: 'Monster', horrors: 'Monster',
    creature: 'Monster', creatures: 'Monster', aberration: 'Monster', aberrations: 'Monster',

    ambush: 'Encounter', ambushes: 'Encounter', skirmish: 'Encounter', skirmishes: 'Encounter',
    conflict: 'Encounter', conflicts: 'Encounter',

    artifact: 'MagicItem', artifacts: 'MagicItem', wand: 'MagicItem', wands: 'MagicItem',
    relic: 'MagicItem', relics: 'MagicItem',

    journal: 'Lore', journals: 'Lore', prophecy: 'Lore', prophecies: 'Lore', legend: 'Lore',
    legends: 'Lore',

    biography: 'CharacterBio', epitaph: 'CharacterBio',

    barkeep: 'NPC', merchant: 'NPC', mayor: 'NPC', guard: 'NPC',

    // Misc: Adventure, Encounter, Appendix, Intro, Quest and more
    adventure: 'Adventure',
    advancement: 'GMGuidance',
    encounter: 'Encounter', encounters: 'Encounter',
    appendix: 'Appendix', glossary: 'Appendix', credits: 'Appendix',
    history: 'Lore',
    prologue: 'Intro', foreword: 'Intro', preface: 'Intro', introduction: 'Intro',
    start: 'Intro',
    quest: 'Quest', quests: 'Quest', objective: 'Quest', mission: 'Quest', goal: 'Quest',
};
