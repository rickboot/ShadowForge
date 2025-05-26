import { runBlocksPipeline } from './runBlocksPipeline';
import { runSimplePipeline } from './runSimplePipeline';

interface runConversionPipelineProps {
  text: string;
  adventureId?: string;
  blockBasedConversion?: boolean;
}

export async function runConversionPipeline({
  text,
  adventureId,
  blockBasedConversion,
}: runConversionPipelineProps) {
  try {
    if (blockBasedConversion) {
      return await runBlocksPipeline(text, adventureId);
    } else {
      return await runSimplePipeline(text);
    }
  } catch (error) {
    console.error('Conversion pipeline failed:', error);
    return { convertedText: 'Conversion failed due to an internal error.', tokenUsage: 0 };
  }
}
