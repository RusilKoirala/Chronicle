'use client';

import { useState } from 'react';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { InlineEdit } from '@/components/ui/inline-edit';
import { Pencil, Trash2, Calendar, Repeat } from 'lucide-react';
import { format, isToday, isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import { useContextualActions } from '@/hooks/use-contextual-actions';
import { QuickActions } from '@/components/ui/contextual-actions-menu';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onReschedule?: (id: string, newDate: string) => void;
  onUpdateTitle?: (id: string, title: string) => void;
  onUpdateDescription?: (id: string, description: string) => void;
  enableInlineEdit?: boolean;
}

export function TaskItem({ 
  task, 
  onEdit, 
  onDelete, 
  onToggleComplete, 
  onReschedule,
  onUpdateTitle,
  onUpdateDescription,
  enableInlineEdit = true,
}: TaskItemProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !task.completed;
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  const { actions } = useContextualActions({
    entity: task,
    entityType: 'task',
    onComplete: onToggleComplete,
    onReschedule,
    onEdit,
  });
  
  const handleTitleSave = async (newTitle: string) => {
    if (onUpdateTitle && newTitle.trim() !== task.title) {
      await onUpdateTitle(task.id, newTitle.trim());
    }
  };
  
  const handleDescriptionSave = async (newDescription: string) => {
    if (onUpdateDescription && newDescription.trim() !== (task.description || '')) {
      await onUpdateDescription(task.id, newDescription.trim());
    }
  };

  return (
    <div className={cn(
      "flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors",
      task.completed && "opacity-60"
    )}>
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggleComplete(task.id)}
        className="mt-0.5"
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {enableInlineEdit && onUpdateTitle ? (
            <InlineEdit
              value={task.title}
              onSave={handleTitleSave}
              placeholder="Task title"
              required
              displayClassName={cn(
                "font-medium",
                task.completed && "line-through text-muted-foreground"
              )}
              editOnClick={false}
              showEditIcon={true}
            />
          ) : (
            <h3 className={cn(
              "font-medium",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
          )}
          
          {task.isRoutine && (
            <Badge variant="secondary" className="text-xs">
              <Repeat className="h-3 w-3 mr-1" />
              Routine
            </Badge>
          )}
          
          {isOverdue && (
            <Badge variant="destructive" className="text-xs">
              Overdue
            </Badge>
          )}
          
          {isDueToday && !task.completed && (
            <Badge variant="default" className="text-xs">
              Due Today
            </Badge>
          )}
        </div>
        
        {(task.description || (enableInlineEdit && onUpdateDescription)) && (
          enableInlineEdit && onUpdateDescription ? (
            <div className="mb-2">
              <InlineEdit
                value={task.description || ''}
                onSave={handleDescriptionSave}
                placeholder="Add description..."
                multiline
                displayClassName={cn(
                  "text-sm text-muted-foreground",
                  task.completed && "line-through"
                )}
                editOnClick={false}
                showEditIcon={true}
              />
            </div>
          ) : task.description ? (
            <p className={cn(
              "text-sm text-muted-foreground mb-2",
              task.completed && "line-through"
            )}>
              {task.description}
            </p>
          ) : null
        )}
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span className={cn(
                isOverdue && "text-destructive",
                isDueToday && "text-primary font-medium"
              )}>
                {format(new Date(task.dueDate), 'MMM dd, yyyy')}
              </span>
            </div>
          )}
          
          <span>
            Created {format(new Date(task.createdAt), 'MMM dd')}
          </span>
        </div>
      </div>
      
      <div className="flex gap-2">
        {/* Show contextual quick actions for overdue/important tasks */}
        {(isOverdue || isDueToday) && actions.length > 0 && (
          <QuickActions actions={actions} maxVisible={2} />
        )}
        
        {/* Standard edit/delete actions */}
        {(!isOverdue && !isDueToday) && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(task)}
              className="h-8 w-8"
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </>
        )}
        
        {/* Always show delete for overdue tasks in menu */}
        {(isOverdue || isDueToday) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}