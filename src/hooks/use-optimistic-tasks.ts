'use client';

import { useState, useCallback, useMemo } from 'react';
import { useOptimisticUpdate } from './use-optimistic-update';
import { useHybridTasks } from './use-hybrid-tasks';
import type { Task } from '@/types';

/**
 * Enhanced tasks hook with optimistic UI updates
 * Provides immediate visual feedback for all task operations
 */
export function useOptimisticTasks() {
  const baseHook = useHybridTasks();
  const optimistic = useOptimisticUpdate<Task>();
  const [optimisticTasks, setOptimisticTasks] = useState<Task[]>([]);

  // Merge real tasks with optimistic updates
  const tasks = useMemo(() => {
    const pendingUpdates = optimistic.getPendingUpdates();
    if (pendingUpdates.length === 0) {
      return baseHook.tasks;
    }

    let merged = [...baseHook.tasks];

    pendingUpdates.forEach(update => {
      switch (update.type) {
        case 'add':
          // Add optimistic task if not already in real tasks
          if (!merged.find(t => t.id === update.data.id)) {
            merged = [update.data, ...merged];
          }
          break;
        case 'update':
          // Update task with optimistic data
          merged = merged.map(t => 
            t.id === update.data.id ? { ...t, ...update.data } : t
          );
          break;
        case 'delete':
          // Remove task optimistically
          merged = merged.filter(t => t.id !== update.data.id);
          break;
      }
    });

    return merged;
  }, [baseHook.tasks, optimistic]);

  /**
   * Add task with optimistic update
   */
  const addTask = useCallback(
    async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      // Create optimistic task with temporary ID
      const optimisticTask: Task = {
        ...task,
        id: `temp-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return optimistic.addOptimistic(
        optimisticTask,
        async () => {
          const result = await baseHook.addTask(task);
          return result;
        },
        {
          onError: (error) => {
            console.error('Failed to add task:', error);
          },
        }
      );
    },
    [baseHook, optimistic]
  );

  /**
   * Update task with optimistic update
   */
  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>) => {
      const existingTask = tasks.find(t => t.id === id);
      if (!existingTask) return null;

      const optimisticTask: Task = {
        ...existingTask,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      return optimistic.updateOptimistic(
        optimisticTask,
        async () => {
          const result = await baseHook.updateTask(id, updates);
          return result;
        },
        {
          onError: (error, rollbackData) => {
            console.error('Failed to update task:', error);
          },
        }
      );
    },
    [baseHook, optimistic, tasks]
  );

  /**
   * Toggle task completion with optimistic update
   */
  const toggleTask = useCallback(
    async (id: string) => {
      const task = tasks.find(t => t.id === id);
      if (!task) return null;

      return updateTask(id, { completed: !task.completed });
    },
    [tasks, updateTask]
  );

  /**
   * Delete task with optimistic update
   */
  const deleteTask = useCallback(
    async (id: string) => {
      const task = tasks.find(t => t.id === id);
      if (!task) return null;

      return optimistic.deleteOptimistic(
        task,
        async () => {
          await baseHook.deleteTask(id);
        },
        {
          onError: (error) => {
            console.error('Failed to delete task:', error);
          },
        }
      );
    },
    [baseHook, optimistic, tasks]
  );

  return {
    tasks,
    isLoading: baseHook.isLoading,
    error: 'error' in baseHook ? baseHook.error : null,
    addTask,
    updateTask,
    toggleTask,
    toggleComplete: toggleTask,
    deleteTask,
    getActiveTasks: () => tasks.filter(t => !t.completed),
    getCompletedTasks: () => tasks.filter(t => t.completed),
    getRoutineTasks: () => tasks.filter(t => t.isRoutine),
    searchTasks: (query: string) => {
      const lowercaseQuery = query.toLowerCase();
      return tasks.filter(t =>
        t.title.toLowerCase().includes(lowercaseQuery) ||
        t.description?.toLowerCase().includes(lowercaseQuery)
      );
    },
    getTasksDueToday: () => {
      const today = new Date().toISOString().split('T')[0];
      return tasks.filter(t => 
        t.dueDate && t.dueDate.startsWith(today) && !t.completed
      );
    },
    getOverdueTasks: () => {
      const today = new Date().toISOString().split('T')[0];
      return tasks.filter(t => 
        t.dueDate && t.dueDate < today && !t.completed
      );
    },
    refetch: 'refetch' in baseHook ? baseHook.refetch : async () => {},
    isPending: optimistic.isPending,
    hasPendingUpdates: optimistic.hasPendingUpdates,
  };
}
