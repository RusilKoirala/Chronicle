'use client';

import { useState, useCallback, useRef } from 'react';

export interface OptimisticUpdate<T> {
  id: string;
  type: 'add' | 'update' | 'delete';
  data: T;
  timestamp: number;
}

export interface OptimisticUpdateOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error, rollbackData?: T) => void;
  timeout?: number;
}

/**
 * Hook for managing optimistic UI updates with automatic rollback on failure
 * Provides immediate visual feedback while operations complete in the background
 */
export function useOptimisticUpdate<T extends { id: string }>() {
  const [pendingUpdates, setPendingUpdates] = useState<Map<string, OptimisticUpdate<T>>>(new Map());
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  /**
   * Execute an operation with optimistic update
   * Updates UI immediately, then rolls back if operation fails
   */
  const executeOptimistic = useCallback(
    async <R = T>(
      optimisticData: T,
      operation: () => Promise<R>,
      options: OptimisticUpdateOptions<T> = {}
    ): Promise<R | null> => {
      const updateId = `${optimisticData.id}-${Date.now()}`;
      const { onSuccess, onError, timeout = 10000 } = options;

      // Store the optimistic update
      const update: OptimisticUpdate<T> = {
        id: updateId,
        type: 'update',
        data: optimisticData,
        timestamp: Date.now(),
      };

      setPendingUpdates(prev => new Map(prev).set(updateId, update));

      // Set timeout for automatic rollback
      const timeoutId = setTimeout(() => {
        setPendingUpdates(prev => {
          const next = new Map(prev);
          next.delete(updateId);
          return next;
        });
        onError?.(new Error('Operation timeout'), optimisticData);
      }, timeout);

      timeoutRefs.current.set(updateId, timeoutId);

      try {
        // Execute the actual operation
        const result = await operation();

        // Clear timeout and remove pending update on success
        const timeoutId = timeoutRefs.current.get(updateId);
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutRefs.current.delete(updateId);
        }

        setPendingUpdates(prev => {
          const next = new Map(prev);
          next.delete(updateId);
          return next;
        });

        onSuccess?.(optimisticData);
        return result;
      } catch (error) {
        // Rollback on error
        const timeoutId = timeoutRefs.current.get(updateId);
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutRefs.current.delete(updateId);
        }

        setPendingUpdates(prev => {
          const next = new Map(prev);
          next.delete(updateId);
          return next;
        });

        onError?.(error as Error, optimisticData);
        return null;
      }
    },
    []
  );

  /**
   * Add an item optimistically
   */
  const addOptimistic = useCallback(
    async <R = T>(
      item: T,
      operation: () => Promise<R>,
      options: OptimisticUpdateOptions<T> = {}
    ): Promise<R | null> => {
      return executeOptimistic(item, operation, options);
    },
    [executeOptimistic]
  );

  /**
   * Update an item optimistically
   */
  const updateOptimistic = useCallback(
    async <R = T>(
      item: T,
      operation: () => Promise<R>,
      options: OptimisticUpdateOptions<T> = {}
    ): Promise<R | null> => {
      return executeOptimistic(item, operation, options);
    },
    [executeOptimistic]
  );

  /**
   * Delete an item optimistically
   */
  const deleteOptimistic = useCallback(
    async <R = void>(
      item: T,
      operation: () => Promise<R>,
      options: OptimisticUpdateOptions<T> = {}
    ): Promise<R | null> => {
      return executeOptimistic(item, operation, options);
    },
    [executeOptimistic]
  );

  /**
   * Check if an item has pending updates
   */
  const isPending = useCallback(
    (itemId: string): boolean => {
      return Array.from(pendingUpdates.values()).some(
        update => update.data.id === itemId
      );
    },
    [pendingUpdates]
  );

  /**
   * Get all pending updates
   */
  const getPendingUpdates = useCallback((): OptimisticUpdate<T>[] => {
    return Array.from(pendingUpdates.values());
  }, [pendingUpdates]);

  /**
   * Clear all pending updates (useful for cleanup)
   */
  const clearPending = useCallback(() => {
    // Clear all timeouts
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current.clear();
    setPendingUpdates(new Map());
  }, []);

  return {
    addOptimistic,
    updateOptimistic,
    deleteOptimistic,
    isPending,
    getPendingUpdates,
    clearPending,
    hasPendingUpdates: pendingUpdates.size > 0,
  };
}
