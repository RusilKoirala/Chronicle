'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/auth-provider';
import type { Resource } from '@/types';
import type { Database } from '@/types/database';

type DbResource = Database['public']['Tables']['resources']['Row'];
type DbResourceInsert = Database['public']['Tables']['resources']['Insert'];
type DbResourceUpdate = Database['public']['Tables']['resources']['Update'];

// Convert database resource to app resource
const dbToAppResource = (dbResource: DbResource): Resource => ({
  id: dbResource.id,
  type: dbResource.type,
  title: dbResource.title,
  content: dbResource.content,
  url: dbResource.url || '',
  category: dbResource.category,
  tags: dbResource.tags || [],
  createdAt: dbResource.created_at,
  updatedAt: dbResource.updated_at,
});

// Convert app resource to database resource
const appToDbResource = (resource: Partial<Resource>, userId: string): DbResourceInsert => ({
  user_id: userId,
  type: resource.type!,
  title: resource.title!,
  content: resource.content!,
  url: resource.url || null,
  category: resource.category!,
  tags: resource.tags || [],
});

export function useSupabaseResources() {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch resources
  const fetchResources = async () => {
    if (!user || !supabase) {
      setResources([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await (supabase as any)
        .from('resources')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setResources(data?.map(dbToAppResource) || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch resources');
      console.error('Error fetching resources:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add resource
  const addResource = async (resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user || !supabase) return;

    try {
      const dbResource = appToDbResource(resource, user.id);
      const { data, error } = await (supabase as any)
        .from('resources')
        .insert(dbResource)
        .select()
        .single();

      if (error) throw error;

      const newResource = dbToAppResource(data);
      setResources(prev => [newResource, ...prev]);
      return newResource;
    } catch (err: any) {
      setError(err.message || 'Failed to add resource');
      console.error('Error adding resource:', err);
      throw err;
    }
  };

  // Update resource
  const updateResource = async (id: string, updates: Partial<Resource>) => {
    if (!user || !supabase) return;

    try {
      const dbUpdates: DbResourceUpdate = {
        ...(updates.type && { type: updates.type }),
        ...(updates.title && { title: updates.title }),
        ...(updates.content !== undefined && { content: updates.content }),
        ...(updates.url !== undefined && { url: updates.url || null }),
        ...(updates.category && { category: updates.category }),
        ...(updates.tags && { tags: updates.tags }),
      };

      const { data, error } = await (supabase as any)
        .from('resources')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedResource = dbToAppResource(data);
      setResources(prev => prev.map(r => r.id === id ? updatedResource : r));
      return updatedResource;
    } catch (err: any) {
      setError(err.message || 'Failed to update resource');
      console.error('Error updating resource:', err);
      throw err;
    }
  };

  // Delete resource
  const deleteResource = async (id: string) => {
    if (!user || !supabase) return;

    try {
      const { error } = await (supabase as any)
        .from('resources')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setResources(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete resource');
      console.error('Error deleting resource:', err);
      throw err;
    }
  };

  // Filter functions
  const getResourcesByType = (type: Resource['type']) => {
    return resources.filter(resource => resource.type === type);
  };

  const getResourcesByCategory = (category: string) => {
    return resources.filter(resource => resource.category === category);
  };

  const searchResources = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return resources.filter(resource =>
      resource.title.toLowerCase().includes(lowercaseQuery) ||
      resource.content.toLowerCase().includes(lowercaseQuery) ||
      resource.category.toLowerCase().includes(lowercaseQuery) ||
      resource.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const getAllCategories = () => {
    const categories = resources.map(resource => resource.category);
    return Array.from(new Set(categories)).filter(Boolean).sort();
  };

  const getAllTags = () => {
    const tags = resources.flatMap(resource => resource.tags);
    return Array.from(new Set(tags)).filter(Boolean).sort();
  };

  // Load resources when user changes
  useEffect(() => {
    if (user && supabase) {
      fetchResources();
    } else {
      setResources([]);
      setIsLoading(false);
    }
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user || !supabase) return;

    const subscription = supabase
      .channel('resources_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'resources',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchResources();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return {
    resources,
    isLoading,
    error,
    addResource,
    updateResource,
    deleteResource,
    getResourcesByType,
    getResourcesByCategory,
    searchResources,
    getAllCategories,
    getAllTags,
    refetch: fetchResources,
  };
}