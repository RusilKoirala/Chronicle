'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DashboardStats } from '@/hooks/use-dashboard-data';
import { 
  Trophy, 
  Zap, 
  Flame, 
  TrendingUp,
  Star
} from 'lucide-react';

interface DashboardStatsProps {
  stats: DashboardStats;
}

export function DashboardStatsSection({ stats }: DashboardStatsProps) {
  const { totalPoints, todayPoints, currentStreak, completionRate } = stats;

  const statCards = [
    {
      title: "Today's Points",
      value: todayPoints,
      icon: Zap,
      description: "Points earned today"
    },
    {
      title: "Total Points",
      value: totalPoints.toLocaleString(),
      icon: Trophy,
      description: "All-time points"
    },
    {
      title: "Current Streak",
      value: currentStreak,
      icon: Flame,
      description: `${currentStreak} day${currentStreak !== 1 ? 's' : ''} active`
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: TrendingUp,
      description: "Tasks completed today"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Quick Stats</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          
          return (
            <Card key={stat.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {stat.title === "Current Streak" && currentStreak > 0 && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-2xl font-bold leading-none">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                
                {/* Progress bar for completion rate */}
                {stat.title === "Completion Rate" && (
                  <div className="mt-2">
                    <Progress 
                      value={completionRate} 
                      className="h-1 [&>div]:bg-green-500" 
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Motivational Messages */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <Star className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium text-sm mb-1">
                {getMotivationalMessage(stats)}
              </h3>
              <p className="text-xs text-muted-foreground">
                {getMotivationalSubtext(stats)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getMotivationalMessage(stats: DashboardStats): string {
  const { todayPoints, currentStreak, completionRate } = stats;

  if (completionRate === 100) {
    return "Perfect day! 🎉";
  }
  
  if (currentStreak >= 7) {
    return `Amazing ${currentStreak}-day streak! 🔥`;
  }
  
  if (todayPoints > 50) {
    return "You're on fire today! ⚡";
  }
  
  if (completionRate >= 80) {
    return "Great progress today! 💪";
  }
  
  if (currentStreak >= 3) {
    return "Building momentum! 🚀";
  }
  
  return "Every step counts! 🌟";
}

function getMotivationalSubtext(stats: DashboardStats): string {
  const { todayPoints, currentStreak, completionRate } = stats;

  if (completionRate === 100) {
    return "All tasks completed - time to celebrate!";
  }
  
  if (currentStreak >= 7) {
    return "Consistency is the key to success!";
  }
  
  if (todayPoints > 50) {
    return `${todayPoints} points earned and counting!`;
  }
  
  if (completionRate >= 80) {
    return "You're almost there - keep going!";
  }
  
  if (currentStreak >= 3) {
    return "Habits are forming - stay consistent!";
  }
  
  return "Small actions lead to big results!";
}