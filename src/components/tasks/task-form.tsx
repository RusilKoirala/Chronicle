'use client';

import { useEffect } from 'react';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { SmartInput } from '@/components/ui/smart-input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, AlertCircle } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { useSmartForm } from '@/hooks/use-smart-form';
import { getMobileInputType } from '@/lib/form-utils';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

interface TaskFormValues {
  title: string;
  description: string;
  completed: boolean;
  isRoutine: boolean;
  dueDate?: Date;
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const formId = task ? `task-edit-${task.id}` : 'task-create';
  
  // Smart defaults based on context
  const smartDefaults = {
    title: () => '',
    description: () => '',
    completed: () => false,
    isRoutine: () => false,
    dueDate: () => {
      // Default to tomorrow for new tasks
      const hour = new Date().getHours();
      if (hour >= 18) {
        // After 6 PM, default to tomorrow
        return addDays(new Date(), 1);
      }
      return undefined;
    },
  };
  
  const {
    values,
    setValue,
    handleSubmit: handleFormSubmit,
    getFieldSuggestions,
    hasDraft,
    loadDraftValues,
    clearDraftValues,
  } = useSmartForm<TaskFormValues>({
    formId,
    initialValues: task ? {
      title: task.title,
      description: task.description || '',
      completed: task.completed,
      isRoutine: task.isRoutine,
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    } : undefined,
    onSubmit: async (formValues) => {
      onSubmit({
        title: formValues.title.trim(),
        description: formValues.description?.trim() || undefined,
        completed: formValues.completed,
        isRoutine: formValues.isRoutine,
        dueDate: formValues.dueDate?.toISOString().split('T')[0],
      });
    },
    enableDraftSaving: !task, // Only enable draft saving for new tasks
    enableAutocomplete: true,
    smartDefaults,
  });
  
  const titleSuggestions = getFieldSuggestions('title', values.title);
  const descriptionSuggestions = getFieldSuggestions('description', values.description);

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {/* Draft notification */}
      {hasDraft && !task && (
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="flex-1 text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-100">Draft found</p>
            <p className="text-blue-700 dark:text-blue-300">You have unsaved changes from before.</p>
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={loadDraftValues}
                className="h-7 text-xs"
              >
                Load Draft
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={clearDraftValues}
                className="h-7 text-xs"
              >
                Discard
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <SmartInput
          id="title"
          value={values.title || ''}
          onChange={(e) => setValue('title', e.target.value)}
          onSuggestionSelect={(value) => setValue('title', value)}
          suggestions={titleSuggestions}
          placeholder="Enter task title..."
          required
          autoComplete="off"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={values.description || ''}
          onChange={(e) => setValue('description', e.target.value)}
          placeholder="Add task details..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Due Date (Optional)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !values.dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {values.dueDate ? format(values.dueDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={values.dueDate}
              onSelect={(date) => setValue('dueDate', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {values.dueDate && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setValue('dueDate', undefined)}
          >
            Clear date
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="completed"
            checked={values.completed || false}
            onCheckedChange={(checked) => setValue('completed', checked as boolean)}
          />
          <Label htmlFor="completed">Mark as completed</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isRoutine"
            checked={values.isRoutine || false}
            onCheckedChange={(checked) => setValue('isRoutine', checked as boolean)}
          />
          <Label htmlFor="isRoutine">This is a routine task</Label>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {task ? 'Update Task' : 'Add Task'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}