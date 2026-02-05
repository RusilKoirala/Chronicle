'use client';

import { useDashboardData, SmartSuggestion } from '@/hooks/use-dashboard-data';
import { useHybridTasks } from '@/hooks/use-hybrid-tasks';
import { useHybridGoals } from '@/hooks/use-hybrid-goals';
import { TodaysFocusSection } from './todays-focus';
import { SmartSuggestionsSection } from './smart-suggestions';
import { DashboardStatsSection } from './dashboard-stats';
import { MobileLayout, MobilePageHeader } from '@/components/layout/mobile-layout';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function FocusDashboard() {
  const { todaysFocus, stats, isLoading } = useDashboardData();
  const { toggleComplete } = useHybridTasks();
  const { updateProgress } = useHybridGoals();
  const { toast } = useToast();
  const router = useRouter();

  const handleCompleteTask = async (taskId: string) => {
    try {
      await toggleComplete(taskId);
      toast({
        title: "Task completed! 🎉",
        description: "Great job staying on track!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateGoalProgress = async (goalId: string, progress: number) => {
    try {
      await updateProgress(goalId, progress);
      toast({
        title: "Progress updated! 📈",
        description: "Keep up the momentum!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSuggestionAction = (suggestion: SmartSuggestion) => {
    // Handle different suggestion actions
    switch (suggestion.type) {
      case 'task':
        if (suggestion.actionData?.taskId) {
          // Navigate to task or complete it
          if (suggestion.actionData.action === 'complete') {
            handleCompleteTask(suggestion.actionData.taskId);
          } else {
            router.push('/tasks');
          }
        } else {
          router.push('/tasks');
        }
        break;
      
      case 'goal':
        if (suggestion.actionData?.goalId) {
          router.push('/goals');
        } else {
          router.push('/goals');
        }
        break;
      
      case 'routine':
        router.push('/routines');
        break;
      
      default:
        // Generic action - show toast
        toast({
          title: "Action noted! 👍",
          description: suggestion.description,
        });
    }
  };

  const handleRefresh = () => {
    // In a real app, this would trigger a data refresh
    toast({
      title: "Dashboard refreshed",
      description: "Data has been updated",
    });
  };

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <p>Loading your focus dashboard...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  const totalFocusItems = 
    todaysFocus.overdueItems.length + 
    todaysFocus.scheduledTasks.length + 
    todaysFocus.activeRoutines.length;

  return (
    <MobileLayout>
      <MobilePageHeader
        title="Focus Dashboard"
        description={
          totalFocusItems > 0 
            ? `${totalFocusItems} items need your attention today`
            : "You're all caught up! Great work! 🎉"
        }
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="h-8 px-2"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        }
      />

      <div className="space-y-6">
        {/* Quick Stats Section */}
        <DashboardStatsSection stats={stats} />

        {/* Today's Focus Section */}
        <TodaysFocusSection 
          data={todaysFocus}
          onCompleteTask={handleCompleteTask}
          onUpdateGoalProgress={handleUpdateGoalProgress}
        />

        {/* Smart Suggestions Section */}
        {todaysFocus.suggestedActions.length > 0 && (
          <SmartSuggestionsSection 
            suggestions={todaysFocus.suggestedActions}
            onActionClick={handleSuggestionAction}
          />
        )}

        {/* Next Steps Call-to-Action */}
        {totalFocusItems === 0 && todaysFocus.suggestedActions.length === 0 && (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">✓</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">All set for today!</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You've completed everything on your list. Time to plan ahead or take a well-deserved break!
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button variant="outline" onClick={() => router.push('/tasks')}>
                Plan Tomorrow
              </Button>
              <Button variant="outline" onClick={() => router.push('/goals')}>
                Review Goals
              </Button>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}