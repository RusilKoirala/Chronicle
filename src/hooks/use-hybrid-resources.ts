'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { useResources as useLocalResources } from './use-resources';
import { useSupabaseResources } from './use-supabase-resources';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export function useHybridResources() {
  const { user } = useAuth();
  const localHook = useLocalResources();
  const supabaseHook = useSupabaseResources();

  // Return localStorage hook if Supabase is not configured or user is not authenticated
  // Return Supabase hook if user is authenticated and Supabase is configured
  return (isSupabaseConfigured && supabase && user) ? supabaseHook : localHook;
}