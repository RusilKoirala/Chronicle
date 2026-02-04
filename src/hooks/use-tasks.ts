'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      const data = storage.get<Task>(STORAGE_KEYS.TASKS);
      setTasks(data);
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    if (!isLoading) {
      storage.set(STORAGE_KEYS.TASKS, tasks);
    }
  }, [tasks, isLoading]);

  const addTask = (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, data: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...data, updatedAt: new Date().toISOString() }
        : item
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(item => item.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks(prev => prev.map(item => 
      item.id === id 
        ? { ...item, completed: !item.completed, updatedAt: new Date().toISOString() }
        : item
    ));
  };

  const getActiveTasks = () => {
    return tasks.filter(task => !task.completed);
  };

  const getCompletedTasks = () => {
    return tasks.filter(task => task.completed);
  };

  const getRoutineTasks = () => {
    return tasks.filter(task => task.isRoutine);
  };

  const searchTasks = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(lowercaseQuery) ||
      task.description?.toLowerCase().includes(lowercaseQuery)
    );
  };

  const getTasksDueToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => 
      task.dueDate && task.dueDate.startsWith(today) && !task.completed
    );
  };

  const getOverdueTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => 
      task.dueDate && task.dueDate < today && !task.completed
    );
  };

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    getActiveTasks,
    getCompletedTasks,
    getRoutineTasks,
    searchTasks,
    getTasksDueToday,
    getOverdueTasks
  };
}