'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MobileAlert } from '@/components/ui/mobile-alert';
import { useReminders } from '@/hooks/use-reminders';
import { useDeviceDetection } from '@/hooks/use-device-detection';
import { Reminder, ReminderType, ReminderPriority } from '@/types';
import { 
  Bell, 
  Clock, 
  Target, 
  Repeat, 
  TrendingDown, 
  Flame,
  CheckCircle,
  X,
  Clock3
} from 'lucide-react';

const reminderTypeIcons: Record<ReminderType, React.ReactNode> = {
  'goal-deadline': <Target className="h-4 w-4" />,
  'routine-schedule': <Repeat className="h-4 w-4" />,
  'behind-schedule': <TrendingDown className="h-4 w-4" />,
  'streak-maintenance': <Flame className="h-4 w-4" />
};

const priorityColors: Record<ReminderPriority, string> = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

interface ReminderCardProps {
  reminder: Reminder;
  onAcknowledge: (id: string) => void;
  onSnooze: (id: string) => void;
  onDismiss: (id: string) => void;
}

function ReminderCard({ reminder, onAcknowledge, onSnooze, onDismiss }: ReminderCardProps) {
  const { isMobile } = useDeviceDetection();
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleSnooze = () => {
    // Snooze for 1 hour
    const snoozeUntil = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    onSnooze(reminder.id);
  };

  return (
    <Card className={`${isMobile ? 'p-3' : 'p-4'} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {reminderTypeIcons[reminder.type]}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className={`font-medium truncate ${isMobile ? 'text-sm' : 'text-sm'}`}>
              {reminder.title}
            </h4>
            <Badge className={`text-xs ${priorityColors[reminder.priority]}`}>
              {reminder.priority}
            </Badge>
          </div>
          
          <p className={`text-muted-foreground mb-3 ${isMobile ? 'text-sm' : 'text-sm'}`}>
            {reminder.message}
          </p>
          
          {reminder.actionSuggestions.length > 0 && (
            <div className="mb-3">
              <p className={`font-medium text-muted-foreground mb-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                Suggested actions:
              </p>
              <ul className={`text-muted-foreground space-y-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                {reminder.actionSuggestions.slice(0, isMobile ? 2 : 3).map((suggestion, index) => (
                  <li key={index} className="flex items-center gap-1">
                    <span className="w-1 h-1 bg-muted-foreground rounded-full flex-shrink-0"></span>
                    {suggestion}
                  </li>
                ))}
                {isMobile && reminder.actionSuggestions.length > 2 && (
                  <li className="text-xs text-muted-foreground/70">
                    +{reminder.actionSuggestions.length - 2} more
                  </li>
                )}
              </ul>
            </div>
          )}
          
          <div className={`flex items-center ${isMobile ? 'flex-col gap-2' : 'justify-between'}`}>
            <div className={`flex items-center gap-1 text-xs text-muted-foreground ${isMobile ? 'self-start' : ''}`}>
              <Clock className="h-3 w-3" />
              {formatTime(reminder.scheduledFor)}
            </div>
            
            <div className={`flex items-center gap-1 ${isMobile ? 'self-end' : ''}`}>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onAcknowledge(reminder.id)}
                className={`${isMobile ? 'h-8 px-3 text-xs' : 'h-7 px-2 text-xs'}`}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Done
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSnooze}
                className={`${isMobile ? 'h-8 px-3 text-xs' : 'h-7 px-2 text-xs'}`}
              >
                <Clock3 className="h-3 w-3 mr-1" />
                {isMobile ? '1h' : 'Snooze'}
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDismiss(reminder.id)}
                className={`${isMobile ? 'h-8 px-2 text-xs' : 'h-7 px-2 text-xs'} text-muted-foreground hover:text-destructive`}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ReminderList() {
  const { isMobile } = useDeviceDetection();
  const {
    reminders,
    isLoading,
    error,
    acknowledgeReminder,
    snoozeReminder,
    dismissReminder,
    getPendingReminders,
    generateReminders
  } = useReminders();

  const pendingReminders = getPendingReminders();

  React.useEffect(() => {
    // Generate reminders on component mount
    generateReminders();
    
    // Set up interval to generate reminders periodically
    const interval = setInterval(() => {
      generateReminders();
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(interval);
  }, [generateReminders]);

  const handleSnooze = (id: string) => {
    const snoozeUntil = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
    snoozeReminder(id, snoozeUntil);
  };

  if (isLoading) {
    return (
      <Card className={isMobile ? 'p-4' : 'p-6'}>
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={isMobile ? 'p-4' : 'p-6'}>
        <MobileAlert
          variant="destructive"
          title="Error loading reminders"
          description={error}
          actions={
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              size="sm"
            >
              Retry
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className={`flex items-center justify-between ${isMobile ? 'flex-col gap-3' : ''}`}>
        <div className={`flex items-center gap-2 ${isMobile ? 'self-start' : ''}`}>
          <Bell className="h-5 w-5" />
          <h2 className={`font-semibold ${isMobile ? 'text-lg' : 'text-lg'}`}>
            Active Reminders
          </h2>
          {pendingReminders.length > 0 && (
            <Badge variant="default">{pendingReminders.length}</Badge>
          )}
        </div>
        
        <Button
          onClick={generateReminders}
          variant="outline"
          size="sm"
          className={isMobile ? 'self-end' : ''}
        >
          Refresh
        </Button>
      </div>

      {pendingReminders.length === 0 ? (
        <Card className={`${isMobile ? 'p-6' : 'p-8'} text-center`}>
          <Bell className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'} text-muted-foreground mx-auto mb-4`} />
          <h3 className={`font-medium text-muted-foreground mb-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
            No active reminders
          </h3>
          <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
            You're all caught up! Reminders will appear here when you have upcoming deadlines or scheduled routines.
          </p>
        </Card>
      ) : (
        <div className={`space-y-3 ${isMobile ? 'space-y-2' : ''}`}>
          {pendingReminders
            .sort((a, b) => {
              // Sort by priority first, then by scheduled time
              const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
              const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
              if (priorityDiff !== 0) return priorityDiff;
              
              return new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime();
            })
            .map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                onAcknowledge={acknowledgeReminder}
                onSnooze={handleSnooze}
                onDismiss={dismissReminder}
              />
            ))}
        </div>
      )}
    </div>
  );
}