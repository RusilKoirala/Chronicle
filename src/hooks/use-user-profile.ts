'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/auth-provider';
import type { DbProfile, DbProfileUpdate } from '@/types/database';

type Profile = DbProfile;
type ProfileUpdate = DbProfileUpdate;

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile
  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await (supabase as any)!
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          await createProfile();
          return;
        }
        throw error;
      }

      setProfile(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create user profile
  const createProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await (supabase as any)!
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
        })
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error creating profile:', err);
    }
  };

  // Update user profile
  const updateProfile = async (updates: Omit<ProfileUpdate, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await (supabase as any)!
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  // Load profile when user changes
  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refetch: fetchProfile,
  };
}