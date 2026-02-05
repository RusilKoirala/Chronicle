'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    // Get initial user
    const getUser = async () => {
      if (!auth) return;
      
      try {
        const { data: { user } } = await auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error getting user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setIsLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    if (auth) {
      return auth.signOut();
    }
    return Promise.resolve();
  };

  return {
    user,
    isLoading,
    signOut,
  };
}