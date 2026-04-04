'use client';

import { X, BarChart2 } from 'lucide-react';
import { Telemetry } from '@/lib/types/llm';

interface TelemetryPanelProps {
  telemetry: Telemetry;
  onClose: () => void;
}

export default function TelemetryPanel({ telemetry, onClose }: TelemetryPanelProps) {
  const totalTokens = telemetry.inputTokens + telemetry.outputTokens;

  return (
    <div
      className="absolute bottom-full right-4 mb-2 w-72 rounded-lg border p-5 shadow-xl"
      style={{
        backgroundColor: 'var(--background)',
        borderColor: 'var(--surface-contrast)',
        color: 'var(--foreground)',
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <BarChart2 size={15} />
          Last Conversion
        </h3>
        <button onClick={onClose} className="opacity-60 hover:opacity-100">
          <X size={15} />
        </button>
      </div>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="opacity-60">Model{telemetry.models.length > 1 ? 's' : ''}</dt>
          <dd className="text-right font-mono text-xs">
            {telemetry.models.length > 0 ? telemetry.models.join(', ') : '—'}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="opacity-60">Input tokens</dt>
          <dd className="font-mono">{telemetry.inputTokens.toLocaleString()}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="opacity-60">Output tokens</dt>
          <dd className="font-mono">{telemetry.outputTokens.toLocaleString()}</dd>
        </div>
        <div
          className="flex justify-between border-t pt-2"
          style={{ borderColor: 'var(--surface-contrast)' }}
        >
          <dt className="opacity-60">Total tokens</dt>
          <dd className="font-mono font-semibold">{totalTokens.toLocaleString()}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="opacity-60">Est. cost</dt>
          <dd className="font-mono">
            {telemetry.cost === null
              ? '—'
              : telemetry.cost < 0.01
              ? '< $0.01'
              : `$${telemetry.cost.toFixed(4)}`}
          </dd>
        </div>
      </dl>
    </div>
  );
}
