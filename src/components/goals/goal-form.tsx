'use client';

import { Goal } from '@/types';
import { Button } from '@/components/ui/button';
import { SmartInput } from '@/components/ui/smart-input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, AlertCircle } from 'lucide-react';
import { format, addMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { useSmartForm } from '@/hooks/use-smart-form';

interface GoalFormProps {
  goal?: Goal;
  onSubmit: (data: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

interface GoalFormValues {
  title: string;
  description: string;
  status: Goal['status'];
  progress: number;
  targetDate?: Date;
}

export function GoalForm({ goal, onSubmit, onCancel }: GoalFormProps) {
  const formId = goal ? `goal-edit-${goal.id}` : 'goal-create';
  
  // Smart defaults
  const smartDefaults = {
    title: () => '',
    description: () => '',
    status: () => 'not-started' as Goal['status'],
    progress: () => 0,
    targetDate: () => {
      // Default to 3 months from now for new goals
      return addMonths(new Date(), 3);
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
  } = useSmartForm<GoalFormValues>({
    formId,
    initialValues: goal ? {
      title: goal.title,
      description: goal.description || '',
      status: goal.status,
      progress: goal.progress,
      targetDate: goal.targetDate ? new Date(goal.targetDate) : undefined,
    } : undefined,
    onSubmit: async (formValues) => {
      onSubmit({
        title: formValues.title.trim(),
        description: formValues.description?.trim() || undefined,
        status: formValues.status,
        progress: formValues.progress,
        targetDate: formValues.targetDate?.toISOString().split('T')[0],
      });
    },
    enableDraftSaving: !goal,
    enableAutocomplete: true,
    smartDefaults,
  });
  
  const titleSuggestions = getFieldSuggestions('title', values.title);

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {/* Draft notification */}
      {hasDraft && !goal && (
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
          placeholder="Enter goal title..."
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
          placeholder="Describe your goal..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select 
          value={values.status} 
          onValueChange={(value: Goal['status']) => setValue('status', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not-started">Not Started</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Progress: {values.progress || 0}%</Label>
        <Slider
          value={[values.progress || 0]}
          onValueChange={(value) => setValue('progress', value[0])}
          max={100}
          step={5}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Target Date (Optional)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !values.targetDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {values.targetDate ? format(values.targetDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={values.targetDate}
              onSelect={(date) => setValue('targetDate', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {values.targetDate && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setValue('targetDate', undefined)}
          >
            Clear date
          </Button>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {goal ? 'Update Goal' : 'Add Goal'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}