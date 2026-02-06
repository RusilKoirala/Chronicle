'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface OfflineOperation {
  id: string;
  type: 'add' | 'update' | 'delete';
  entity: 'task' | 'goal' | 'achievement' | 'resource' | 'routine';
  data: any;
  timestamp: number;
  retryCount: number;
}

const OFFLINE_QUEUE_KEY = 'chronicle_offline_queue';
const MAX_RETRY_COUNT = 3;

/**
 * Hook for managing offline functionality and automatic sync
 * Queues operations when offline and syncs when connection is restored
 */
export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [queuedOperations, setQueuedOperations] = useState<OfflineOperation[]>([]);
  const [syncError, setSyncError] = useState<string | null>(null);
  const syncInProgress = useRef(false);

  // Load queued operations from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(OFFLINE_QUEUE_KEY);
    if (stored) {
      try {
        const operations = JSON.parse(stored);
        setQueuedOperations(operations);
      } catch (error) {
        console.error('Failed to load offline queue:', error);
      }
    }
  }, []);

  // Save queued operations to localStorage whenever they change
  useEffect(() => {
    if (queuedOperations.length > 0) {
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queuedOperations));
    } else {
      localStorage.removeItem(OFFLINE_QUEUE_KEY);
    }
  }, [queuedOperations]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncError(null);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    // Set initial state
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && queuedOperations.length > 0 && !syncInProgress.current) {
      syncQueue();
    }
  }, [isOnline, queuedOperations.length]);

  /**
   * Add an operation to the offline queue
   */
  const queueOperation = useCallback((
    type: OfflineOperation['type'],
    entity: OfflineOperation['entity'],
    data: any
  ) => {
    const operation: OfflineOperation = {
      id: `${entity}-${type}-${Date.now()}`,
      type,
      entity,
      data,
      timestamp: Date.now(),
      retryCount: 0,
    };

    setQueuedOperations(prev => [...prev, operation]);
    return operation.id;
  }, []);

  /**
   * Execute a single operation
   */
  const executeOperation = async (operation: OfflineOperation): Promise<boolean> => {
    // This is a placeholder - actual implementation would call the appropriate API
    // In a real implementation, this would dispatch to the correct service based on entity type
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
      return true;
    } catch (error) {
      console.error('Failed to execute operation:', error);
      return false;
    }
  };

  /**
   * Sync all queued operations
   */
  const syncQueue = useCallback(async () => {
    if (syncInProgress.current || !isOnline || queuedOperations.length === 0) {
      return;
    }

    syncInProgress.current = true;
    setIsSyncing(true);
    setSyncError(null);

    const failedOperations: OfflineOperation[] = [];
    const successfulIds: string[] = [];

    for (const operation of queuedOperations) {
      const success = await executeOperation(operation);

      if (success) {
        successfulIds.push(operation.id);
      } else {
        // Increment retry count
        const updatedOperation = {
          ...operation,
          retryCount: operation.retryCount + 1,
        };

        // Only keep if under max retry count
        if (updatedOperation.retryCount < MAX_RETRY_COUNT) {
          failedOperations.push(updatedOperation);
        } else {
          console.error('Max retries reached for operation:', operation);
        }
      }
    }

    // Update queue with only failed operations
    setQueuedOperations(failedOperations);

    if (failedOperations.length > 0) {
      setSyncError(`Failed to sync ${failedOperations.length} operation(s)`);
    }

    setIsSyncing(false);
    syncInProgress.current = false;
  }, [isOnline, queuedOperations]);

  /**
   * Manually trigger sync
   */
  const manualSync = useCallback(() => {
    if (isOnline) {
      syncQueue();
    }
  }, [isOnline, syncQueue]);

  /**
   * Clear all queued operations
   */
  const clearQueue = useCallback(() => {
    setQueuedOperations([]);
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
    setSyncError(null);
  }, []);

  /**
   * Remove a specific operation from the queue
   */
  const removeOperation = useCallback((operationId: string) => {
    setQueuedOperations(prev => prev.filter(op => op.id !== operationId));
  }, []);

  return {
    isOnline,
    isSyncing,
    queuedOperations,
    queuedCount: queuedOperations.length,
    syncError,
    queueOperation,
    syncQueue: manualSync,
    clearQueue,
    removeOperation,
    hasQueuedOperations: queuedOperations.length > 0,
  };
}
