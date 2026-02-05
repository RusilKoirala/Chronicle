import { supabase } from './supabase';

export const withSupabaseCheck = <T extends any[], R>(
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R | undefined> => {
    if (!supabase) {
      console.warn('Supabase client not available');
      return undefined;
    }
    return fn(...args);
  };
};

export const handleSupabaseError = (err: any, operation: string): string => {
  const message = err?.message || `Failed to ${operation}`;
  console.error(`Error ${operation}:`, err);
  return message;
};