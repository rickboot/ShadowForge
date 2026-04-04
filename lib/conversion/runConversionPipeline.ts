import { runPipeline } from './runPipeline';

interface RunConversionPipelineProps {
  text: string;
  adventureId?: string;
}

export async function runConversionPipeline({ text, adventureId }: RunConversionPipelineProps) {
  try {
    return await runPipeline(text, adventureId);
  } catch (error) {
    console.error('[runConversionPipeline] Failed:', error);
    return { convertedText: 'Conversion failed due to an internal error.' };
  }
}
