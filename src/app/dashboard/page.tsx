'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuthGuard } from '@/components/auth/auth-guard';
import { MobileLayout, MobilePageHeader, MobileCardGrid, MobileCard } from '@/components/layout/mobile-layout';
import { useHybridAchievements } from '@/hooks/use-hybrid-achievements';
import { useHybridResources } from '@/hooks/use-hybrid-resources';
import { useHybridGoals } from '@/hooks/use-hybrid-goals';
import { useHybridTasks } from '@/hooks/use-hybrid-tasks';
import { useHybridRoutines } from '@/hooks/use-hybrid-routines';
import { Trophy, BookOpen, Target, CheckSquare, Repeat, Calendar, Plus } from 'lucide-react';

function DashboardContent() {
  const { achievements, isLoading: achievementsLoading } = useHybridAchievements();
  const { resources, isLoading: resourcesLoading } = useHybridResources();
  const { goals, isLoading: goalsLoading } = useHybridGoals();
  const { tasks, getActiveTasks, getTasksDueToday, isLoading: tasksLoading } = useHybridTasks();
  const { routines, getTodaysRoutines, isLoading: routinesLoading } = useHybridRoutines();

  const isLoading = achievementsLoading || resourcesLoading || goalsLoading || tasksLoading || routinesLoading;

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </MobileLayout>
    );
  }

  const achievementsByType = {
    book: achievements.filter(a => a.type === 'book').length,
    certificate: achievements.filter(a => a.type === 'certificate').length,
    skill: achievements.filter(a => a.type === 'skill').length,
    other: achievements.filter(a => a.type === 'other').length,
  };

  const resourcesByType = {
    note: resources.filter(r => r.type === 'note').length,
    link: resources.filter(r => r.type === 'link').length,
    file: resources.filter(r => r.type === 'file').length,
    other: resources.filter(r => r.type === 'other').length,
  };

  const goalsByStatus = {
    'not-started': goals.filter(g => g.status === 'not-started').length,
    'in-progress': goals.filter(g => g.status === 'in-progress').length,
    'completed': goals.filter(g => g.status === 'completed').length,
  };

  const activeTasks = getActiveTasks();
  const tasksDueToday = getTasksDueToday();
  const todaysRoutines = getTodaysRoutines();

  const hasAnyData = achievements.length > 0 || resources.length > 0 || goals.length > 0 || tasks.length > 0 || routines.length > 0;

  return (
    <MobileLayout>
      <MobilePageHeader
        title="Dashboard"
        description="Welcome to Chronicle - your personal tracking companion"
      />
      
      {/* Stats Grid - Mobile optimized */}
      <MobileCardGrid 
        columns={{ mobile: 1, tablet: 2, desktop: 3 }}
        className="mb-6"
      >
        {/* Achievements Card */}
        <MobileCard hover>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{achievements.length}</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Books:</span>
                <span>{achievementsByType.book}</span>
              </div>
              <div className="flex justify-between">
                <span>Certificates:</span>
                <span>{achievementsByType.certificate}</span>
              </div>
              <div className="flex justify-between">
                <span>Skills:</span>
                <span>{achievementsByType.skill}</span>
              </div>
              <div className="flex justify-between">
                <span>Other:</span>
                <span>{achievementsByType.other}</span>
              </div>
            </div>
            <Link href="/achievements">
              <Button className="w-full mt-4" variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardContent>
        </MobileCard>

        {/* Resources Card */}
        <MobileCard hover>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resources</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{resources.length}</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Notes:</span>
                <span>{resourcesByType.note}</span>
              </div>
              <div className="flex justify-between">
                <span>Links:</span>
                <span>{resourcesByType.link}</span>
              </div>
              <div className="flex justify-between">
                <span>Files:</span>
                <span>{resourcesByType.file}</span>
              </div>
              <div className="flex justify-between">
                <span>Other:</span>
                <span>{resourcesByType.other}</span>
              </div>
            </div>
            <Link href="/resources">
              <Button className="w-full mt-4" variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardContent>
        </MobileCard>

        {/* Goals Card */}
        <MobileCard hover>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{goals.length}</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Not Started:</span>
                <span>{goalsByStatus['not-started']}</span>
              </div>
              <div className="flex justify-between">
                <span>In Progress:</span>
                <span>{goalsByStatus['in-progress']}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed:</span>
                <span>{goalsByStatus.completed}</span>
              </div>
            </div>
            <Link href="/goals">
              <Button className="w-full mt-4" variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardContent>
        </MobileCard>

        {/* Tasks Card */}
        <MobileCard hover>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{activeTasks.length}</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Active:</span>
                <span>{activeTasks.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Due Today:</span>
                <span>{tasksDueToday.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span>{tasks.length}</span>
              </div>
            </div>
            <Link href="/tasks">
              <Button className="w-full mt-4" variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardContent>
        </MobileCard>

        {/* Routines Card */}
        <MobileCard hover>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Routines</CardTitle>
            <Repeat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{routines.filter(r => r.isActive).length}</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Active:</span>
                <span>{routines.filter(r => r.isActive).length}</span>
              </div>
              <div className="flex justify-between">
                <span>Today:</span>
                <span>{todaysRoutines.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span>{routines.length}</span>
              </div>
            </div>
            <Link href="/routines">
              <Button className="w-full mt-4" variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardContent>
        </MobileCard>

        {/* Today's Focus Card */}
        <MobileCard hover className="sm:col-span-2 xl:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Focus</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Tasks Due</span>
                <span className="text-lg font-bold">{tasksDueToday.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Routines</span>
                <span className="text-lg font-bold">{todaysRoutines.length}</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link href="/tasks">
                <Button className="w-full" size="sm" variant="outline">
                  Tasks
                </Button>
              </Link>
              <Link href="/routines">
                <Button className="w-full" size="sm" variant="outline">
                  Routines
                </Button>
              </Link>
            </div>
          </CardContent>
        </MobileCard>
      </MobileCardGrid>

      {/* Quick Actions Section - Mobile optimized */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <MobileCardGrid columns={{ mobile: 1, tablet: 2, desktop: 5 }}>
          <Link href="/achievements">
            <Button className="w-full justify-start" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Achievement
            </Button>
          </Link>
          <Link href="/resources">
            <Button className="w-full justify-start" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Save Resource
            </Button>
          </Link>
          <Link href="/goals">
            <Button className="w-full justify-start" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Set Goal
            </Button>
          </Link>
          <Link href="/tasks">
            <Button className="w-full justify-start" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </Link>
          <Link href="/routines" className="sm:col-span-2 lg:col-span-1">
            <Button className="w-full justify-start" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create Routine
            </Button>
          </Link>
        </MobileCardGrid>
      </div>

      {/* Welcome Message for New Users */}
      {!hasAnyData && (
        <div className="text-center py-12">
          <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <span className="text-xl">🚀</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Welcome to Chronicle!</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto text-sm">
            Start your tracking journey by adding your first achievement, resource, goal, task, or routine.
          </p>
          <Link href="/achievements">
            <Button>Add Your First Achievement</Button>
          </Link>
        </div>
      )}
    </MobileLayout>
  );
}

export default function Dashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}