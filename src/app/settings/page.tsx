'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AuthGuard } from '@/components/auth/auth-guard';
import { ThemeToggle } from '@/components/theme-toggle';
import { DataManagement } from '@/components/data-management';
import { DataMigration } from '@/components/data-migration';
import { UserProfile } from '@/components/auth/user-profile';
import { StatusIndicator } from '@/components/status-indicator';
import { 
  Settings, 
  Palette, 
  Database, 
  User, 
  Smartphone,
  Monitor,
  Info,
  RotateCcw,
  HelpCircle
} from 'lucide-react';
import { useOnboarding } from '@/hooks/use-onboarding';
import { Button } from '@/components/ui/button';
import { ContextualHelp } from '@/components/onboarding/contextual-help';

function SettingsContent() {
  const { resetOnboarding } = useOnboarding();

  const handleResetOnboarding = () => {
    if (confirm('This will reset the onboarding flow. You\'ll see the welcome screens again on your next visit to the dashboard. Continue?')) {
      resetOnboarding();
      alert('Onboarding has been reset. Visit the dashboard to see it again.');
    }
  };

  const helpItems = [
    {
      question: 'How do I quickly add tasks or resources?',
      answer: 'Use the floating action button (+ icon) in the bottom-right corner of any page. It provides quick access to create tasks, resources, achievements, and more.'
    },
    {
      question: 'What are smart reminders?',
      answer: 'Smart reminders automatically notify you about goals with deadlines and scheduled routines. You can customize reminder preferences in the Reminders page.'
    },
    {
      question: 'How does the points system work?',
      answer: 'You earn points by completing tasks and achieving goals. Points are calculated based on difficulty and importance. Maintain streaks for bonus points!'
    },
    {
      question: 'Can I use Chronicle offline?',
      answer: 'Yes! Chronicle works offline with basic functionality. Your changes will automatically sync when you reconnect to the internet.'
    },
    {
      question: 'How do I migrate my data?',
      answer: 'Use the Data Migration section below to move data between local storage and cloud. You can also export/import data as JSON for backups.'
    }
  ];

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
            <Settings className="h-6 w-6 md:h-8 md:w-8" />
            Settings
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage your preferences and account settings
          </p>
        </div>
        <ContextualHelp 
          title="Settings Help" 
          items={helpItems}
          className="hidden md:block"
        />
      </div>

      <div className="space-y-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how Chronicle looks and feels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Theme</p>
                <p className="text-xs text-muted-foreground">
                  Choose between light, dark, or system theme
                </p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account
            </CardTitle>
            <CardDescription>
              Manage your account and profile settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Profile</p>
                <p className="text-xs text-muted-foreground">
                  View and manage your account details
                </p>
              </div>
              <UserProfile />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Import, export, and manage your data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Data Migration</p>
                <p className="text-xs text-muted-foreground">
                  Migrate data between local storage and cloud
                </p>
                <DataMigration />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Import & Export</p>
                <p className="text-xs text-muted-foreground">
                  Backup your data or import from other sources
                </p>
                <DataManagement />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Device Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              System Information
            </CardTitle>
            <CardDescription>
              View system status and device information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Connection Status</p>
                <p className="text-xs text-muted-foreground">
                  Current system status and connectivity
                </p>
              </div>
              <StatusIndicator />
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  <span className="font-medium">Desktop Experience</span>
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  Full navigation with sidebar and expanded features
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span className="font-medium">Mobile Experience</span>
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  Bottom navigation with floating action button
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card>
          <CardHeader>
            <CardTitle>About Chronicle</CardTitle>
            <CardDescription>
              Version and application information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm space-y-1">
              <p><span className="font-medium">Version:</span> 1.0.0</p>
              <p><span className="font-medium">Build:</span> Production</p>
              <p><span className="font-medium">Platform:</span> Web/Mobile Hybrid</p>
            </div>
          </CardContent>
        </Card>

        {/* Onboarding & Help */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Onboarding & Help
            </CardTitle>
            <CardDescription>
              Reset onboarding or get help with features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Reset Onboarding</p>
                <p className="text-xs text-muted-foreground">
                  See the welcome screens and feature introduction again
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetOnboarding}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
            
            <div className="md:hidden">
              <ContextualHelp 
                title="Settings Help" 
                items={helpItems}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}