'use client';

import { useState, useEffect } from 'react';
import { Goal } from '@/types';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      const data = storage.get<Goal>(STORAGE_KEYS.GOALS);
      setGoals(data);
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Save to localStorage whenever goals change
  useEffect(() => {
    if (!isLoading) {
      storage.set(STORAGE_KEYS.GOALS, goals);
    }
  }, [goals, isLoading]);

  const addGoal = (data: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGoal: Goal = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (id: string, data: Partial<Omit<Goal, 'id' | 'createdAt'>>) => {
    setGoals(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...data, updatedAt: new Date().toISOString() }
        : item
    ));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(item => item.id !== id));
  };

  const getGoalsByStatus = (status: Goal['status']) => {
    return goals.filter(goal => goal.status === status);
  };

  const searchGoals = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return goals.filter(goal => 
      goal.title.toLowerCase().includes(lowercaseQuery) ||
      goal.description?.toLowerCase().includes(lowercaseQuery)
    );
  };

  const updateProgress = (id: string, progress: number) => {
    const clampedProgress = Math.max(0, Math.min(100, progress));
    updateGoal(id, { 
      progress: clampedProgress,
      status: clampedProgress === 100 ? 'completed' : 
              clampedProgress > 0 ? 'in-progress' : 'not-started'
    });
  };

  return {
    goals,
    isLoading,
    addGoal,
    updateGoal,
    deleteGoal,
    getGoalsByStatus,
    searchGoals,
    updateProgress
  };
}