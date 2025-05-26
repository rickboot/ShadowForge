import { convertToBlocks } from './convertToBlocks';
import { classifyWithKeywords } from './classifyWithKeywords';
import { classifyWithLLM } from './classifyWithLLM';
import { DEFAULT_ADVENTURE_ID } from '@/lib/constants/app';
import { convertToShadowdark } from './convertToShadowdark';
import { logTokenUsage } from '../utils/tokenUtils';

export async function runBlockBasedPipeline(
    text: string,
    adventureId?: string,
) {

    const blocksRaw = convertToBlocks(adventureId ?? DEFAULT_ADVENTURE_ID, text);
    const keywordClassified = classifyWithKeywords(blocksRaw);
    const unknownBlocks = keywordClassified.filter((block) => block.contentType === 'Unknown');
    const llmClassified = await classifyWithLLM(unknownBlocks);

    const allClassified = [
        ...keywordClassified.filter((block) => block.contentType !== 'Unknown'),
        ...llmClassified,
    ];

    const CONTENT_TYPES_TO_CONVERT = [
        'Room', 'Encounter', 'Dungeon', 'Site', 'PointOfInterest',
        'Treasure', 'Monster', 'Character', 'NPC',
    ];

    const blocksToConvert = allClassified.filter((block) =>
        CONTENT_TYPES_TO_CONVERT.includes(block.contentType)
    );

    const convertedChunks: string[] = [];
    let tokenUsage = 0;

    for (const block of blocksToConvert) {
        try {
            const inputText = block.header + '\n\n' + block.paragraphs.join('\n');
            const convertedText = await convertToShadowdark(inputText);
            convertedChunks.push(convertedText);

            tokenUsage += logTokenUsage(`Input chunk ${block.sequence}:`, inputText);
            tokenUsage += logTokenUsage(`Converted chunk ${block.sequence}:`, convertedText);
        } catch (blockErr) {
            console.warn(`Failed to convert block ${block.sequence}:`, blockErr);
            convertedChunks.push(`<!-- Conversion failed for block ${block.sequence} -->`);
        }
    }

    const convertedText = convertedChunks.join('\n\n');

    if (process.env.NODE_ENV !== 'production') {
        console.log('\n\n########## Classified Blocks - Block-based Classification ##########\n\n');
        console.log(allClassified.sort((a, b) => a.sequence - b.sequence));
    }

    if (convertedText.trim() === '') {
        return { convertedText: 'Conversion failed.', tokenUsage };
    }

    return { convertedText, tokenUsage };

}
