// TypeScript interfaces for Chronicle Personal Tracker App

// Base entity interface
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// User Profile
export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Achievement types
export type AchievementType = 'book' | 'certificate' | 'skill' | 'other';

export interface Achievement extends BaseEntity {
  type: AchievementType;
  title: string;
  description?: string;
  dateCompleted: string;         // ISO date string
  tags: string[];
  proofUrl?: string;
}

// Resource types
export type ResourceType = 'note' | 'link' | 'file' | 'other';

export interface Resource extends BaseEntity {
  type: ResourceType;
  title: string;
  content: string;
  url?: string;
  category: string;
  tags: string[];
}

// Goal types
export type GoalStatus = 'not-started' | 'in-progress' | 'completed';

export interface Goal extends BaseEntity {
  title: string;
  description?: string;
  targetDate?: string;           // ISO date string
  status: GoalStatus;
  progress: number;              // 0-100
}

// Task types
export interface Task extends BaseEntity {
  title: string;
  description?: string;
  dueDate?: string;              // ISO date string
  completed: boolean;
  isRoutine: boolean;
  reminderTime?: string;         // HH:MM format
}

// Routine types
export interface Routine extends BaseEntity {
  title: string;
  daysOfWeek: number[];          // 0-6 where 0=Sunday, 6=Saturday
  time: string;                  // HH:MM format (24-hour)
  isActive: boolean;
}

// Hook return types
export interface BaseHookReturn<T> {
  items: T[];
  isLoading: boolean;
  error: string | null;
}

export interface AchievementHookReturn extends BaseHookReturn<Achievement> {
  achievements: Achievement[];
  addAchievement: (achievement: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Achievement | undefined> | void;
  updateAchievement: (id: string, updates: Partial<Achievement>) => Promise<Achievement | undefined> | void;
  deleteAchievement: (id: string) => Promise<void> | void;
  getAchievementsByType: (type: AchievementType) => Achievement[];
  searchAchievements: (query: string) => Achievement[];
  refetch?: () => Promise<void>;
}

export interface ResourceHookReturn extends BaseHookReturn<Resource> {
  resources: Resource[];
  addResource: (resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Resource | undefined> | void;
  updateResource: (id: string, updates: Partial<Resource>) => Promise<Resource | undefined> | void;
  deleteResource: (id: string) => Promise<void> | void;
  getResourcesByType: (type: ResourceType) => Resource[];
  getResourcesByCategory: (category: string) => Resource[];
  searchResources: (query: string) => Resource[];
  refetch?: () => Promise<void>;
}

export interface GoalHookReturn extends BaseHookReturn<Goal> {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Goal | undefined> | void;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<Goal | undefined> | void;
  deleteGoal: (id: string) => Promise<void> | void;
  updateProgress: (id: string, progress: number) => Promise<Goal | undefined> | void;
  getGoalsByStatus: (status: GoalStatus) => Goal[];
  searchGoals: (query: string) => Goal[];
  refetch?: () => Promise<void>;
}

export interface TaskHookReturn extends BaseHookReturn<Task> {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task | undefined> | void;
  updateTask: (id: string, updates: Partial<Task>) => Promise<Task | undefined> | void;
  deleteTask: (id: string) => Promise<void> | void;
  toggleComplete: (id: string) => Promise<Task | undefined> | void;
  toggleTask?: (id: string) => Promise<Task | undefined> | void; // Alias for Supabase compatibility
  getActiveTasks: () => Task[];
  getCompletedTasks: () => Task[];
  getRoutineTasks: () => Task[];
  searchTasks: (query: string) => Task[];
  getTasksDueToday: () => Task[];
  getOverdueTasks: () => Task[];
  refetch?: () => Promise<void>;
}

export interface RoutineHookReturn extends BaseHookReturn<Routine> {
  routines: Routine[];
  addRoutine: (routine: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Routine | undefined> | void;
  updateRoutine: (id: string, updates: Partial<Routine>) => Promise<Routine | undefined> | void;
  deleteRoutine: (id: string) => Promise<void> | void;
  toggleActive: (id: string) => Promise<Routine | undefined> | void;
  toggleRoutine?: (id: string) => Promise<Routine | undefined> | void; // Alias for Supabase compatibility
  getActiveRoutines: () => Routine[];
  getInactiveRoutines: () => Routine[];
  getRoutinesForDay: (dayOfWeek: number) => Routine[];
  getTodaysRoutines: () => Routine[];
  searchRoutines: (query: string) => Routine[];
  getDayName: (dayIndex: number) => string;
  formatDaysOfWeek: (daysOfWeek: number[]) => string;
  refetch?: () => Promise<void>;
}

// Data migration types
export interface MigrationResult {
  total: number;
  migrated: number;
  errors: string[];
}

export interface MigrationStatus {
  achievements: MigrationResult;
  resources: MigrationResult;
  goals: MigrationResult;
  tasks: MigrationResult;
  routines: MigrationResult;
}

export interface DataMigrationHookReturn {
  migrateData: () => Promise<void>;
  hasLocalData: boolean;
  clearLocalData: () => void;
  isLoading: boolean;
  status: MigrationStatus | null;
  error: string | null;
}

// Auth types
export interface User {
  id: string;
  email: string;
  [key: string]: any; // For additional Supabase user properties
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signInWithGitHub: () => Promise<any>;
  signOut: () => Promise<void>;
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

// Form types
export type AchievementFormData = Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>;
export type ResourceFormData = Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>;
export type GoalFormData = Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>;
export type TaskFormData = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
export type RoutineFormData = Omit<Routine, 'id' | 'createdAt' | 'updatedAt'>;

// Component prop types
export interface EntityCardProps<T> {
  item: T;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
}

export interface EntityFormProps<T> {
  item?: T;
  onSubmit: (data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

// Specific component prop types
export interface GoalCardProps extends EntityCardProps<Goal> {
  onUpdateProgress: (id: string, progress: number) => void;
}

export interface TaskCardProps extends EntityCardProps<Task> {
  onToggleComplete: (id: string) => void;
}

export interface RoutineCardProps extends EntityCardProps<Routine> {
  onToggleActive: (id: string) => void;
}