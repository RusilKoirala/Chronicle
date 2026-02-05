'use client';

import { useState, useEffect, useCallback } from 'react';
import { ReminderPreferences } from '@/types';
import { storage } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_PREFERENCES: Omit<ReminderPreferences, 'id' | 'createdAt' | 'updatedAt'> = {
  userId: 'default-user', // This would come from auth context in real app
  goalDeadlineReminders: true,
  routineReminders: true,
  behindScheduleReminders: true,
  streakMaintenanceReminders: true,
  
  // Default timing preferences
  workHoursStart: '09:00',
  workHoursEnd: '17:00',
  weekendReminders: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  
  // Default frequency preferences
  maxRemindersPerDay: 5,
  reminderIntervals: {
    goalDeadline: [7, 3, 1], // Days before deadline
    behindSchedule: 24,      // Hours between reminders
    streakMaintenance: 2     // Hours before streak breaks
  }
};

export function useReminderPreferences() {
  const [preferences, setPreferences] = useState<ReminderPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const loadPreferences = () => {
      try {
        const stored = storage.get<ReminderPreferences>('reminder-preferences');
        if (stored.length > 0) {
          setPreferences(stored[0]);
        } else {
          // Create default preferences
          const defaultPrefs: ReminderPreferences = {
            ...DEFAULT_PREFERENCES,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setPreferences(defaultPrefs);
          storage.set('reminder-preferences', [defaultPrefs]);
        }
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load reminder preferences');
        setIsLoading(false);
      }
    };
    
    loadPreferences();
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && preferences) {
      try {
        storage.set('reminder-preferences', [preferences]);
      } catch (err) {
        setError('Failed to save reminder preferences');
      }
    }
  }, [preferences, isLoading]);

  const updatePreferences = useCallback((updates: Partial<ReminderPreferences>) => {
    if (!preferences) return;
    
    const updatedPreferences: ReminderPreferences = {
      ...preferences,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    setPreferences(updatedPreferences);
    return updatedPreferences;
  }, [preferences]);

  const resetToDefaults = useCallback(() => {
    const defaultPrefs: ReminderPreferences = {
      ...DEFAULT_PREFERENCES,
      id: preferences?.id || uuidv4(),
      createdAt: preferences?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setPreferences(defaultPrefs);
    return defaultPrefs;
  }, [preferences]);

  // Helper functions for intelligent timing
  const isWithinWorkHours = useCallback((time: Date = new Date()) => {
    if (!preferences) return true;
    
    const timeStr = time.toTimeString().slice(0, 5); // HH:MM format
    return timeStr >= preferences.workHoursStart && timeStr <= preferences.workHoursEnd;
  }, [preferences]);

  const isWithinQuietHours = useCallback((time: Date = new Date()) => {
    if (!preferences) return false;
    
    const timeStr = time.toTimeString().slice(0, 5); // HH:MM format
    const quietStart = preferences.quietHoursStart;
    const quietEnd = preferences.quietHoursEnd;
    
    // Handle overnight quiet hours (e.g., 22:00 to 08:00)
    if (quietStart > quietEnd) {
      return timeStr >= quietStart || timeStr <= quietEnd;
    }
    
    return timeStr >= quietStart && timeStr <= quietEnd;
  }, [preferences]);

  const shouldSendReminder = useCallback((reminderType: keyof Pick<ReminderPreferences, 'goalDeadlineReminders' | 'routineReminders' | 'behindScheduleReminders' | 'streakMaintenanceReminders'>, time: Date = new Date()) => {
    if (!preferences) return false;
    
    // Check if this type of reminder is enabled
    if (!preferences[reminderType]) return false;
    
    // Check if it's weekend and weekend reminders are disabled
    const isWeekend = time.getDay() === 0 || time.getDay() === 6;
    if (isWeekend && !preferences.weekendReminders) return false;
    
    // Check if it's within quiet hours
    if (isWithinQuietHours(time)) return false;
    
    return true;
  }, [preferences, isWithinQuietHours]);

  const getOptimalReminderTime = useCallback((baseTime: Date) => {
    if (!preferences) return baseTime;
    
    const optimalTime = new Date(baseTime);
    
    // If it's within quiet hours, schedule for after quiet hours end
    if (isWithinQuietHours(optimalTime)) {
      const [hours, minutes] = preferences.quietHoursEnd.split(':').map(Number);
      optimalTime.setHours(hours, minutes, 0, 0);
      
      // If that's tomorrow, schedule for today after quiet hours
      if (optimalTime.getDate() !== baseTime.getDate()) {
        optimalTime.setDate(baseTime.getDate());
      }
    }
    
    // If it's outside work hours and it's a weekday, schedule for work hours
    const isWeekday = optimalTime.getDay() >= 1 && optimalTime.getDay() <= 5;
    if (isWeekday && !isWithinWorkHours(optimalTime)) {
      const [hours, minutes] = preferences.workHoursStart.split(':').map(Number);
      optimalTime.setHours(hours, minutes, 0, 0);
    }
    
    return optimalTime;
  }, [preferences, isWithinQuietHours, isWithinWorkHours]);

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
    resetToDefaults,
    isWithinWorkHours,
    isWithinQuietHours,
    shouldSendReminder,
    getOptimalReminderTime
  };
}