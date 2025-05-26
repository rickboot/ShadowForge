import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import 'openai/shims/node';
import { runBlocksPipeline } from '@/lib/conversion/runBlocksPipeline';

describe('runBlocksPipeline', () => {
    const sampleInput = `
1. Maze of Twisty Little Passages
The narrow tunnels twist and turn in an impossible pattern. Walls of rough-hewn stone close in from all sides. Every direction looks exactly the same, and the air carries a faint scent of mildew, wax, and despair.

Any attempt to map this area without magical aid results in confusion. A creature must succeed on a DC 13 Wisdom (Survival) check to track its progress; failure results in becoming lost for 1d4 hours.

`.trim();

    test('should process blocks and return convertedText and tokenUsage', async () => {
        const result = await runBlocksPipeline(sampleInput, 'test-adventure-id');

        expect(result).toHaveProperty('convertedText');
        expect(typeof result.convertedText).toBe('string');
        expect(result.convertedText.length).toBeGreaterThan(0);

        expect(result).toHaveProperty('tokenUsage');
        expect(typeof result.tokenUsage).toBe('number');
        expect(result.tokenUsage).toBeGreaterThan(0);
    });
});