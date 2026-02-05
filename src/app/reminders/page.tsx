'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReminderList } from '@/components/reminders/reminder-list';
import { SmartSuggestionsList } from '@/components/reminders/smart-suggestions-list';
import { ReminderPreferences } from '@/components/reminders/reminder-preferences';
import { NotificationManager } from '@/components/reminders/notification-manager';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useDeviceDetection } from '@/hooks/use-device-detection';
import { Bell, Lightbulb, Settings, Smartphone } from 'lucide-react';

export default function RemindersPage() {
  const { isMobile } = useDeviceDetection();

  return (
    <AuthGuard>
      <div className={`
        ${isMobile ? 'px-4 py-4' : 'container mx-auto px-4 py-6 max-w-4xl'}
        min-h-screen bg-background
      `}>
        {/* Mobile-optimized header */}
        <div className={`mb-6 ${isMobile ? 'mb-4' : ''}`}>
          <h1 className={`font-bold mb-2 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
            Smart Reminders
          </h1>
          <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
            Stay on track with intelligent reminders and personalized suggestions
          </p>
        </div>

        <Tabs defaultValue="reminders" className="space-y-4">
          {/* Mobile-optimized tabs */}
          <TabsList className={`
            grid w-full 
            ${isMobile ? 'grid-cols-2 h-auto p-1' : 'grid-cols-4'}
          `}>
            <TabsTrigger 
              value="reminders" 
              className={`
                flex items-center gap-2 
                ${isMobile ? 'flex-col py-3 px-2 text-xs' : 'flex-row'}
              `}
            >
              <Bell className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'}`} />
              <span className={isMobile ? 'leading-tight' : ''}>
                {isMobile ? 'Alerts' : 'Active Reminders'}
              </span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="suggestions"
              className={`
                flex items-center gap-2 
                ${isMobile ? 'flex-col py-3 px-2 text-xs' : 'flex-row'}
              `}
            >
              <Lightbulb className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'}`} />
              <span className={isMobile ? 'leading-tight' : ''}>
                {isMobile ? 'Ideas' : 'Smart Suggestions'}
              </span>
            </TabsTrigger>
            
            {!isMobile && (
              <>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                
                <TabsTrigger value="preferences" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Preferences
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {/* Mobile: Additional tabs in a second row */}
          {isMobile && (
            <TabsList className="grid w-full grid-cols-2 h-auto p-1">
              <TabsTrigger 
                value="notifications"
                className="flex items-center gap-2 flex-col py-3 px-2 text-xs"
              >
                <Smartphone className="h-4 w-4" />
                <span className="leading-tight">Push</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="preferences"
                className="flex items-center gap-2 flex-col py-3 px-2 text-xs"
              >
                <Settings className="h-4 w-4" />
                <span className="leading-tight">Settings</span>
              </TabsTrigger>
            </TabsList>
          )}

          {/* Tab content with mobile spacing */}
          <TabsContent value="reminders" className={isMobile ? 'space-y-3' : 'space-y-6'}>
            <ReminderList />
          </TabsContent>

          <TabsContent value="suggestions" className={isMobile ? 'space-y-3' : 'space-y-6'}>
            <SmartSuggestionsList />
          </TabsContent>

          <TabsContent value="notifications" className={isMobile ? 'space-y-3' : 'space-y-6'}>
            <NotificationManager />
          </TabsContent>

          <TabsContent value="preferences" className={isMobile ? 'space-y-3' : 'space-y-6'}>
            <ReminderPreferences />
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  );
}