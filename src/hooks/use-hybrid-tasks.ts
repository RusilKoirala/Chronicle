'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { useTasks as useLocalTasks } from './use-tasks';
import { useSupabaseTasks } from './use-supabase-tasks';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export function useHybridTasks() {
  const { user } = useAuth();
  const localHook = useLocalTasks();
  const supabaseHook = useSupabaseTasks();

  // Return localStorage hook if Supabase is not configured or user is not authenticated
  // Return Supabase hook if user is authenticated and Supabase is configured
  return (isSupabaseConfigured && supabase && user) ? supabaseHook : localHook;
}