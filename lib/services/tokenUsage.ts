import { v4 as uuidv4 } from 'uuid';
import { estimateCost } from './tokenCounter';

interface ConversionRecord {
    id: string;
    sessionId: string; // user id 
    timeStamp: Date;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    cost: number;
    model: string;
}

interface UsageStats {
    totalConversions: number;
    totalTokens: number;
    totalCost: number;
    conversions: ConversionRecord[];
}

const conversions: ConversionRecord[] = [];


export function trackConversion(data: {
    sessionId: string;
    inputTokens: number;
    outputTokens: number;
    model: string;
}) {
    const model = data.model || 'gpt-4o-mini';
    const cost = estimateCost(data.inputTokens, data.outputTokens, model);

    const record: ConversionRecord = {
        id: uuidv4(),
        sessionId: data.sessionId,
        timeStamp: new Date(),
        inputTokens: data.inputTokens,
        outputTokens: data.outputTokens,
        totalTokens: data.inputTokens + data.outputTokens,
        cost: cost,
        model: model,
    };

    conversions.push(record);

    return record;
}

export function getUsageStats(sessionId?: string): UsageStats {
    const filtered = sessionId ? conversions.filter(conversion => conversion.sessionId === sessionId) : conversions;

    const totalConversions = filtered.length;
    const totalTokens = filtered.reduce((acc, conversion) => acc + conversion.totalTokens, 0);
    const totalCost = filtered.reduce((acc, conversion) => acc + conversion.cost, 0);

    return {
        totalConversions,
        totalTokens,
        totalCost,
        conversions,
    }

};