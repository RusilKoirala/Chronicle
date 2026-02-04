'use client';

import { useState, useEffect } from 'react';
import { Achievement } from '@/types';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const data = storage.get<Achievement>(STORAGE_KEYS.ACHIEVEMENTS);
    setAchievements(data);
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever achievements change
  useEffect(() => {
    if (!isLoading) {
      storage.set(STORAGE_KEYS.ACHIEVEMENTS, achievements);
    }
  }, [achievements, isLoading]);

  const addAchievement = (data: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAchievement: Achievement = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setAchievements(prev => [...prev, newAchievement]);
  };

  const updateAchievement = (id: string, data: Partial<Omit<Achievement, 'id' | 'createdAt'>>) => {
    setAchievements(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...data, updatedAt: new Date().toISOString() }
        : item
    ));
  };

  const deleteAchievement = (id: string) => {
    setAchievements(prev => prev.filter(item => item.id !== id));
  };

  const getAchievementsByType = (type: Achievement['type']) => {
    return achievements.filter(achievement => achievement.type === type);
  };

  const searchAchievements = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return achievements.filter(achievement => 
      achievement.title.toLowerCase().includes(lowercaseQuery) ||
      achievement.description?.toLowerCase().includes(lowercaseQuery) ||
      achievement.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  return {
    achievements,
    isLoading,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    getAchievementsByType,
    searchAchievements
  };
}