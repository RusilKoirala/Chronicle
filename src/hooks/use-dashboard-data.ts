'use client';

import { useMemo } from 'react';
import { useHybridTasks } from './use-hybrid-tasks';
import { useHybridGoals } from './use-hybrid-goals';
import { useHybridRoutines } from './use-hybrid-routines';
import { Task, Goal, Routine } from '@/types';

export interface DashboardStats {
  totalPoints: number;
  todayPoints: number;
  currentStreak: number;
  completionRate: number;
}

export interface SmartSuggestion {
  id: string;
  type: 'task' | 'goal' | 'routine';
  title: string;
  description: string;
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number; // minutes
  actionData: any;
}

export interface TodaysFocus {
  overdueItems: Task[];
  scheduledTasks: Task[];
  activeRoutines: Routine[];
  goalProgress: Array<Goal & { progressChange: number }>;
  suggestedActions: SmartSuggestion[];
}

export interface DashboardData {
  todaysFocus: TodaysFocus;
  stats: DashboardStats;
  isLoading: boolean;
}

export function useDashboardData(): DashboardData {
  const { 
    tasks, 
    getOverdueTasks, 
    getTasksDueToday, 
    getActiveTasks,
    isLoading: tasksLoading 
  } = useHybridTasks();
  
  const { 
    goals, 
    getGoalsByStatus,
    isLoading: goalsLoading 
  } = useHybridGoals();
  
  const { 
    routines, 
    getTodaysRoutines, 
    getActiveRoutines,
    isLoading: routinesLoading 
  } = useHybridRoutines();

  const isLoading = tasksLoading || goalsLoading || routinesLoading;

  const dashboardData = useMemo(() => {
    if (isLoading) {
      return {
        todaysFocus: {
          overdueItems: [],
          scheduledTasks: [],
          activeRoutines: [],
          goalProgress: [],
          suggestedActions: []
        },
        stats: {
          totalPoints: 0,
          todayPoints: 0,
          currentStreak: 0,
          completionRate: 0
        },
        isLoading: true
      };
    }

    // Get today's focus data
    const overdueItems = getOverdueTasks();
    const scheduledTasks = getTasksDueToday();
    const activeRoutines = getTodaysRoutines();
    
    // Calculate goal progress with change indicators
    const inProgressGoals = getGoalsByStatus('in-progress');
    const goalProgress = inProgressGoals.map(goal => ({
      ...goal,
      progressChange: calculateProgressChange(goal) // Placeholder for now
    }));

    // Generate smart suggestions based on user patterns
    const suggestedActions = generateSmartSuggestions(
      overdueItems,
      scheduledTasks,
      inProgressGoals,
      activeRoutines
    );

    // Calculate stats
    const stats = calculateDashboardStats(tasks, goals, routines);

    return {
      todaysFocus: {
        overdueItems,
        scheduledTasks,
        activeRoutines,
        goalProgress,
        suggestedActions
      },
      stats,
      isLoading: false
    };
  }, [
    tasks, 
    goals, 
    routines, 
    isLoading,
    getOverdueTasks,
    getTasksDueToday,
    getTodaysRoutines,
    getGoalsByStatus
  ]);

  return dashboardData;
}

// Helper function to calculate progress change (placeholder implementation)
function calculateProgressChange(goal: Goal): number {
  // In a real implementation, this would compare with historical data
  // For now, return a random change to demonstrate the concept
  return Math.floor(Math.random() * 21) - 10; // -10 to +10
}

