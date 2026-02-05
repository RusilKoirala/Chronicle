'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MobileAlert } from '@/components/ui/mobile-alert';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { useReminderPreferences } from '@/hooks/use-reminder-preferences';
import { useReminders } from '@/hooks/use-reminders';
import { notificationService } from '@/lib/notification-service';
import { Bell, BellOff, Smartphone, AlertCircle, CheckCircle } from 'lucide-react';

export function NotificationManager() {
  const {
    isSupported,
    isRegistered,
    token,
    isLoading: pushLoading,
    error: pushError,
    register,
    unregister,
    checkPermissions
  } = usePushNotifications();

  const { preferences, updatePreferences } = useReminderPreferences();
  const { generateReminders } = useReminders();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastProcessed, setLastProcessed] = useState<string | null>(null);

  // Check permissions on mount
  useEffect(() => {
    if (isSupported) {
      checkPermissions();
    }
  }, [isSupported, checkPermissions]);

  // Set up notification processing interval
  useEffect(() => {
    if (!isRegistered) return;

    const processInterval = setInterval(async () => {
      try {
        await notificationService.processScheduledNotifications();
        setLastProcessed(new Date().toISOString());
      } catch (error) {
        console.error('Error processing scheduled notifications:', error);
      }
    }, 60000); // Check every minute

    return () => clearInterval(processInterval);
  }, [isRegistered]);

  // Listen for push notification events
  useEffect(() => {
    const handleNotificationReceived = (event: CustomEvent) => {
      console.log('Notification received in manager:', event.detail);
      // Could update UI state or trigger actions here
    };

    const handleNotificationAction = (event: CustomEvent) => {
      console.log('Notification action in manager:', event.detail);
      // Handle notification tap actions
    };

    window.addEventListener('pushNotificationReceived', handleNotificationReceived as EventListener);
    window.addEventListener('pushNotificationActionPerformed', handleNotificationAction as EventListener);

    return () => {
      window.removeEventListener('pushNotificationReceived', handleNotificationReceived as EventListener);
      window.removeEventListener('pushNotificationActionPerformed', handleNotificationAction as EventListener);
    };
  }, []);

  const handleEnableNotifications = async () => {
    setIsProcessing(true);
    try {
      await register();
      await notificationService.createNotificationChannel();
      
      // Generate initial reminders
      await generateReminders();
      
      // Update preferences to enable notifications
      if (preferences) {
        updatePreferences({
          goalDeadlineReminders: true,
          routineReminders: true,
          behindScheduleReminders: true
        });
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisableNotifications = async () => {
    setIsProcessing(true);
    try {
      await unregister();
      
      // Update preferences to disable notifications
      if (preferences) {
        updatePreferences({
          goalDeadlineReminders: false,
          routineReminders: false,
          behindScheduleReminders: false,
          streakMaintenanceReminders: false
        });
      }
    } catch (error) {
      console.error('Error disabling notifications:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTestNotification = async () => {
    if (!token) return;
    
    setIsProcessing(true);
    try {
      const success = await notificationService.sendReminderNotification(
        'test-reminder',
        'Test Notification',
        'This is a test notification from Chronicle',
        { type: 'test' }
      );
      
      if (success) {
        console.log('Test notification sent successfully');
      } else {
        console.error('Failed to send test notification');
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isSupported) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <BellOff className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-medium">Push Notifications</h3>
        </div>
        <MobileAlert
          variant="info"
          icon={<AlertCircle className="h-4 w-4" />}
          description="Push notifications are only supported on mobile devices. Web notifications will be used as a fallback when available."
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="h-5 w-5" />
          <h3 className="text-lg font-medium">Push Notifications</h3>
          <Badge variant={isRegistered ? "default" : "secondary"}>
            {isRegistered ? "Enabled" : "Disabled"}
          </Badge>
        </div>

        {pushError && (
          <MobileAlert
            variant="destructive"
            icon={<AlertCircle className="h-4 w-4" />}
            description={pushError}
            className="mb-4"
            dismissible
          />
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span>Mobile Push Notifications</span>
            </div>
            <div className="flex items-center gap-2">
              {isRegistered ? (
                <Button
                  onClick={handleDisableNotifications}
                  disabled={isProcessing || pushLoading}
                  variant="outline"
                  size="sm"
                >
                  {isProcessing ? 'Disabling...' : 'Disable'}
                </Button>
              ) : (
                <Button
                  onClick={handleEnableNotifications}
                  disabled={isProcessing || pushLoading}
                  size="sm"
                >
                  {isProcessing ? 'Enabling...' : 'Enable'}
                </Button>
              )}
            </div>
          </div>

          {isRegistered && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Test Notifications</Label>
                  <p className="text-sm text-gray-600">Send a test notification to verify setup</p>
                </div>
                <Button
                  onClick={handleTestNotification}
                  disabled={isProcessing}
                  variant="outline"
                  size="sm"
                >
                  {isProcessing ? 'Sending...' : 'Send Test'}
                </Button>
              </div>

              {token && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Label className="text-xs font-medium text-gray-600">Device Token</Label>
                  <p className="text-xs font-mono text-gray-800 break-all mt-1">
                    {token.substring(0, 32)}...
                  </p>
                </div>
              )}

              {lastProcessed && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Last processed: {new Date(lastProcessed).toLocaleTimeString()}</span>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Notification Type Preferences */}
      {isRegistered && preferences && (
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Notification Types</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="goal-notifications">Goal Deadline Reminders</Label>
                <p className="text-sm text-gray-600">Get notified before goal deadlines</p>
              </div>
              <Switch
                id="goal-notifications"
                checked={preferences.goalDeadlineReminders}
                onCheckedChange={(checked) => updatePreferences({ goalDeadlineReminders: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="routine-notifications">Routine Reminders</Label>
                <p className="text-sm text-gray-600">Get notified about scheduled routines</p>
              </div>
              <Switch
                id="routine-notifications"
                checked={preferences.routineReminders}
                onCheckedChange={(checked) => updatePreferences({ routineReminders: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="behind-schedule-notifications">Behind Schedule Alerts</Label>
                <p className="text-sm text-gray-600">Get notified when falling behind on goals</p>
              </div>
              <Switch
                id="behind-schedule-notifications"
                checked={preferences.behindScheduleReminders}
                onCheckedChange={(checked) => updatePreferences({ behindScheduleReminders: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="streak-notifications">Streak Maintenance</Label>
                <p className="text-sm text-gray-600">Get notified to maintain your streaks</p>
              </div>
              <Switch
                id="streak-notifications"
                checked={preferences.streakMaintenanceReminders}
                onCheckedChange={(checked) => updatePreferences({ streakMaintenanceReminders: checked })}
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}