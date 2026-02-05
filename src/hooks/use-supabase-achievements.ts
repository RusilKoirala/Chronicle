'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/auth-provider';
import type { Achievement } from '@/types';
import type { Database } from '@/types/database';

type DbAchievement = Database['public']['Tables']['achievements']['Row'];
type DbAchievementInsert = Database['public']['Tables']['achievements']['Insert'];
type DbAchievementUpdate = Database['public']['Tables']['achievements']['Update'];

// Convert database achievement to app achievement
const dbToAppAchievement = (dbAchievement: DbAchievement): Achievement => ({
  id: dbAchievement.id,
  type: dbAchievement.type,
  title: dbAchievement.title,
  description: dbAchievement.description || '',
  dateCompleted: dbAchievement.date_completed,
  tags: dbAchievement.tags || [],
  proofUrl: dbAchievement.proof_url || '',
  createdAt: dbAchievement.created_at,
  updatedAt: dbAchievement.updated_at,
});

// Convert app achievement to database achievement
const appToDbAchievement = (achievement: Partial<Achievement>, userId: string): DbAchievementInsert => ({
  user_id: userId,
  type: achievement.type!,
  title: achievement.title!,
  description: achievement.description || null,
  date_completed: achievement.dateCompleted!,
  tags: achievement.tags || [],
  proof_url: achievement.proofUrl || null,
});

export function useSupabaseAchievements() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch achievements
  const fetchAchievements = async () => {
    if (!user || !supabase) {
      setAchievements([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await (supabase as any)
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAchievements(data?.map(dbToAppAchievement) || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch achievements');
      console.error('Error fetching achievements:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add achievement
  const addAchievement = async (achievement: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user || !supabase) return;

    try {
      const dbAchievement = appToDbAchievement(achievement, user.id);
      const { data, error } = await (supabase as any)
        .from('achievements')
        .insert(dbAchievement)
        .select()
        .single();

      if (error) throw error;

      const newAchievement = dbToAppAchievement(data);
      setAchievements(prev => [newAchievement, ...prev]);
      return newAchievement;
    } catch (err: any) {
      setError(err.message || 'Failed to add achievement');
      console.error('Error adding achievement:', err);
      throw err;
    }
  };

  // Update achievement
  const updateAchievement = async (id: string, updates: Partial<Achievement>) => {
    if (!user) return;

    try {
      const dbUpdates: DbAchievementUpdate = {
        ...(updates.type && { type: updates.type }),
        ...(updates.title && { title: updates.title }),
        ...(updates.description !== undefined && { description: updates.description || null }),
        ...(updates.dateCompleted && { date_completed: updates.dateCompleted }),
        ...(updates.tags && { tags: updates.tags }),
        ...(updates.proofUrl !== undefined && { proof_url: updates.proofUrl || null }),
      };

      const { data, error } = await (supabase as any)!
        .from('achievements')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedAchievement = dbToAppAchievement(data);
      setAchievements(prev => prev.map(a => a.id === id ? updatedAchievement : a));
      return updatedAchievement;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating achievement:', err);
      throw err;
    }
  };

  // Delete achievement
  const deleteAchievement = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await (supabase as any)!
        .from('achievements')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setAchievements(prev => prev.filter(a => a.id !== id));
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting achievement:', err);
      throw err;
    }
  };

  // Filter functions
  const getAchievementsByType = (type: Achievement['type']) => {
    return achievements.filter(achievement => achievement.type === type);
  };

  const searchAchievements = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return achievements.filter(achievement =>
      achievement.title.toLowerCase().includes(lowercaseQuery) ||
      achievement.description?.toLowerCase().includes(lowercaseQuery) ||
      achievement.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  // Load achievements when user changes
  useEffect(() => {
    if (user && supabase) {
      fetchAchievements();
    } else {
      setAchievements([]);
      setIsLoading(false);
    }
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user || !supabase) return;

    const subscription = supabase
      .channel('achievements_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'achievements',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchAchievements();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return {
    achievements,
    isLoading,
    error,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    getAchievementsByType,
    searchAchievements,
    refetch: fetchAchievements,
  };
}