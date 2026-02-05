'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/auth-provider';
import type { Goal } from '@/types';
import type { Database } from '@/types/database';

type DbGoal = Database['public']['Tables']['goals']['Row'];
type DbGoalInsert = Database['public']['Tables']['goals']['Insert'];
type DbGoalUpdate = Database['public']['Tables']['goals']['Update'];

// Convert database goal to app goal
const dbToAppGoal = (dbGoal: DbGoal): Goal => ({
  id: dbGoal.id,
  title: dbGoal.title,
  description: dbGoal.description || '',
  targetDate: dbGoal.target_date || '',
  status: dbGoal.status,
  progress: dbGoal.progress,
  createdAt: dbGoal.created_at,
  updatedAt: dbGoal.updated_at,
});

// Convert app goal to database goal
const appToDbGoal = (goal: Partial<Goal>, userId: string): DbGoalInsert => ({
  user_id: userId,
  title: goal.title!,
  description: goal.description || null,
  target_date: goal.targetDate || null,
  status: goal.status || 'not-started',
  progress: goal.progress || 0,
});

export function useSupabaseGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch goals
  const fetchGoals = async () => {
    if (!user || !supabase) {
      setGoals([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await (supabase as any)!
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setGoals(data?.map(dbToAppGoal) || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch goals');
      console.error('Error fetching goals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add goal
  const addGoal = async (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      const dbGoal = appToDbGoal(goal, user.id);
      const { data, error } = await (supabase as any)!
        .from('goals')
        .insert(dbGoal)
        .select()
        .single();

      if (error) throw error;

      const newGoal = dbToAppGoal(data);
      setGoals(prev => [newGoal, ...prev]);
      return newGoal;
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding goal:', err);
      throw err;
    }
  };

  // Update goal
  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    if (!user) return;

    try {
      const dbUpdates: DbGoalUpdate = {
        ...(updates.title && { title: updates.title }),
        ...(updates.description !== undefined && { description: updates.description || null }),
        ...(updates.targetDate !== undefined && { target_date: updates.targetDate || null }),
        ...(updates.status && { status: updates.status }),
        ...(updates.progress !== undefined && { progress: updates.progress }),
      };

      const { data, error } = await (supabase as any)!
        .from('goals')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedGoal = dbToAppGoal(data);
      setGoals(prev => prev.map(g => g.id === id ? updatedGoal : g));
      return updatedGoal;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating goal:', err);
      throw err;
    }
  };

  // Delete goal
  const deleteGoal = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await (supabase as any)!
        .from('goals')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setGoals(prev => prev.filter(g => g.id !== id));
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting goal:', err);
      throw err;
    }
  };

  // Filter functions
  const getGoalsByStatus = (status: Goal['status']) => {
    return goals.filter(goal => goal.status === status);
  };

  const searchGoals = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return goals.filter(goal =>
      goal.title.toLowerCase().includes(lowercaseQuery) ||
      goal.description?.toLowerCase().includes(lowercaseQuery)
    );
  };

  const updateProgress = (id: string, progress: number) => {
    const clampedProgress = Math.max(0, Math.min(100, progress));
    return updateGoal(id, { 
      progress: clampedProgress,
      status: clampedProgress === 100 ? 'completed' : 
              clampedProgress > 0 ? 'in-progress' : 'not-started'
    });
  };

  // Load goals when user changes
  useEffect(() => {
    if (user && supabase) {
      fetchGoals();
    } else {
      setGoals([]);
      setIsLoading(false);
    }
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user || !supabase) return;

    const subscription = supabase
      .channel('goals_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'goals',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchGoals();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return {
    goals,
    isLoading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    getGoalsByStatus,
    searchGoals,
    updateProgress,
    refetch: fetchGoals,
  };
}