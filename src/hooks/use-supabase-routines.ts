'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/auth-provider';
import type { Routine } from '@/types';
import type { Database } from '@/types/database';

type DbRoutine = Database['public']['Tables']['routines']['Row'];
type DbRoutineInsert = Database['public']['Tables']['routines']['Insert'];
type DbRoutineUpdate = Database['public']['Tables']['routines']['Update'];

// Convert database routine to app routine
const dbToAppRoutine = (dbRoutine: DbRoutine): Routine => ({
  id: dbRoutine.id,
  title: dbRoutine.title,
  daysOfWeek: dbRoutine.days_of_week || [],
  time: dbRoutine.time,
  isActive: dbRoutine.is_active,
  createdAt: dbRoutine.created_at,
  updatedAt: dbRoutine.updated_at,
});

// Convert app routine to database routine
const appToDbRoutine = (routine: Partial<Routine>, userId: string): DbRoutineInsert => ({
  user_id: userId,
  title: routine.title!,
  days_of_week: routine.daysOfWeek || [],
  time: routine.time!,
  is_active: routine.isActive !== undefined ? routine.isActive : true,
});

export function useSupabaseRoutines() {
  const { user } = useAuth();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch routines
  const fetchRoutines = async () => {
    if (!user) {
      setRoutines([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await (supabase as any)!
        .from('routines')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRoutines(data?.map(dbToAppRoutine) || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching routines:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add routine
  const addRoutine = async (routine: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      const dbRoutine = appToDbRoutine(routine, user.id);
      const { data, error } = await (supabase as any)!
        .from('routines')
        .insert(dbRoutine)
        .select()
        .single();

      if (error) throw error;

      const newRoutine = dbToAppRoutine(data);
      setRoutines(prev => [newRoutine, ...prev]);
      return newRoutine;
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding routine:', err);
      throw err;
    }
  };

  // Update routine
  const updateRoutine = async (id: string, updates: Partial<Routine>) => {
    if (!user) return;

    try {
      const dbUpdates: DbRoutineUpdate = {
        ...(updates.title && { title: updates.title }),
        ...(updates.daysOfWeek && { days_of_week: updates.daysOfWeek }),
        ...(updates.time && { time: updates.time }),
        ...(updates.isActive !== undefined && { is_active: updates.isActive }),
      };

      const { data, error } = await (supabase as any)!
        .from('routines')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedRoutine = dbToAppRoutine(data);
      setRoutines(prev => prev.map(r => r.id === id ? updatedRoutine : r));
      return updatedRoutine;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating routine:', err);
      throw err;
    }
  };

  // Toggle routine active status
  const toggleRoutine = async (id: string) => {
    const routine = routines.find(r => r.id === id);
    if (!routine) return;

    return updateRoutine(id, { isActive: !routine.isActive });
  };

  // Delete routine
  const deleteRoutine = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await (supabase as any)!
        .from('routines')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setRoutines(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting routine:', err);
      throw err;
    }
  };

  // Filter functions
  const getActiveRoutines = () => {
    return routines.filter(routine => routine.isActive);
  };

  const getInactiveRoutines = () => {
    return routines.filter(routine => !routine.isActive);
  };

  const getRoutinesForDay = (dayOfWeek: number) => {
    return routines.filter(routine => 
      routine.isActive && routine.daysOfWeek.includes(dayOfWeek)
    );
  };

  const searchRoutines = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return routines.filter(routine =>
      routine.title.toLowerCase().includes(lowercaseQuery)
    );
  };

  const getTodaysRoutines = () => {
    const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
    return getRoutinesForDay(today);
  };

  const getDayName = (dayIndex: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex] || '';
  };

  const formatDaysOfWeek = (daysOfWeek: number[]): string => {
    if (daysOfWeek.length === 7) return 'Every day';
    if (daysOfWeek.length === 0) return 'No days';
    
    const sortedDays = [...daysOfWeek].sort();
    const dayNames = sortedDays.map(day => getDayName(day).slice(0, 3)); // Mon, Tue, etc.
    
    if (dayNames.length <= 3) {
      return dayNames.join(', ');
    }
    
    return `${dayNames.slice(0, 2).join(', ')} +${dayNames.length - 2} more`;
  };

  // Load routines when user changes
  useEffect(() => {
    if (user && supabase) {
      fetchRoutines();
    } else {
      setRoutines([]);
      setIsLoading(false);
    }
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user || !supabase) return;

    const subscription = supabase
      .channel('routines_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'routines',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchRoutines();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return {
    routines,
    isLoading,
    error,
    addRoutine,
    updateRoutine,
    toggleRoutine,
    toggleActive: toggleRoutine, // Alias for compatibility with local hook
    deleteRoutine,
    getActiveRoutines,
    getInactiveRoutines,
    getRoutinesForDay,
    getTodaysRoutines,
    searchRoutines,
    getDayName,
    formatDaysOfWeek,
    refetch: fetchRoutines,
  };
}