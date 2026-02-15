import { encodingForModel, Tiktoken } from 'js-tiktoken';

// cached encoder instance
let cachedEncoder: Tiktoken | null = null;

// get encoder instance, creating it if necessary
function getEncoder(): Tiktoken {
    if (!cachedEncoder) {
        //todo: encoder from config
        cachedEncoder = encodingForModel('gpt-4o');
    }
    return cachedEncoder;
}

export function countTokensInString(str: string): number {
    if (!str) return 0;

    const encoder = getEncoder();
    const tokens = encoder.encode(str);
    return tokens.length;
}

export function countTokensInStringArray(strArray: string[]): number {
    return strArray.reduce((acc, str) => acc + countTokensInString(str), 0);
}

export function estimateCost(
    inputTokens: number,
    outputTokens: number,
    model: string = 'gpt-4o-mini'
): number {
    //todo: get price from config
    const pricing: Record<string, { input: number; output: number }> = {
        'gpt-4o-mini': { input: 0.15 / 1_000_000, output: 0.6 / 1_000_000 },
    };

    const pricingModel = pricing[model] || pricing['gpt-4o-mini'];

    return pricingModel.input * inputTokens + pricingModel.output * outputTokens;
}