// Helper function to generate smart suggestions
function generateSmartSuggestions(
  overdueItems: Task[],
  scheduledTasks: Task[],
  inProgressGoals: Goal[],
  activeRoutines: Routine[]
): SmartSuggestion[] {
  const suggestions: SmartSuggestion[] = [];

  // Suggest handling overdue items first (high priority)
  if (overdueItems.length > 0) {
    const oldestOverdue = overdueItems.sort((a, b) => 
      new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime()
    )[0];
    
    suggestions.push({
      id: `overdue-${oldestOverdue.id}`,
      type: 'task',
      title: `Complete overdue task: ${oldestOverdue.title}`,
      description: 'This task is overdue and should be prioritized',
      reasoning: 'Overdue tasks can create stress and block progress on other goals',
      priority: 'high',
      estimatedTime: 15,
      actionData: { taskId: oldestOverdue.id, action: 'complete' }
    });
  }

  // Suggest working on goals that are behind schedule (medium priority)
  const behindScheduleGoals = inProgressGoals.filter(goal => {
    if (!goal.targetDate) return false;
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const totalDays = Math.ceil((targetDate.getTime() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((today.getTime() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    const expectedProgress = (daysPassed / totalDays) * 100;
    return goal.progress < expectedProgress - 10; // 10% tolerance
  });

  if (behindScheduleGoals.length > 0) {
    const mostBehindGoal = behindScheduleGoals[0];
    suggestions.push({
      id: `behind-goal-${mostBehindGoal.id}`,
      type: 'goal',
      title: `Focus on goal: ${mostBehindGoal.title}`,
      description: 'This goal is behind schedule and needs attention',
      reasoning: 'Staying on track with goals prevents last-minute rushes',
      priority: 'medium',
      estimatedTime: 30,
      actionData: { goalId: mostBehindGoal.id, action: 'work_on' }
    });
  }

  // Suggest completing today's routines (medium priority)
  if (activeRoutines.length > 0) {
    suggestions.push({
      id: `routines-today`,
      type: 'routine',
      title: `Complete ${activeRoutines.length} routine${activeRoutines.length > 1 ? 's' : ''} today`,
      description: 'Maintaining routines builds consistency and momentum',
      reasoning: 'Regular routines create positive habits and structure',
      priority: 'medium',
      estimatedTime: activeRoutines.length * 10,
      actionData: { routines: activeRoutines.map(r => r.id), action: 'complete_all' }
    });
  }

  // Suggest creating tasks for goals without recent activity (low priority)
  const staleGoals = inProgressGoals.filter(goal => {
    const lastUpdate = new Date(goal.updatedAt);
    const daysSinceUpdate = Math.ceil((new Date().getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceUpdate > 7; // No activity for a week
  });

  if (staleGoals.length > 0) {
    const staleGoal = staleGoals[0];
    suggestions.push({
      id: `stale-goal-${staleGoal.id}`,
      type: 'task',
      title: `Break down goal: ${staleGoal.title}`,
      description: 'Create specific tasks to make progress on this goal',
      reasoning: 'Goals without recent activity may need to be broken into smaller tasks',
      priority: 'low',
      estimatedTime: 10,
      actionData: { goalId: staleGoal.id, action: 'create_tasks' }
    });
  }

  // Limit to top 3 suggestions
  return suggestions.slice(0, 3);
}

// Helper function to calculate dashboard statistics
function calculateDashboardStats(
  tasks: Task[],
  goals: Goal[],
  routines: Routine[]
): DashboardStats {
  // Calculate completion rate based on tasks completed today
  const today = new Date().toISOString().split('T')[0];
  const tasksCompletedToday = tasks.filter(task => 
    task.completed && task.updatedAt.startsWith(today)
  ).length;
  
  const totalTasksToday = tasks.filter(task => 
    task.dueDate?.startsWith(today) || task.updatedAt.startsWith(today)
  ).length;
  
  const completionRate = totalTasksToday > 0 ? (tasksCompletedToday / totalTasksToday) * 100 : 0;

  // Calculate points (simple implementation)
  const totalPoints = calculateTotalPoints(tasks, goals);
  const todayPoints = calculateTodayPoints(tasks, goals);
  
  // Calculate streak (placeholder - would need historical data)
  const currentStreak = calculateCurrentStreak(tasks);

  return {
    totalPoints,
    todayPoints,
    currentStreak,
    completionRate: Math.round(completionRate)
  };
}

// Helper function to calculate total points
function calculateTotalPoints(tasks: Task[], goals: Goal[]): number {
  const taskPoints = tasks.filter(t => t.completed).length * 10;
  const goalPoints = goals.filter(g => g.status === 'completed').length * 50;
  return taskPoints + goalPoints;
}

// Helper function to calculate today's points
function calculateTodayPoints(tasks: Task[], goals: Goal[]): number {
  const today = new Date().toISOString().split('T')[0];
  
  const taskPoints = tasks.filter(task => 
    task.completed && task.updatedAt.startsWith(today)
  ).length * 10;
  
  const goalPoints = goals.filter(goal => 
    goal.status === 'completed' && goal.updatedAt.startsWith(today)
  ).length * 50;
  
  return taskPoints + goalPoints;
}

// Helper function to calculate current streak
function calculateCurrentStreak(tasks: Task[]): number {
  // Simplified streak calculation - count consecutive days with completed tasks
  const completedTasks = tasks.filter(t => t.completed).sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  
  if (completedTasks.length === 0) return 0;
  
  let streak = 0;
  let currentDate = new Date();
  
  for (let i = 0; i < 30; i++) { // Check last 30 days
    const dateStr = currentDate.toISOString().split('T')[0];
    const hasTasksOnDate = completedTasks.some(task => 
      task.updatedAt.startsWith(dateStr)
    );
    
    if (hasTasksOnDate) {
      streak++;
    } else if (streak > 0) {
      break; // Streak is broken
    }
    
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return streak;
}