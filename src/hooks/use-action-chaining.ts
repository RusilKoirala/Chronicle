'use client';

import { useCallback, useState, useEffect } from 'react';
import { Task, Goal, Routine } from '@/types';

export interface NextStepSuggestion {
  id: string;
  title: string;
  description: string;
  action: () => void;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

interface UseActionChainingProps {
  onTaskComplete?: (taskId: string) => void;
  onGoalComplete?: (goalId: string) => void;
  onRoutineComplete?: (routineId: string) => void;
}

export function useActionChaining({
  onTaskComplete,
  onGoalComplete,
  onRoutineComplete,
}: UseActionChainingProps = {}) {
  const [suggestions, setSuggestions] = useState<NextStepSuggestion[]>([]);
  const [lastAction, setLastAction] = useState<{
    type: 'task' | 'goal' | 'routine';
    entity: Task | Goal | Routine;
  } | null>(null);

  // Generate next-step suggestions based on completed action
  const generateSuggestions = useCallback((
    actionType: 'task' | 'goal' | 'routine',
    entity: Task | Goal | Routine
  ): NextStepSuggestion[] => {
    const suggestions: NextStepSuggestion[] = [];

    if (actionType === 'task') {
      const task = entity as Task;
      
      // Suggest adding another task
      suggestions.push({
        id: 'add-another-task',
        title: 'Add Another Task',
        description: 'Keep the momentum going',
        action: () => {
          window.dispatchEvent(new CustomEvent('open-quick-capture', { 
            detail: { type: 'task' } 
          }));
        },
        priority: 'medium',
        icon: 'plus',
      });

      // If task was routine, suggest completing other routines
      if (task.isRoutine) {
        suggestions.push({
          id: 'complete-other-routines',
          title: 'Complete Other Routines',
          description: 'Check off your daily routines',
          action: () => {
            window.location.href = '/routines';
          },
          priority: 'high',
          icon: 'rotate-ccw',
        });
      }

      // Suggest logging achievement
      suggestions.push({
        id: 'log-achievement',
        title: 'Log an Achievement',
        description: 'Celebrate your progress',
        action: () => {
          window.dispatchEvent(new CustomEvent('open-quick-capture', { 
            detail: { type: 'achievement' } 
          }));
        },
        priority: 'low',
        icon: 'trophy',
      });
    }

    if (actionType === 'goal') {
      const goal = entity as Goal;
      
      if (goal.status === 'completed') {
        // Goal completed - suggest celebration and new goal
        suggestions.push({
          id: 'log-achievement',
          title: 'Log Achievement',
          description: 'Record this milestone',
          action: () => {
            window.dispatchEvent(new CustomEvent('open-quick-capture', { 
              detail: { type: 'achievement' } 
            }));
          },
          priority: 'high',
          icon: 'trophy',
        });

        suggestions.push({
          id: 'set-new-goal',
          title: 'Set New Goal',
          description: 'Keep growing',
          action: () => {
            window.dispatchEvent(new CustomEvent('open-quick-capture', { 
              detail: { type: 'goal' } 
            }));
          },
          priority: 'medium',
          icon: 'target',
        });
      } else {
        // Goal progress updated - suggest adding tasks
        suggestions.push({
          id: 'add-related-task',
          title: 'Add Related Task',
          description: 'Break down the next steps',
          action: () => {
            window.dispatchEvent(new CustomEvent('open-quick-capture', { 
              detail: { type: 'task', goalId: goal.id } 
            }));
          },
          priority: 'high',
          icon: 'plus',
        });

        suggestions.push({
          id: 'view-all-goals',
          title: 'View All Goals',
          description: 'Check your progress',
          action: () => {
            window.location.href = '/goals';
          },
          priority: 'low',
          icon: 'target',
        });
      }
    }

    if (actionType === 'routine') {
      const routine = entity as Routine;
      
      suggestions.push({
        id: 'complete-other-routines',
        title: 'Complete Other Routines',
        description: 'Finish your daily routines',
        action: () => {
          window.location.href = '/routines';
        },
        priority: 'high',
        icon: 'rotate-ccw',
      });

      suggestions.push({
        id: 'view-dashboard',
        title: 'View Dashboard',
        description: 'See your progress',
        action: () => {
          window.location.href = '/dashboard';
        },
        priority: 'medium',
        icon: 'layout-dashboard',
      });
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, []);

  // Track completed action and generate suggestions
  const trackAction = useCallback((
    actionType: 'task' | 'goal' | 'routine',
    entity: Task | Goal | Routine
  ) => {
    setLastAction({ type: actionType, entity });
    const newSuggestions = generateSuggestions(actionType, entity);
    setSuggestions(newSuggestions);
  }, [generateSuggestions]);

  // Clear suggestions
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setLastAction(null);
  }, []);

  // Execute suggestion and clear
  const executeSuggestion = useCallback((suggestionId: string) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (suggestion) {
      suggestion.action();
      clearSuggestions();
    }
  }, [suggestions, clearSuggestions]);

  return {
    suggestions,
    lastAction,
    trackAction,
    clearSuggestions,
    executeSuggestion,
  };
}

// Hook for batch operations on routines
export function useBatchRoutineOperations() {
  const [selectedRoutines, setSelectedRoutines] = useState<string[]>([]);
  const [isBatchMode, setIsBatchMode] = useState(false);

  const toggleRoutineSelection = useCallback((routineId: string) => {
    setSelectedRoutines(prev => 
      prev.includes(routineId)
        ? prev.filter(id => id !== routineId)
        : [...prev, routineId]
    );
  }, []);

  const selectAll = useCallback((routineIds: string[]) => {
    setSelectedRoutines(routineIds);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRoutines([]);
  }, []);

  const toggleBatchMode = useCallback(() => {
    setIsBatchMode(prev => !prev);
    if (isBatchMode) {
      clearSelection();
    }
  }, [isBatchMode, clearSelection]);

  return {
    selectedRoutines,
    isBatchMode,
    toggleRoutineSelection,
    selectAll,
    clearSelection,
    toggleBatchMode,
    hasSelection: selectedRoutines.length > 0,
    selectionCount: selectedRoutines.length,
  };
}
