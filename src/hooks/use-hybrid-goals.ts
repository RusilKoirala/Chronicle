'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { useGoals as useLocalGoals } from './use-goals';
import { useSupabaseGoals } from './use-supabase-goals';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export function useHybridGoals() {
  const { user } = useAuth();
  const localHook = useLocalGoals();
  const supabaseHook = useSupabaseGoals();

  // Return localStorage hook if Supabase is not configured or user is not authenticated
  // Return Supabase hook if user is authenticated and Supabase is configured
  return (isSupabaseConfigured && supabase && user) ? supabaseHook : localHook;
}