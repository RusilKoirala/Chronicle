'use client';

import { useState, useCallback, useMemo } from 'react';
import { useOptimisticUpdate } from './use-optimistic-update';
import { useHybridGoals } from './use-hybrid-goals';
import type { Goal } from '@/types';

/**
 * Enhanced goals hook with optimistic UI updates
 */
export function useOptimisticGoals() {
  const baseHook = useHybridGoals();
  const optimistic = useOptimisticUpdate<Goal>();

  const goals = useMemo(() => {
    const pendingUpdates = optimistic.getPendingUpdates();
    if (pendingUpdates.length === 0) {
      return baseHook.goals;
    }

    let merged = [...baseHook.goals];

    pendingUpdates.forEach(update => {
      switch (update.type) {
        case 'add':
          if (!merged.find(g => g.id === update.data.id)) {
            merged = [update.data, ...merged];
          }
          break;
        case 'update':
          merged = merged.map(g => 
            g.id === update.data.id ? { ...g, ...update.data } : g
          );
          break;
        case 'delete':
          merged = merged.filter(g => g.id !== update.data.id);
          break;
      }
    });

    return merged;
  }, [baseHook.goals, optimistic]);

  const addGoal = useCallback(
    async (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
      const optimisticGoal: Goal = {
        ...goal,
        id: `temp-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return optimistic.addOptimistic(
        optimisticGoal,
        async () => await baseHook.addGoal(goal),
        {
          onError: (error) => console.error('Failed to add goal:', error),
        }
      );
    },
    [baseHook, optimistic]
  );

  const updateGoal = useCallback(
    async (id: string, updates: Partial<Goal>) => {
      const existingGoal = goals.find(g => g.id === id);
      if (!existingGoal) return null;

      const optimisticGoal: Goal = {
        ...existingGoal,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      return optimistic.updateOptimistic(
        optimisticGoal,
        async () => await baseHook.updateGoal(id, updates),
        {
          onError: (error) => console.error('Failed to update goal:', error),
        }
      );
    },
    [baseHook, optimistic, goals]
  );

  const updateProgress = useCallback(
    async (id: string, progress: number) => {
      return updateGoal(id, { progress });
    },
    [updateGoal]
  );

  const deleteGoal = useCallback(
    async (id: string) => {
      const goal = goals.find(g => g.id === id);
      if (!goal) return null;

      return optimistic.deleteOptimistic(
        goal,
        async () => await baseHook.deleteGoal(id),
        {
          onError: (error) => console.error('Failed to delete goal:', error),
        }
      );
    },
    [baseHook, optimistic, goals]
  );

  return {
    goals,
    isLoading: baseHook.isLoading,
    error: 'error' in baseHook ? baseHook.error : null,
    addGoal,
    updateGoal,
    updateProgress,
    deleteGoal,
    getActiveGoals: () => goals.filter(g => g.progress < 100),
    getCompletedGoals: () => goals.filter(g => g.progress >= 100),
    searchGoals: (query: string) => {
      const lowercaseQuery = query.toLowerCase();
      return goals.filter(g =>
        g.title.toLowerCase().includes(lowercaseQuery) ||
        g.description?.toLowerCase().includes(lowercaseQuery)
      );
    },
    refetch: 'refetch' in baseHook ? baseHook.refetch : async () => {},
    isPending: optimistic.isPending,
    hasPendingUpdates: optimistic.hasPendingUpdates,
  };
}
