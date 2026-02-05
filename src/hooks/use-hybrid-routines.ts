'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { useRoutines as useLocalRoutines } from './use-routines';
import { useSupabaseRoutines } from './use-supabase-routines';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export function useHybridRoutines() {
  const { user } = useAuth();
  const localHook = useLocalRoutines();
  const supabaseHook = useSupabaseRoutines();

  // Return localStorage hook if Supabase is not configured or user is not authenticated
  // Return Supabase hook if user is authenticated and Supabase is configured
  return (isSupabaseConfigured && supabase && user) ? supabaseHook : localHook;
}