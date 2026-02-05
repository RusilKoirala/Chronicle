'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/auth-provider';
import type { Task } from '@/types';
import type { DbTask, DbTaskInsert, DbTaskUpdate } from '@/types/database';

// Convert database task to app task
const dbToAppTask = (dbTask: DbTask): Task => ({
  id: dbTask.id,
  title: dbTask.title,
  description: dbTask.description || '',
  dueDate: dbTask.due_date || '',
  completed: dbTask.completed,
  isRoutine: dbTask.is_routine,
  reminderTime: dbTask.reminder_time || '',
  createdAt: dbTask.created_at,
  updatedAt: dbTask.updated_at,
});

// Convert app task to database task
const appToDbTask = (task: Partial<Task>, userId: string): DbTaskInsert => ({
  user_id: userId,
  title: task.title!,
  description: task.description || null,
  due_date: task.dueDate || null,
  completed: task.completed || false,
  is_routine: task.isRoutine || false,
  reminder_time: task.reminderTime || null,
});

export function useSupabaseTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks
  const fetchTasks = async () => {
    if (!user) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await (supabase as any)!
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTasks(data?.map(dbToAppTask) || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add task
  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      const dbTask = appToDbTask(task, user.id);
      const { data, error } = await (supabase as any)!
        .from('tasks')
        .insert(dbTask)
        .select()
        .single();

      if (error) throw error;

      const newTask = dbToAppTask(data);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding task:', err);
      throw err;
    }
  };

  // Update task
  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) return;

    try {
      const dbUpdates: DbTaskUpdate = {
        ...(updates.title && { title: updates.title }),
        ...(updates.description !== undefined && { description: updates.description || null }),
        ...(updates.dueDate !== undefined && { due_date: updates.dueDate || null }),
        ...(updates.completed !== undefined && { completed: updates.completed }),
        ...(updates.isRoutine !== undefined && { is_routine: updates.isRoutine }),
        ...(updates.reminderTime !== undefined && { reminder_time: updates.reminderTime || null }),
      };

      const { data, error } = await (supabase as any)!
        .from('tasks')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedTask = dbToAppTask(data);
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
      return updatedTask;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating task:', err);
      throw err;
    }
  };

  // Toggle task completion
  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    return updateTask(id, { completed: !task.completed });
  };

  // Delete task
  const deleteTask = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await (supabase as any)!
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  // Filter functions
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

  // Load tasks when user changes
  useEffect(() => {
    if (user && supabase) {
      fetchTasks();
    } else {
      setTasks([]);
      setIsLoading(false);
    }
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user || !supabase) return;

    const subscription = supabase
      .channel('tasks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return {
    tasks,
    isLoading,
    error,
    addTask,
    updateTask,
    toggleTask,
    toggleComplete: toggleTask, // Alias for compatibility with local hook
    deleteTask,
    getActiveTasks,
    getCompletedTasks,
    getRoutineTasks,
    searchTasks,
    getTasksDueToday,
    getOverdueTasks,
    refetch: fetchTasks,
  };
}