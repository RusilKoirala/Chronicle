'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useReminderPreferences } from '@/hooks/use-reminder-preferences';

export function ReminderPreferences() {
  const { 
    preferences, 
    isLoading, 
    error, 
    updatePreferences, 
    resetToDefaults 
  } = useReminderPreferences();

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-red-600">
          <p>Error loading preferences: {error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-2"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  if (!preferences) {
    return (
      <Card className="p-6">
        <p>No preferences found.</p>
      </Card>
    );
  }

  const handleToggle = (key: keyof typeof preferences, value: boolean) => {
    updatePreferences({ [key]: value });
  };

  const handleTimeChange = (key: keyof typeof preferences, value: string) => {
    updatePreferences({ [key]: value });
  };

  const handleNumberChange = (key: keyof typeof preferences, value: number) => {
    updatePreferences({ [key]: value });
  };

  const handleIntervalChange = (intervalType: keyof typeof preferences.reminderIntervals, value: number | number[]) => {
    updatePreferences({
      reminderIntervals: {
        ...preferences.reminderIntervals,
        [intervalType]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Reminder Preferences</h2>
          <Button 
            onClick={resetToDefaults}
            variant="outline"
            size="sm"
          >
            Reset to Defaults
          </Button>
        </div>

        {/* Reminder Types */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-medium">Reminder Types</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="goal-deadlines">Goal Deadline Reminders</Label>
              <p className="text-sm text-gray-600">Get notified before goal deadlines</p>
            </div>
            <Switch
              id="goal-deadlines"
              checked={preferences.goalDeadlineReminders}
              onCheckedChange={(checked) => handleToggle('goalDeadlineReminders', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="routine-reminders">Routine Reminders</Label>
              <p className="text-sm text-gray-600">Get notified about scheduled routines</p>
            </div>
            <Switch
              id="routine-reminders"
              checked={preferences.routineReminders}
              onCheckedChange={(checked) => handleToggle('routineReminders', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="behind-schedule">Behind Schedule Alerts</Label>
              <p className="text-sm text-gray-600">Get notified when falling behind on goals</p>
            </div>
            <Switch
              id="behind-schedule"
              checked={preferences.behindScheduleReminders}
              onCheckedChange={(checked) => handleToggle('behindScheduleReminders', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="streak-maintenance">Streak Maintenance</Label>
              <p className="text-sm text-gray-600">Get notified to maintain your streaks</p>
            </div>
            <Switch
              id="streak-maintenance"
              checked={preferences.streakMaintenanceReminders}
              onCheckedChange={(checked) => handleToggle('streakMaintenanceReminders', checked)}
            />
          </div>
        </div>

        <Separator />

        {/* Timing Preferences */}
        <div className="space-y-4 mt-6 mb-6">
          <h3 className="text-lg font-medium">Timing Preferences</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="work-start">Work Hours Start</Label>
              <Input
                id="work-start"
                type="time"
                value={preferences.workHoursStart}
                onChange={(e) => handleTimeChange('workHoursStart', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="work-end">Work Hours End</Label>
              <Input
                id="work-end"
                type="time"
                value={preferences.workHoursEnd}
                onChange={(e) => handleTimeChange('workHoursEnd', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="quiet-start">Quiet Hours Start</Label>
              <Input
                id="quiet-start"
                type="time"
                value={preferences.quietHoursStart}
                onChange={(e) => handleTimeChange('quietHoursStart', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="quiet-end">Quiet Hours End</Label>
              <Input
                id="quiet-end"
                type="time"
                value={preferences.quietHoursEnd}
                onChange={(e) => handleTimeChange('quietHoursEnd', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weekend-reminders">Weekend Reminders</Label>
              <p className="text-sm text-gray-600">Receive reminders on weekends</p>
            </div>
            <Switch
              id="weekend-reminders"
              checked={preferences.weekendReminders}
              onCheckedChange={(checked) => handleToggle('weekendReminders', checked)}
            />
          </div>
        </div>

        <Separator />

        {/* Frequency Preferences */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-medium">Frequency Preferences</h3>
          
          <div>
            <Label htmlFor="max-reminders">Maximum Reminders Per Day</Label>
            <Input
              id="max-reminders"
              type="number"
              min="1"
              max="20"
              value={preferences.maxRemindersPerDay}
              onChange={(e) => handleNumberChange('maxRemindersPerDay', parseInt(e.target.value) || 5)}
              className="mt-1 w-24"
            />
          </div>

          <div>
            <Label>Goal Deadline Reminder Intervals (days before)</Label>
            <div className="flex gap-2 mt-1">
              {preferences.reminderIntervals.goalDeadline.map((interval, index) => (
                <Input
                  key={index}
                  type="number"
                  min="1"
                  max="30"
                  value={interval}
                  onChange={(e) => {
                    const newIntervals = [...preferences.reminderIntervals.goalDeadline];
                    newIntervals[index] = parseInt(e.target.value) || 1;
                    handleIntervalChange('goalDeadline', newIntervals);
                  }}
                  className="w-16"
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Currently set to remind {preferences.reminderIntervals.goalDeadline.join(', ')} days before deadline
            </p>
          </div>

          <div>
            <Label htmlFor="behind-schedule-interval">Behind Schedule Reminder Interval (hours)</Label>
            <Input
              id="behind-schedule-interval"
              type="number"
              min="1"
              max="168"
              value={preferences.reminderIntervals.behindSchedule}
              onChange={(e) => handleIntervalChange('behindSchedule', parseInt(e.target.value) || 24)}
              className="mt-1 w-24"
            />
          </div>

          <div>
            <Label htmlFor="streak-maintenance-interval">Streak Maintenance Reminder (hours before break)</Label>
            <Input
              id="streak-maintenance-interval"
              type="number"
              min="1"
              max="24"
              value={preferences.reminderIntervals.streakMaintenance}
              onChange={(e) => handleIntervalChange('streakMaintenance', parseInt(e.target.value) || 2)}
              className="mt-1 w-24"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}