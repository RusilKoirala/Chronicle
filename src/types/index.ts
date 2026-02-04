// TypeScript interfaces for Chronicle Personal Tracker App

export interface Achievement {
  id: string;                    // UUID v4
  type: 'book' | 'certificate' | 'skill' | 'other';
  title: string;
  description?: string;
  dateCompleted: string;         // ISO date string
  tags: string[];
  proofUrl?: string;
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}

export interface Resource {
  id: string;
  type: 'note' | 'link' | 'file' | 'other';
  title: string;
  content: string;
  url?: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate?: string;           // ISO date string
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;              // 0-100
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;              // ISO date string
  completed: boolean;
  isRoutine: boolean;
  reminderTime?: string;         // HH:MM format (for future)
  createdAt: string;
  updatedAt: string;
}

export interface Routine {
  id: string;
  title: string;
  daysOfWeek: number[];          // 0-6 where 0=Sunday, 6=Saturday
  time: string;                  // HH:MM format (24-hour)
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Storage structure for future use
export interface AppData {
  achievements: Achievement[];
  resources: Resource[];
  goals: Goal[];
  tasks: Task[];
  routines: Routine[];
  version: string; // For future migrations
}