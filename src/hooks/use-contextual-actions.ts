'use client';

import { useCallback, useMemo } from 'react';
import { Task, Goal } from '@/types';
import { isPast, isToday, addDays, format } from 'date-fns';

export interface ContextualAction {
  id: string;
  label: string;
  icon: string;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'destructive';
  onClick: () => void;
  priority: number;
}

interface UseContextualActionsProps {
  entity?: Task | Goal;
  entityType?: 'task' | 'goal';
  onReschedule?: (id: string, newDate: string) => void;
  onComplete?: (id: string) => void;
  onUpdateProgress?: (id: string, progress: number) => void;
  onAddRelatedTask?: (goalId: string) => void;
  onEdit?: (entity: any) => void;
}

export function useContextualActions({
  entity,
  entityType,
  onReschedule,
  onComplete,
  onUpdateProgress,
  onAddRelatedTask,
  onEdit,
}: UseContextualActionsProps) {
  
  const getTaskActions = useCallback((task: Task): ContextualAction[] => {
    const actions: ContextualAction[] = [];
    const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !task.completed;
    const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

    // Complete action (highest priority for incomplete tasks)
    if (!task.completed) {
      actions.push({
        id: 'complete',
        label: 'Complete',
        icon: 'check',
        variant: 'success',
        onClick: () => onComplete?.(task.id),
        priority: 1,
      });
    }

    // Reschedule action for overdue tasks
    if (isOverdue && onReschedule) {
      actions.push({
        id: 'reschedule-tomorrow',
        label: 'Reschedule to Tomorrow',
        icon: 'calendar',
        variant: 'warning',
        onClick: () => {
          const tomorrow = addDays(new Date(), 1).toISOString().split('T')[0];
          onReschedule(task.id, tomorrow);
        },
        priority: 2,
      });

      actions.push({
        id: 'reschedule-week',
        label: 'Reschedule to Next Week',
        icon: 'calendar',
        variant: 'secondary',
        onClick: () => {
          const nextWeek = addDays(new Date(), 7).toISOString().split('T')[0];
          onReschedule(task.id, nextWeek);
        },
        priority: 3,
      });
    }

    // Edit action
    if (onEdit) {
      actions.push({
        id: 'edit',
        label: 'Edit Details',
        icon: 'pencil',
        variant: 'default',
        onClick: () => onEdit(task),
        priority: 4,
      });
    }

    // Mark as incomplete (for completed tasks)
    if (task.completed && onComplete) {
      actions.push({
        id: 'reopen',
        label: 'Mark Incomplete',
        icon: 'rotate-ccw',
        variant: 'secondary',
        onClick: () => onComplete(task.id),
        priority: 1,
      });
    }

    return actions.sort((a, b) => a.priority - b.priority);
  }, [onComplete, onReschedule, onEdit]);

  const getGoalActions = useCallback((goal: Goal): ContextualAction[] => {
    const actions: ContextualAction[] = [];

    // Add related task action
    if (onAddRelatedTask && goal.status !== 'completed') {
      actions.push({
        id: 'add-task',
        label: 'Add Related Task',
        icon: 'plus',
        variant: 'primary',
        onClick: () => onAddRelatedTask(goal.id),
        priority: 1,
      });
    }

    // Quick progress updates
    if (onUpdateProgress && goal.status !== 'completed') {
      if (goal.progress < 25) {
        actions.push({
          id: 'progress-25',
          label: 'Set to 25%',
          icon: 'trending-up',
          variant: 'secondary',
          onClick: () => onUpdateProgress(goal.id, 25),
          priority: 2,
        });
      }

      if (goal.progress < 50) {
        actions.push({
          id: 'progress-50',
          label: 'Set to 50%',
          icon: 'trending-up',
          variant: 'secondary',
          onClick: () => onUpdateProgress(goal.id, 50),
          priority: 3,
        });
      }

      if (goal.progress < 75) {
        actions.push({
          id: 'progress-75',
          label: 'Set to 75%',
          icon: 'trending-up',
          variant: 'secondary',
          onClick: () => onUpdateProgress(goal.id, 75),
          priority: 4,
        });
      }

      if (goal.progress >= 75) {
        actions.push({
          id: 'complete-goal',
          label: 'Mark Complete',
          icon: 'check-circle',
          variant: 'success',
          onClick: () => onUpdateProgress(goal.id, 100),
          priority: 1,
        });
      }
    }

    // Edit action
    if (onEdit) {
      actions.push({
        id: 'edit',
        label: 'Edit Details',
        icon: 'pencil',
        variant: 'default',
        onClick: () => onEdit(goal),
        priority: 5,
      });
    }

    return actions.sort((a, b) => a.priority - b.priority);
  }, [onAddRelatedTask, onUpdateProgress, onEdit]);

  const actions = useMemo(() => {
    if (!entity || !entityType) return [];

    if (entityType === 'task') {
      return getTaskActions(entity as Task);
    } else if (entityType === 'goal') {
      return getGoalActions(entity as Goal);
    }

    return [];
  }, [entity, entityType, getTaskActions, getGoalActions]);

  return {
    actions,
    primaryAction: actions[0],
    secondaryActions: actions.slice(1),
  };
}
