'use client';

import { useState, useEffect, useCallback } from 'react';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export interface PushNotificationHookReturn {
  isSupported: boolean;
  isRegistered: boolean;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  register: () => Promise<void>;
  unregister: () => Promise<void>;
  checkPermissions: () => Promise<void>;
  requestPermissions: () => Promise<void>;
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if push notifications are supported
  useEffect(() => {
    const checkSupport = () => {
      // Only support Android for now (as requested)
      const supported = Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
      setIsSupported(supported);
      setIsLoading(false);
    };

    checkSupport();
  }, []);

  // Set up push notification listeners
  useEffect(() => {
    if (!isSupported) return;

    const setupListeners = async () => {
      try {
        // Registration success
        await PushNotifications.addListener('registration', (token: Token) => {
          console.info('Push registration success, token: ', token.value);
          setToken(token.value);
          setIsRegistered(true);
          setError(null);
          
          // Store token for server communication
          localStorage.setItem('push_token', token.value);
        });

        // Registration error
        await PushNotifications.addListener('registrationError', (error) => {
          console.error('Push registration error: ', error.error);
          setError(`Registration failed: ${error.error}`);
          setIsRegistered(false);
        });

        // Notification received while app is in foreground
        await PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
          console.log('Push notification received: ', notification);
          
          // Handle the notification (could show in-app notification)
          handleNotificationReceived(notification);
        });

        // Notification action performed (user tapped notification)
        await PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
          console.log('Push notification action performed', notification.actionId, notification.inputValue);
          
          // Handle the notification action
          handleNotificationAction(notification);
        });

      } catch (err) {
        console.error('Error setting up push notification listeners:', err);
        setError('Failed to set up notification listeners');
      }
    };

    setupListeners();

    // Cleanup listeners on unmount
    return () => {
      PushNotifications.removeAllListeners();
    };
  }, [isSupported]);

  const handleNotificationReceived = useCallback((notification: PushNotificationSchema) => {
    // Create a custom event for other parts of the app to listen to
    const event = new CustomEvent('pushNotificationReceived', {
      detail: notification
    });
    window.dispatchEvent(event);

    // Show browser notification if app is in background
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title || 'Chronicle', {
        body: notification.body,
        icon: '/icon-192.webp',
        badge: '/icon-72.webp',
        tag: notification.id,
        data: notification.data
      });
    }
  }, []);

  const handleNotificationAction = useCallback((notification: ActionPerformed) => {
    // Create a custom event for other parts of the app to listen to
    const event = new CustomEvent('pushNotificationActionPerformed', {
      detail: notification
    });
    window.dispatchEvent(event);

    // Navigate to relevant page based on notification data
    if (notification.notification.data) {
      const data = notification.notification.data;
      if (data.type === 'goal-deadline' && data.goalId) {
        window.location.href = `/goals?highlight=${data.goalId}`;
      } else if (data.type === 'routine-schedule' && data.routineId) {
        window.location.href = `/routines?highlight=${data.routineId}`;
      } else if (data.type === 'behind-schedule') {
        window.location.href = '/dashboard';
      }
    }
  }, []);

  const checkPermissions = useCallback(async () => {
    if (!isSupported) return;

    try {
      const permStatus = await PushNotifications.checkPermissions();
      console.log('Push notification permissions:', permStatus);
      
      if (permStatus.receive === 'granted') {
        setIsRegistered(true);
      }
    } catch (err) {
      console.error('Error checking permissions:', err);
      setError('Failed to check permissions');
    }
  }, [isSupported]);

  const requestPermissions = useCallback(async () => {
    if (!isSupported) return;

    try {
      setIsLoading(true);
      const permStatus = await PushNotifications.requestPermissions();
      console.log('Push notification permission request result:', permStatus);
      
      if (permStatus.receive !== 'granted') {
        throw new Error('User denied push notification permissions');
      }
      
      setError(null);
    } catch (err) {
      console.error('Error requesting permissions:', err);
      setError(err instanceof Error ? err.message : 'Failed to request permissions');
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const register = useCallback(async () => {
    if (!isSupported) {
      setError('Push notifications not supported on this platform');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Check permissions first
      let permStatus = await PushNotifications.checkPermissions();
      
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }
      
      if (permStatus.receive !== 'granted') {
        throw new Error('Push notification permissions not granted');
      }

      // Register for push notifications
      await PushNotifications.register();
      
    } catch (err) {
      console.error('Error registering for push notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to register for push notifications');
      setIsRegistered(false);
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const unregister = useCallback(async () => {
    if (!isSupported) return;

    try {
      setIsLoading(true);
      await PushNotifications.unregister();
      setIsRegistered(false);
      setToken(null);
      localStorage.removeItem('push_token');
      setError(null);
    } catch (err) {
      console.error('Error unregistering from push notifications:', err);
      setError('Failed to unregister from push notifications');
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  return {
    isSupported,
    isRegistered,
    token,
    isLoading,
    error,
    register,
    unregister,
    checkPermissions,
    requestPermissions
  };
}