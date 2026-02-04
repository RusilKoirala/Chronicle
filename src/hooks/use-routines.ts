'use client';

import { useState, useEffect } from 'react';
import { Routine } from '@/types';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export function useRoutines() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      const data = storage.get<Routine>(STORAGE_KEYS.ROUTINES);
      setRoutines(data);
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Save to localStorage whenever routines change
  useEffect(() => {
    if (!isLoading) {
      storage.set(STORAGE_KEYS.ROUTINES, routines);
    }
  }, [routines, isLoading]);

  const addRoutine = (data: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRoutine: Routine = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setRoutines(prev => [...prev, newRoutine]);
  };

  const updateRoutine = (id: string, data: Partial<Omit<Routine, 'id' | 'createdAt'>>) => {
    setRoutines(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...data, updatedAt: new Date().toISOString() }
        : item
    ));
  };

  const deleteRoutine = (id: string) => {
    setRoutines(prev => prev.filter(item => item.id !== id));
  };

  const toggleActive = (id: string) => {
    setRoutines(prev => prev.map(item => 
      item.id === id 
        ? { ...item, isActive: !item.isActive, updatedAt: new Date().toISOString() }
        : item
    ));
  };

  const getActiveRoutines = () => {
    return routines.filter(routine => routine.isActive);
  };

  const getInactiveRoutines = () => {
    return routines.filter(routine => !routine.isActive);
  };

  const getRoutinesForDay = (dayOfWeek: number) => {
    return routines.filter(routine => 
      routine.isActive && routine.daysOfWeek.includes(dayOfWeek)
    );
  };

  const getTodaysRoutines = () => {
    const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
    return getRoutinesForDay(today);
  };

  const searchRoutines = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return routines.filter(routine => 
      routine.title.toLowerCase().includes(lowercaseQuery)
    );
  };

  const getDayName = (dayIndex: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex] || '';
  };

  const formatDaysOfWeek = (daysOfWeek: number[]): string => {
    if (daysOfWeek.length === 7) return 'Every day';
    if (daysOfWeek.length === 0) return 'No days';
    
    const sortedDays = [...daysOfWeek].sort();
    const dayNames = sortedDays.map(day => getDayName(day).slice(0, 3)); // Mon, Tue, etc.
    
    if (dayNames.length <= 3) {
      return dayNames.join(', ');
    }
    
    return `${dayNames.slice(0, 2).join(', ')} +${dayNames.length - 2} more`;
  };

  return {
    routines,
    isLoading,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    toggleActive,
    getActiveRoutines,
    getInactiveRoutines,
    getRoutinesForDay,
    getTodaysRoutines,
    searchRoutines,
    getDayName,
    formatDaysOfWeek
  };
}