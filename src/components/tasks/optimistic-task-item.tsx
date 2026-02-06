'use client';

import { Task } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InlineLoader } from '@/components/ui/loading-skeleton';

interface OptimisticTaskItemProps {
  task: Task;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isPending?: (id: string) => boolean;
  className?: string;
}

/**
 * Task item component with optimistic update indicators
 * Shows loading state while operations are in progress
 */
export function OptimisticTaskItem({
  task,
  onToggle,
  onDelete,
  isPending,
  className = '',
}: OptimisticTaskItemProps) {
  const isUpdating = isPending?.(task.id) || false;
  const isOverdue = task.dueDate && task.dueDate < new Date().toISOString().split('T')[0] && !task.completed;

  const handleToggle = async () => {
    await onToggle(task.id);
  };

  const handleDelete = async () => {
    await onDelete(task.id);
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 border rounded-lg transition-all',
        isUpdating && 'opacity-60 pointer-events-none',
        task.completed && 'bg-muted/50',
        isOverdue && 'border-destructive',
        className
      )}
    >
      <div className="relative">
        <Checkbox
          checked={task.completed}
          onCheckedChange={handleToggle}
          disabled={isUpdating}
          className={cn(isUpdating && 'opacity-50')}
        />
        {isUpdating && (
          <div className="absolute inset-0 flex items-center justify-center">
            <InlineLoader />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3
          className={cn(
            'font-medium truncate',
            task.completed && 'line-through text-muted-foreground'
          )}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="text-sm text-muted-foreground truncate">
            {task.description}
          </p>
        )}
        {task.dueDate && (
          <div className={cn(
            'flex items-center gap-1 text-xs mt-1',
            isOverdue ? 'text-destructive' : 'text-muted-foreground'
          )}>
            <Clock className="h-3 w-3" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            {isOverdue && <span className="font-medium">(Overdue)</span>}
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={isUpdating}
        className="text-destructive hover:text-destructive"
      >
        {isUpdating ? <InlineLoader /> : <Trash2 className="h-4 w-4" />}
      </Button>
    </div>
  );
}
