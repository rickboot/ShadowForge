'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Telemetry } from '@/lib/types/llm';

interface TelemetryContextValue {
  telemetry: Telemetry | null;
  setTelemetry: (t: Telemetry) => void;
}

const TelemetryContext = createContext<TelemetryContextValue | null>(null);

export function TelemetryProvider({ children }: { children: ReactNode }) {
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  return (
    <TelemetryContext.Provider value={{ telemetry, setTelemetry }}>
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry(): TelemetryContextValue {
  const ctx = useContext(TelemetryContext);
  if (!ctx) throw new Error('useTelemetry must be used within TelemetryProvider');
  return ctx;
}
