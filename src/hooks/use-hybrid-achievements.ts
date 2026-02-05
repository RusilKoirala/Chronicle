'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { useAchievements as useLocalAchievements } from './use-achievements';
import { useSupabaseAchievements } from './use-supabase-achievements';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export function useHybridAchievements() {
  const { user } = useAuth();
  const localHook = useLocalAchievements();
  const supabaseHook = useSupabaseAchievements();

  // Return localStorage hook if Supabase is not configured or user is not authenticated
  // Return Supabase hook if user is authenticated and Supabase is configured
  return (isSupabaseConfigured && supabase && user) ? supabaseHook : localHook;
}