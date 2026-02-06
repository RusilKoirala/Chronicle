'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useOfflineSync } from '@/hooks/use-offline-sync';

interface OfflineContextValue {
  isOnline: boolean;
  isSyncing: boolean;
  queuedCount: number;
  syncError: string | null;
  queueOperation: (
    type: 'add' | 'update' | 'delete',
    entity: 'task' | 'goal' | 'achievement' | 'resource' | 'routine',
    data: any
  ) => string;
  syncQueue: () => void;
  clearQueue: () => void;
  hasQueuedOperations: boolean;
}

const OfflineContext = createContext<OfflineContextValue | undefined>(undefined);

export function OfflineProvider({ children }: { children: ReactNode }) {
  const offlineSync = useOfflineSync();

  return (
    <OfflineContext.Provider value={offlineSync}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
}
