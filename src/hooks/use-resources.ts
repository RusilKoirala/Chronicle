'use client';

import { useState, useEffect } from 'react';
import { Resource } from '@/types';

const STORAGE_KEY = 'tracker_resources';

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load resources from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setResources(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load resources:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever resources change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
      } catch (error) {
        console.error('Failed to save resources:', error);
      }
    }
  }, [resources, isLoading]);

  const addResource = (resourceData: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newResource: Resource = {
      ...resourceData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setResources(prev => [newResource, ...prev]);
    return newResource;
  };

  const updateResource = (id: string, updates: Partial<Omit<Resource, 'id' | 'createdAt'>>) => {
    setResources(prev =>
      prev.map(resource =>
        resource.id === id
          ? { ...resource, ...updates, updatedAt: new Date().toISOString() }
          : resource
      )
    );
  };

  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(resource => resource.id !== id));
  };

  const getResourceById = (id: string) => {
    return resources.find(resource => resource.id === id);
  };

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
      resource.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      resource.category.toLowerCase().includes(lowercaseQuery)
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

  return {
    resources,
    isLoading,
    addResource,
    updateResource,
    deleteResource,
    getResourceById,
    getResourcesByType,
    getResourcesByCategory,
    searchResources,
    getAllCategories,
    getAllTags,
  };
}