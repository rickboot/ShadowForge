import { chunkTextToBlocks } from '../lib/conversion/convertToBlocks';

describe('chunkTextToBlocks', () => {
  test('should detect common headers and paragraphs from a D&D adventure module', () => {
    const input = `THE FORGOTTEN TOMB\n\nLong ago, before the empire fell, this tomb was built for a high priest who betrayed his god. Locals say a curse lingers beneath its sealed stone.\n\nAdventure Start\n\nThe players arrive at dusk. A path leads to a broken stone archway, overgrown with moss and clawed branches. A crow watches from above. Wind stirs the grass, and something unseen moves just out of sight.\n\nThey feel the mists closing behind them.\n\nAREA 1: THE ENTRYWAY\n\nThis narrow passageway is choked with cobwebs and the scent of damp stone. The torchlight flickers off crumbling frescoes — warriors offering tribute to a horned figure.\n\nAny character inspecting the frescoes may notice eyes that seem to follow them. This has no mechanical effect, but adds tension.\n\n1. THE GUARDIAN ROOM\n\nThis circular chamber contains a single statue: a jackal-headed guardian with a shattered halberd. Dried blood stains the floor. The door behind the statue is locked and marked with a warning in a forgotten tongue.\n\nIf a player steps within 10 feet of the statue, it animates and attacks.\n\nTreasure: Inside the broken base of the statue is a small obsidian cube. It pulses faintly with heat. It is a key.\n\nAREA 2 – THE PIT\n\nThe floor has collapsed into a jagged pit. Ropes once stretched across, but have long since rotted. Bones litter the far edge.\n\nA player may attempt a DC 12 Dexterity (Acrobatics) check to leap across. Falling deals 2d6 bludgeoning damage.\n\nTHE FINAL DOOR\n\nA heavy stone door bars the way. Etched on its surface is the phrase: “ONLY THE UNSEEN MAY PASS.”\n\nIf a player wears the cube from the statue around their neck and closes their eyes, the door silently opens.\n\n2B. THE TOMB OF SHADOWS\n\nA single black sarcophagus rests in the center. The room is unnaturally cold. Frost crystals climb the walls. Whispers fill the air, but no source is seen.\n\nIf the players open the sarcophagus, read:\n\n> The air freezes. Darkness erupts from within. A pale figure rises, eyes burning with eternal malice.\n\nCombat begins.`;

    const blocks = chunkTextToBlocks('test-adventure', input);

    // Check that headers are detected and paragraphs are grouped correctly
    const headers = blocks.map((b) => b.header);
    expect(headers).toEqual([
      'THE FORGOTTEN TOMB',
      'Adventure Start',
      'AREA 1: THE ENTRYWAY',
      '1. THE GUARDIAN ROOM',
      'AREA 2 – THE PIT',
      'THE FINAL DOOR',
      '2B. THE TOMB OF SHADOWS',
    ]);

    // Check that paragraphs are non-empty and correspond to the right headers
    expect(blocks[0].paragraphs.join(' ')).toContain(
      'Long ago, before the empire fell',
    );
    expect(blocks[1].paragraphs.join(' ')).toContain(
      'The players arrive at dusk',
    );
    expect(blocks[2].paragraphs.join(' ')).toContain(
      'This narrow passageway is choked',
    );
    expect(blocks[3].paragraphs.join(' ')).toContain(
      'This circular chamber contains a single statue',
    );
    expect(blocks[4].paragraphs.join(' ')).toContain(
      'The floor has collapsed into a jagged pit',
    );
    expect(blocks[5].paragraphs.join(' ')).toContain(
      'A heavy stone door bars the way',
    );
    expect(blocks[6].paragraphs.join(' ')).toContain(
      'A single black sarcophagus rests in the center',
    );
  });

  test('should detect headers and paragraphs when paragraphs are separated by single newlines', () => {
    const input = `THE FORGOTTEN TOMB\nLong ago, before the empire fell, this tomb was built for a high priest who betrayed his god. Locals say a curse lingers beneath its sealed stone.\nAdventure Start\nThe players arrive at dusk. A path leads to a broken stone archway, overgrown with moss and clawed branches. A crow watches from above. Wind stirs the grass, and something unseen moves just out of sight.\nThey feel the mists closing behind them.\nAREA 1: THE ENTRYWAY\nThis narrow passageway is choked with cobwebs and the scent of damp stone. The torchlight flickers off crumbling frescoes — warriors offering tribute to a horned figure.\nAny character inspecting the frescoes may notice eyes that seem to follow them. This has no mechanical effect, but adds tension.\n1. THE GUARDIAN ROOM\nThis circular chamber contains a single statue: a jackal-headed guardian with a shattered halberd. Dried blood stains the floor. The door behind the statue is locked and marked with a warning in a forgotten tongue.\nIf a player steps within 10 feet of the statue, it animates and attacks.\nTreasure: Inside the broken base of the statue is a small obsidian cube. It pulses faintly with heat. It is a key.\nAREA 2 – THE PIT\nThe floor has collapsed into a jagged pit. Ropes once stretched across, but have long since rotted. Bones litter the far edge.\nA player may attempt a DC 12 Dexterity (Acrobatics) check to leap across. Falling deals 2d6 bludgeoning damage.\nTHE FINAL DOOR\nA heavy stone door bars the way. Etched on its surface is the phrase: “ONLY THE UNSEEN MAY PASS.”\nIf a player wears the cube from the statue around their neck and closes their eyes, the door silently opens.\n2B. THE TOMB OF SHADOWS\nA single black sarcophagus rests in the center. The room is unnaturally cold. Frost crystals climb the walls. Whispers fill the air, but no source is seen.\nIf the players open the sarcophagus, read:\n> The air freezes. Darkness erupts from within. A pale figure rises, eyes burning with eternal malice.\nCombat begins.`;

    const blocks = chunkTextToBlocks('test-adventure', input);
    const headers = blocks.map((b) => b.header);

    expect(headers).toEqual([
      'THE FORGOTTEN TOMB',
      'Adventure Start',
      'AREA 1: THE ENTRYWAY',
      '1. THE GUARDIAN ROOM',
      'AREA 2 – THE PIT',
      'THE FINAL DOOR',
      '2B. THE TOMB OF SHADOWS',
    ]);
    expect(blocks[0].paragraphs.join(' ')).toContain(
      'Long ago, before the empire fell',
    );
    expect(blocks[1].paragraphs.join(' ')).toContain(
      'The players arrive at dusk',
    );
    expect(blocks[2].paragraphs.join(' ')).toContain(
      'This narrow passageway is choked',
    );
    expect(blocks[3].paragraphs.join(' ')).toContain(
      'This circular chamber contains a single statue',
    );
    expect(blocks[4].paragraphs.join(' ')).toContain(
      'The floor has collapsed into a jagged pit',
    );
    expect(blocks[5].paragraphs.join(' ')).toContain(
      'A heavy stone door bars the way',
    );
    expect(blocks[6].paragraphs.join(' ')).toContain(
      'A single black sarcophagus rests in the center',
    );
  });

  test('should detect dramatic and short title-case headers', () => {
    const input = `"One Must Die!"\nThis is a dramatic boxed text.\nEndings\nThe adventure concludes.\nThe Cult Is Appeased\nThe cult achieves its goal.\nThe Cult Is Denied\nThe cult fails.`;
    const blocks = chunkTextToBlocks('test-adventure', input);
    const headers = blocks.map((b) => b.header);

    expect(headers).toEqual([
      '"One Must Die!"',
      'Endings',
      'The Cult Is Appeased',
      'The Cult Is Denied',
    ]);
    expect(blocks[0].paragraphs.join(' ')).toContain('dramatic boxed text');
    expect(blocks[1].paragraphs.join(' ')).toContain('adventure concludes');
    expect(blocks[2].paragraphs.join(' ')).toContain('achieves its goal');
    expect(blocks[3].paragraphs.join(' ')).toContain('fails');
  });

  test('should output blocks with headers and empty paragraphs when input is only headers', () => {
    const input = `Header One\nHeader Two\nThis is the paragraph.\nHeader Three`;
    const blocks = chunkTextToBlocks('test-adventure', input);

    console.log('%%%%%%%blocks', blocks);
    expect(blocks.length).toBe(3);
    expect(blocks.map(b => b.header)).toEqual([
      'Header One',
      'Header Two',
      'Header Three',
    ]);
  });

  test('should output blocks with paragraphs and empty headers when input is only paragraphs', () => {
    const input = `This is the first paragraph.\nThis is the second paragraph.\nThis is the third paragraph.`;
    const blocks = chunkTextToBlocks('test-adventure', input);
    expect(blocks.length).toBe(1);
    expect(blocks[0].header).toBe('');
    expect(blocks[0].paragraphs).toEqual([
      'This is the first paragraph.',
      'This is the second paragraph.',
      'This is the third paragraph.'
    ]);
  });
});
