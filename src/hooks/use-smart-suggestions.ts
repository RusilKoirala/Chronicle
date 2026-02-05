'use client';

import { useState, useEffect, useCallback } from 'react';
import { SmartSuggestion, Goal, Task, Routine } from '@/types';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export function useSmartSuggestions() {
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const data = storage.get<SmartSuggestion>('smart-suggestions');
        setSuggestions(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load suggestions');
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Save to localStorage whenever suggestions change
  useEffect(() => {
    if (!isLoading) {
      try {
        storage.set('smart-suggestions', suggestions);
      } catch (err) {
        setError('Failed to save suggestions');
      }
    }
  }, [suggestions, isLoading]);

  const addSuggestion = useCallback((data: Omit<SmartSuggestion, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSuggestion: SmartSuggestion = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSuggestions(prev => [...prev, newSuggestion]);
    return newSuggestion;
  }, []);

  const deleteSuggestion = useCallback((id: string) => {
    setSuggestions(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearExpiredSuggestions = useCallback(() => {
    const now = new Date().toISOString();
    setSuggestions(prev => prev.filter(suggestion => suggestion.expiresAt > now));
  }, []);

  // Generate smart suggestions based on user data and patterns
  const generateSuggestions = useCallback(async () => {
    try {
      const goals = storage.get<Goal>(STORAGE_KEYS.GOALS);
      const tasks = storage.get<Task>(STORAGE_KEYS.TASKS);
      const routines = storage.get<Routine>(STORAGE_KEYS.ROUTINES);
      
      const newSuggestions: SmartSuggestion[] = [];
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      // Get current suggestions and filter out expired ones
      const currentSuggestions = suggestions.filter(suggestion => suggestion.expiresAt > now.toISOString());

      // Analyze goals for next-action suggestions
      goals.forEach(goal => {
        if (goal.status === 'in-progress' && goal.progress < 100) {
          // Suggest breaking down large goals with low progress
          if (goal.progress < 20) {
            const existingSuggestion = currentSuggestions.find(s => 
              s.type === 'next-action' && 
              s.actionData?.goalId === goal.id
            );
            
            if (!existingSuggestion) {
              newSuggestions.push({
                id: uuidv4(),
                type: 'next-action',
                title: `Break down "${goal.title}" into smaller tasks`,
                description: 'Large goals are easier to achieve when broken into specific, actionable tasks.',
                reasoning: `Goal has ${goal.progress}% progress. Breaking it down will help you make consistent progress.`,
                priority: 'medium',
                estimatedTime: 15,
                points: 25,
                actionData: { goalId: goal.id, action: 'break-down' },
                expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
                createdAt: now.toISOString(),
                updatedAt: now.toISOString()
              });
            }
          }

          // Suggest progress updates for stale goals
          const lastUpdated = new Date(goal.updatedAt);
          const daysSinceUpdate = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysSinceUpdate >= 3) {
            const existingUpdateSuggestion = currentSuggestions.find(s => 
              s.type === 'next-action' && 
              s.actionData?.goalId === goal.id &&
              s.actionData?.action === 'update-progress'
            );
            
            if (!existingUpdateSuggestion) {
              newSuggestions.push({
                id: uuidv4(),
                type: 'next-action',
                title: `Update progress on "${goal.title}"`,
                description: 'Regular progress updates help maintain momentum and track achievements.',
                reasoning: `No progress update for ${daysSinceUpdate} days. Current progress: ${goal.progress}%`,
                priority: 'low',
                estimatedTime: 5,
                points: 10,
                actionData: { goalId: goal.id, action: 'update-progress' },
                expiresAt: tomorrow.toISOString(),
                createdAt: now.toISOString(),
                updatedAt: now.toISOString()
              });
            }
          }
        }
      });

      // Analyze tasks for catch-up suggestions
      const overdueTasks = tasks.filter(task => {
        if (task.completed || !task.dueDate) return false;
        return new Date(task.dueDate) < now;
      });

      if (overdueTasks.length > 0) {
        const existingCatchUpSuggestion = currentSuggestions.find(s => s.type === 'catch-up');
        
        if (!existingCatchUpSuggestion) {
          const urgentTasks = overdueTasks.slice(0, 3); // Focus on top 3
          
          newSuggestions.push({
            id: uuidv4(),
            type: 'catch-up',
            title: `Catch up on ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}`,
            description: 'Focus on completing overdue tasks to get back on track.',
            reasoning: `You have ${overdueTasks.length} overdue tasks. Completing them will reduce stress and improve momentum.`,
            priority: 'high',
            estimatedTime: urgentTasks.length * 20, // Estimate 20 min per task
            points: urgentTasks.length * 15,
            actionData: { 
              taskIds: urgentTasks.map(t => t.id),
              action: 'complete-overdue'
            },
            expiresAt: tomorrow.toISOString(),
            createdAt: now.toISOString(),
            updatedAt: now.toISOString()
          });
        }
      }

      // Analyze routines for optimization suggestions
      const activeRoutines = routines.filter(r => r.isActive);
      const todayRoutines = activeRoutines.filter(r => r.daysOfWeek.includes(now.getDay()));
      
      if (todayRoutines.length === 0 && activeRoutines.length > 0) {
        const existingRoutineSuggestion = currentSuggestions.find(s => 
          s.type === 'optimization' && 
          s.actionData?.action === 'add-routine-today'
        );
        
        if (!existingRoutineSuggestion) {
          newSuggestions.push({
            id: uuidv4(),
            type: 'optimization',
            title: 'Consider adding a routine for today',
            description: 'Consistent daily routines help build positive habits and maintain momentum.',
            reasoning: 'You have active routines but none scheduled for today. Adding one could improve your daily structure.',
            priority: 'low',
            estimatedTime: 10,
            points: 20,
            actionData: { action: 'add-routine-today' },
            expiresAt: tomorrow.toISOString(),
            createdAt: now.toISOString(),
            updatedAt: now.toISOString()
          });
        }
      }

      // Generate motivation suggestions based on recent activity
      const recentCompletedTasks = tasks.filter(task => {
        if (!task.completed) return false;
        const completedDate = new Date(task.updatedAt);
        const daysSinceCompletion = Math.floor((now.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceCompletion <= 7;
      });

      if (recentCompletedTasks.length >= 3) {
        const existingMotivationSuggestion = currentSuggestions.find(s => s.type === 'motivation');
        
        if (!existingMotivationSuggestion) {
          newSuggestions.push({
            id: uuidv4(),
            type: 'motivation',
            title: `Great momentum! You've completed ${recentCompletedTasks.length} tasks this week`,
            description: 'Your consistency is paying off. Consider setting a new challenging goal to maintain this momentum.',
            reasoning: `Completed ${recentCompletedTasks.length} tasks in the last 7 days. This shows strong commitment and progress.`,
            priority: 'medium',
            estimatedTime: 10,
            points: 30,
            actionData: { 
              completedCount: recentCompletedTasks.length,
              action: 'celebrate-and-plan'
            },
            expiresAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
            createdAt: now.toISOString(),
            updatedAt: now.toISOString()
          });
        }
      }

      // Add new suggestions to state, combining with filtered current suggestions
      if (newSuggestions.length > 0) {
        setSuggestions([...currentSuggestions, ...newSuggestions]);
      } else if (currentSuggestions.length !== suggestions.length) {
        // Only update if we filtered out expired suggestions
        setSuggestions(currentSuggestions);
      }

    } catch (err) {
      setError('Failed to generate suggestions');
      console.error('Suggestion generation error:', err);
    }
  }, []); // Remove suggestions dependency to avoid infinite loop

  const getActiveSuggestions = useCallback(() => {
    const now = new Date().toISOString();
    return suggestions.filter(suggestion => suggestion.expiresAt > now);
  }, [suggestions]);

  const getSuggestionsByType = useCallback((type: SmartSuggestion['type']) => {
    return getActiveSuggestions().filter(suggestion => suggestion.type === type);
  }, [getActiveSuggestions]);

  const getSuggestionsByPriority = useCallback((priority: SmartSuggestion['priority']) => {
    return getActiveSuggestions().filter(suggestion => suggestion.priority === priority);
  }, [getActiveSuggestions]);

  return {
    suggestions: getActiveSuggestions(),
    allSuggestions: suggestions,
    isLoading,
    error,
    addSuggestion,
    deleteSuggestion,
    clearExpiredSuggestions,
    generateSuggestions,
    getSuggestionsByType,
    getSuggestionsByPriority
  };
}