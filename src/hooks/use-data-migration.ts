'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useSupabaseAchievements } from './use-supabase-achievements';
import { useSupabaseResources } from './use-supabase-resources';
import { useSupabaseGoals } from './use-supabase-goals';
import { useSupabaseTasks } from './use-supabase-tasks';
import { useSupabaseRoutines } from './use-supabase-routines';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import type { Achievement, Resource, Goal, Task, Routine } from '@/types';

interface MigrationStatus {
  achievements: { total: number; migrated: number; errors: string[] };
  resources: { total: number; migrated: number; errors: string[] };
  goals: { total: number; migrated: number; errors: string[] };
  tasks: { total: number; migrated: number; errors: string[] };
  routines: { total: number; migrated: number; errors: string[] };
}

export function useDataMigration() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<MigrationStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { addAchievement } = useSupabaseAchievements();
  const { addResource } = useSupabaseResources();
  const { addGoal } = useSupabaseGoals();
  const { addTask } = useSupabaseTasks();
  const { addRoutine } = useSupabaseRoutines();

  const migrateData = async () => {
    if (!user) {
      setError('User must be authenticated to migrate data');
      return;
    }

    setIsLoading(true);
    setError(null);

    const migrationStatus: MigrationStatus = {
      achievements: { total: 0, migrated: 0, errors: [] },
      resources: { total: 0, migrated: 0, errors: [] },
      goals: { total: 0, migrated: 0, errors: [] },
      tasks: { total: 0, migrated: 0, errors: [] },
      routines: { total: 0, migrated: 0, errors: [] },
    };

    try {
      // Get localStorage data
      const localAchievements = storage.get<Achievement>(STORAGE_KEYS.ACHIEVEMENTS);
      const localResources = storage.get<Resource>(STORAGE_KEYS.RESOURCES);
      const localGoals = storage.get<Goal>(STORAGE_KEYS.GOALS);
      const localTasks = storage.get<Task>(STORAGE_KEYS.TASKS);
      const localRoutines = storage.get<Routine>(STORAGE_KEYS.ROUTINES);

      // Migrate achievements
      migrationStatus.achievements.total = localAchievements.length;
      for (const achievement of localAchievements) {
        try {
          await addAchievement({
            type: achievement.type,
            title: achievement.title,
            description: achievement.description,
            dateCompleted: achievement.dateCompleted,
            tags: achievement.tags,
            proofUrl: achievement.proofUrl,
          });
          migrationStatus.achievements.migrated++;
        } catch (err: any) {
          migrationStatus.achievements.errors.push(`${achievement.title}: ${err.message}`);
        }
      }

      // Migrate resources
      migrationStatus.resources.total = localResources.length;
      for (const resource of localResources) {
        try {
          await addResource({
            type: resource.type,
            title: resource.title,
            content: resource.content,
            url: resource.url,
            category: resource.category,
            tags: resource.tags,
          });
          migrationStatus.resources.migrated++;
        } catch (err: any) {
          migrationStatus.resources.errors.push(`${resource.title}: ${err.message}`);
        }
      }

      // Migrate goals
      migrationStatus.goals.total = localGoals.length;
      for (const goal of localGoals) {
        try {
          await addGoal({
            title: goal.title,
            description: goal.description,
            targetDate: goal.targetDate,
            status: goal.status,
            progress: goal.progress,
          });
          migrationStatus.goals.migrated++;
        } catch (err: any) {
          migrationStatus.goals.errors.push(`${goal.title}: ${err.message}`);
        }
      }

      // Migrate tasks
      migrationStatus.tasks.total = localTasks.length;
      for (const task of localTasks) {
        try {
          await addTask({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            completed: task.completed,
            isRoutine: task.isRoutine,
            reminderTime: task.reminderTime,
          });
          migrationStatus.tasks.migrated++;
        } catch (err: any) {
          migrationStatus.tasks.errors.push(`${task.title}: ${err.message}`);
        }
      }

      // Migrate routines
      migrationStatus.routines.total = localRoutines.length;
      for (const routine of localRoutines) {
        try {
          await addRoutine({
            title: routine.title,
            daysOfWeek: routine.daysOfWeek,
            time: routine.time,
            isActive: routine.isActive,
          });
          migrationStatus.routines.migrated++;
        } catch (err: any) {
          migrationStatus.routines.errors.push(`${routine.title}: ${err.message}`);
        }
      }

      setStatus(migrationStatus);
    } catch (err: any) {
      setError(err.message);
      console.error('Migration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const hasLocalData = () => {
    const achievements = storage.get<Achievement>(STORAGE_KEYS.ACHIEVEMENTS);
    const resources = storage.get<Resource>(STORAGE_KEYS.RESOURCES);
    const goals = storage.get<Goal>(STORAGE_KEYS.GOALS);
    const tasks = storage.get<Task>(STORAGE_KEYS.TASKS);
    const routines = storage.get<Routine>(STORAGE_KEYS.ROUTINES);

    return achievements.length > 0 || resources.length > 0 || goals.length > 0 || 
           tasks.length > 0 || routines.length > 0;
  };

  const clearLocalData = () => {
    storage.clear();
  };

  return {
    migrateData,
    hasLocalData: hasLocalData(),
    clearLocalData,
    isLoading,
    status,
    error,
  };
}