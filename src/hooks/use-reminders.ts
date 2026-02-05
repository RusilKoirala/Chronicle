'use client';

import { useState, useEffect, useCallback } from 'react';
import { Reminder, ReminderType, ReminderPriority, Goal, Task, Routine } from '@/types';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const data = storage.get<Reminder>('reminders');
        setReminders(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load reminders');
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Save to localStorage whenever reminders change
  useEffect(() => {
    if (!isLoading) {
      try {
        storage.set('reminders', reminders);
      } catch (err) {
        setError('Failed to save reminders');
      }
    }
  }, [reminders, isLoading]);

  const addReminder = useCallback((data: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newReminder: Reminder = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setReminders(prev => [...prev, newReminder]);
    return newReminder;
  }, []);

  const updateReminder = useCallback((id: string, updates: Partial<Reminder>) => {
    setReminders(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...updates, updatedAt: new Date().toISOString() }
        : item
    ));
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders(prev => prev.filter(item => item.id !== id));
  }, []);

  const acknowledgeReminder = useCallback((id: string) => {
    updateReminder(id, { 
      status: 'acknowledged',
      acknowledgedAt: new Date().toISOString()
    });
  }, [updateReminder]);

  const snoozeReminder = useCallback((id: string, snoozeUntil: string) => {
    updateReminder(id, { 
      status: 'snoozed',
      snoozeUntil
    });
  }, [updateReminder]);

  const dismissReminder = useCallback((id: string) => {
    updateReminder(id, { status: 'dismissed' });
  }, [updateReminder]);

  const getPendingReminders = useCallback(() => {
    const now = new Date().toISOString();
    return reminders.filter(reminder => 
      reminder.status === 'pending' && 
      reminder.scheduledFor <= now
    );
  }, [reminders]);

  const getOverdueReminders = useCallback(() => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    
    return reminders.filter(reminder => 
      reminder.status === 'pending' && 
      reminder.scheduledFor < oneDayAgo
    );
  }, [reminders]);

  const getRemindersByType = useCallback((type: ReminderType) => {
    return reminders.filter(reminder => reminder.type === type);
  }, [reminders]);

  // Generate reminders based on goals, tasks, and routines
  const generateReminders = useCallback(async () => {
    try {
      const goals = storage.get<Goal>(STORAGE_KEYS.GOALS);
      const tasks = storage.get<Task>(STORAGE_KEYS.TASKS);
      const routines = storage.get<Routine>(STORAGE_KEYS.ROUTINES);
      
      const newReminders: Reminder[] = [];
      const now = new Date();

      // Generate goal deadline reminders
      goals.forEach(goal => {
        if (goal.targetDate && goal.status !== 'completed') {
          const targetDate = new Date(goal.targetDate);
          const daysUntilDeadline = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          // Create reminders at 7 days, 3 days, and 1 day before deadline
          const reminderIntervals = [7, 3, 1];
          
          reminderIntervals.forEach(interval => {
            if (daysUntilDeadline === interval) {
              // Check if reminder already exists
              const existingReminder = reminders.find(r => 
                r.entityId === goal.id && 
                r.type === 'goal-deadline' &&
                r.status === 'pending'
              );
              
              if (!existingReminder) {
                const priority: ReminderPriority = interval === 1 ? 'urgent' : 
                                                 interval === 3 ? 'high' : 'medium';
                
                newReminders.push({
                  id: uuidv4(),
                  type: 'goal-deadline',
                  title: `Goal deadline approaching: ${goal.title}`,
                  message: `Your goal "${goal.title}" is due in ${interval} day${interval > 1 ? 's' : ''}. Current progress: ${goal.progress}%`,
                  priority,
                  status: 'pending',
                  scheduledFor: now.toISOString(),
                  entityId: goal.id,
                  entityType: 'goal',
                  actionSuggestions: [
                    'Review goal progress',
                    'Break down remaining tasks',
                    'Adjust timeline if needed'
                  ],
                  createdAt: now.toISOString(),
                  updatedAt: now.toISOString()
                });
              }
            }
          });

          // Generate behind-schedule reminders for goals with low progress
          if (daysUntilDeadline > 0 && daysUntilDeadline <= 14) {
            const expectedProgress = Math.max(0, 100 - (daysUntilDeadline / 14) * 100);
            if (goal.progress < expectedProgress - 20) {
              const existingBehindSchedule = reminders.find(r => 
                r.entityId === goal.id && 
                r.type === 'behind-schedule' &&
                r.status === 'pending'
              );
              
              if (!existingBehindSchedule) {
                newReminders.push({
                  id: uuidv4(),
                  type: 'behind-schedule',
                  title: `Goal behind schedule: ${goal.title}`,
                  message: `You're behind schedule on "${goal.title}". Expected progress: ${Math.round(expectedProgress)}%, Current: ${goal.progress}%`,
                  priority: 'high',
                  status: 'pending',
                  scheduledFor: now.toISOString(),
                  entityId: goal.id,
                  entityType: 'goal',
                  actionSuggestions: [
                    'Create specific action plan',
                    'Allocate more time daily',
                    'Consider adjusting scope'
                  ],
                  createdAt: now.toISOString(),
                  updatedAt: now.toISOString()
                });
              }
            }
          }
        }
      });

      // Generate routine reminders
      const today = now.getDay(); // 0 = Sunday, 6 = Saturday
      const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes since midnight
      
      routines.forEach(routine => {
        if (routine.isActive && routine.daysOfWeek.includes(today)) {
          const [hours, minutes] = routine.time.split(':').map(Number);
          const routineTime = hours * 60 + minutes;
          
          // Create reminder 30 minutes before routine time
          const reminderTime = routineTime - 30;
          const timeDiff = Math.abs(currentTime - reminderTime);
          
          // If we're within 5 minutes of reminder time
          if (timeDiff <= 5) {
            const existingRoutineReminder = reminders.find(r => 
              r.entityId === routine.id && 
              r.type === 'routine-schedule' &&
              r.status === 'pending' &&
              new Date(r.createdAt).toDateString() === now.toDateString()
            );
            
            if (!existingRoutineReminder) {
              newReminders.push({
                id: uuidv4(),
                type: 'routine-schedule',
                title: `Routine reminder: ${routine.title}`,
                message: `Your routine "${routine.title}" is scheduled for ${routine.time}`,
                priority: 'medium',
                status: 'pending',
                scheduledFor: now.toISOString(),
                entityId: routine.id,
                entityType: 'routine',
                actionSuggestions: [
                  'Start routine now',
                  'Prepare materials needed',
                  'Set timer for routine'
                ],
                createdAt: now.toISOString(),
                updatedAt: now.toISOString()
              });
            }
          }
        }
      });

      // Add new reminders to state
      if (newReminders.length > 0) {
        setReminders(prev => [...prev, ...newReminders]);
      }

    } catch (err) {
      setError('Failed to generate reminders');
      console.error('Reminder generation error:', err);
    }
  }, [reminders]);

  return {
    reminders,
    items: reminders, // For BaseHookReturn compatibility
    isLoading,
    error,
    addReminder,
    updateReminder,
    deleteReminder,
    acknowledgeReminder,
    snoozeReminder,
    dismissReminder,
    getPendingReminders,
    getOverdueReminders,
    getRemindersByType,
    generateReminders
  };
}