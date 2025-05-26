import { convertToShadowdark } from './convertToShadowdark';
import { logTokenUsage } from '../utils/tokenUtils';
import { chunkText } from './chunkText';
import { getLLMConfig } from '../llm/llmConfig';

export async function runSimplePipeline(
    text: string,
    blockBasedConversion?: boolean,
) {
    if (!blockBasedConversion) {
        const maxTokens = getLLMConfig().contextWindow;
        const chunks = chunkText(text, maxTokens);

        const convertedChunks: string[] = [];
        let tokenUsage = 0;

        for (const [i, chunk] of chunks.entries()) {
            const converted = await convertToShadowdark(chunk);
            convertedChunks.push(converted);
            tokenUsage += logTokenUsage(`Input chunk ${i + 1}:`, chunk);
        }

        const convertedText = convertedChunks.join('\n\n');
        logTokenUsage('Converted output:', convertedText);

        if (process.env.NODE_ENV !== 'production') {
            console.log('\n\n########## Converted Text - Original Text Chunk Conversion ##########\n\n');
            console.log(convertedText);
        }

        return { convertedText, tokenUsage };
    }
}