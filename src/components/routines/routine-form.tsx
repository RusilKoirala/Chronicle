'use client';

import { useState } from 'react';
import { Routine } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

interface RoutineFormProps {
  routine?: Routine;
  onSubmit: (data: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' }
];

export function RoutineForm({ routine, onSubmit, onCancel }: RoutineFormProps) {
  const [title, setTitle] = useState(routine?.title || '');
  const [time, setTime] = useState(routine?.time || '09:00');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(routine?.daysOfWeek || []);
  const [isActive, setIsActive] = useState(routine?.isActive ?? true);

  const handleDayToggle = (dayValue: number) => {
    setDaysOfWeek(prev => 
      prev.includes(dayValue)
        ? prev.filter(day => day !== dayValue)
        : [...prev, dayValue].sort()
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || daysOfWeek.length === 0) return;

    onSubmit({
      title: title.trim(),
      time,
      daysOfWeek,
      isActive
    });
  };

  const selectAllDays = () => {
    setDaysOfWeek(DAYS_OF_WEEK.map(day => day.value));
  };

  const clearAllDays = () => {
    setDaysOfWeek([]);
  };

  const selectWeekdays = () => {
    setDaysOfWeek([1, 2, 3, 4, 5]); // Monday to Friday
  };

  const selectWeekends = () => {
    setDaysOfWeek([0, 6]); // Sunday and Saturday
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter routine title..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="time">Time *</Label>
        <Input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Days of Week *</Label>
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={selectWeekdays}
              className="text-xs"
            >
              Weekdays
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={selectWeekends}
              className="text-xs"
            >
              Weekends
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={selectAllDays}
              className="text-xs"
            >
              All
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearAllDays}
              className="text-xs"
            >
              Clear
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day.value} className="flex items-center space-x-2">
              <Checkbox
                id={`day-${day.value}`}
                checked={daysOfWeek.includes(day.value)}
                onCheckedChange={() => handleDayToggle(day.value)}
              />
              <Label htmlFor={`day-${day.value}`} className="text-sm">
                {day.label}
              </Label>
            </div>
          ))}
        </div>
        
        {daysOfWeek.length === 0 && (
          <p className="text-sm text-destructive">Please select at least one day</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="isActive">Active</Label>
        <Switch
          id="isActive"
          checked={isActive}
          onCheckedChange={setIsActive}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button 
          type="submit" 
          className="flex-1"
          disabled={!title.trim() || daysOfWeek.length === 0}
        >
          {routine ? 'Update Routine' : 'Add Routine'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}