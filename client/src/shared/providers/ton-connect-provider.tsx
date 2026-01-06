'use client'

import { TonConnectUIProvider } from '@tonconnect/ui-react';

const manifestUrl = typeof window !== 'undefined' 
  ? `${window.location.origin}/tonconnect-manifest.json`
  : '/tonconnect-manifest.json';

export function TonConnectProvider({ children }: { children: React.ReactNode }) {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  );
}

