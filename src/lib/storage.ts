// localStorage utilities for Chronicle Personal Tracker App

export const STORAGE_KEYS = {
  ACHIEVEMENTS: 'tracker_achievements',
  RESOURCES: 'tracker_resources',
  GOALS: 'tracker_goals',
  TASKS: 'tracker_tasks',
  ROUTINES: 'tracker_routines',
  REMINDERS: 'tracker_reminders',
  REMINDER_PREFERENCES: 'tracker_reminder_preferences',
  SMART_SUGGESTIONS: 'tracker_smart_suggestions',
  VERSION: 'tracker_version'
} as const;

export const storage = {
  // Get data from localStorage
  get: <T>(key: string): T[] => {
    if (typeof window === 'undefined') return [];
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return [];
    }
  },

  // Save data to localStorage
  set: <T>(key: string, value: T[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  },

  // Remove data from localStorage
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  // Clear all app data
  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      // Also clear the reminder-related keys that use different naming
      localStorage.removeItem('reminders');
      localStorage.removeItem('reminder-preferences');
      localStorage.removeItem('smart-suggestions');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  // Export all data as JSON
  exportData: () => {
    if (typeof window === 'undefined') return null;
    
    const data = {
      achievements: storage.get(STORAGE_KEYS.ACHIEVEMENTS),
      resources: storage.get(STORAGE_KEYS.RESOURCES),
      goals: storage.get(STORAGE_KEYS.GOALS),
      tasks: storage.get(STORAGE_KEYS.TASKS),
      routines: storage.get(STORAGE_KEYS.ROUTINES),
      reminders: storage.get('reminders'),
      reminderPreferences: storage.get('reminder-preferences'),
      smartSuggestions: storage.get('smart-suggestions'),
      version: '1.0',
      exportedAt: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  },

  // Import data from JSON
  importData: (jsonData: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      const data = JSON.parse(jsonData);
      
      // Validate data structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data format');
      }
      
      // Import each data type if it exists
      if (data.achievements) storage.set(STORAGE_KEYS.ACHIEVEMENTS, data.achievements);
      if (data.resources) storage.set(STORAGE_KEYS.RESOURCES, data.resources);
      if (data.goals) storage.set(STORAGE_KEYS.GOALS, data.goals);
      if (data.tasks) storage.set(STORAGE_KEYS.TASKS, data.tasks);
      if (data.routines) storage.set(STORAGE_KEYS.ROUTINES, data.routines);
      if (data.reminders) storage.set('reminders', data.reminders);
      if (data.reminderPreferences) storage.set('reminder-preferences', data.reminderPreferences);
      if (data.smartSuggestions) storage.set('smart-suggestions', data.smartSuggestions);
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
};