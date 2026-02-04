'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAchievements } from '@/hooks/use-achievements';
import { useResources } from '@/hooks/use-resources';
import { useGoals } from '@/hooks/use-goals';
import { useTasks } from '@/hooks/use-tasks';
import { useRoutines } from '@/hooks/use-routines';
import { Trophy, BookOpen, Target, CheckSquare, Repeat, Calendar, Clock } from 'lucide-react';

export default function Dashboard() {
  const { achievements, isLoading: achievementsLoading } = useAchievements();
  const { resources, isLoading: resourcesLoading } = useResources();
  const { goals, isLoading: goalsLoading } = useGoals();
  const { tasks, getActiveTasks, getTasksDueToday, isLoading: tasksLoading } = useTasks();
  const { routines, getTodaysRoutines, isLoading: routinesLoading } = useRoutines();

  const isLoading = achievementsLoading || resourcesLoading || goalsLoading || tasksLoading || routinesLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
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
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Chronicle - your personal tracking companion
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Achievements Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{achievements.length}</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Books: {achievementsByType.book}</div>
              <div>Certificates: {achievementsByType.certificate}</div>
              <div>Skills: {achievementsByType.skill}</div>
              <div>Other: {achievementsByType.other}</div>
            </div>
            <Link href="/achievements">
              <Button className="w-full mt-4" variant="outline">
                View All
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Resources Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resources</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{resources.length}</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Notes: {resourcesByType.note}</div>
              <div>Links: {resourcesByType.link}</div>
              <div>Files: {resourcesByType.file}</div>
              <div>Other: {resourcesByType.other}</div>
            </div>
            <Link href="/resources">
              <Button className="w-full mt-4" variant="outline">
                View All
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Goals Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{goals.length}</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Not Started: {goalsByStatus['not-started']}</div>
              <div>In Progress: {goalsByStatus['in-progress']}</div>
              <div>Completed: {goalsByStatus.completed}</div>
            </div>
            <Link href="/goals">
              <Button className="w-full mt-4" variant="outline">
                View All
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Tasks Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{activeTasks.length}</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Active: {activeTasks.length}</div>
              <div>Due Today: {tasksDueToday.length}</div>
              <div>Total: {tasks.length}</div>
            </div>
            <Link href="/tasks">
              <Button className="w-full mt-4" variant="outline">
                View All
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Routines Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Routines</CardTitle>
            <Repeat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{routines.filter(r => r.isActive).length}</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Active: {routines.filter(r => r.isActive).length}</div>
              <div>Today: {todaysRoutines.length}</div>
              <div>Total: {routines.length}</div>
            </div>
            <Link href="/routines">
              <Button className="w-full mt-4" variant="outline">
                View All
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Today's Focus Card */}
        <Card className="hover:shadow-md transition-shadow">
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
            <div className="mt-4 space-y-2">
              <Link href="/tasks">
                <Button className="w-full" size="sm" variant="outline">
                  View Tasks
                </Button>
              </Link>
              <Link href="/routines">
                <Button className="w-full" size="sm" variant="outline">
                  View Routines
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Link href="/achievements">
            <Button className="w-full" variant="outline">
              Add Achievement
            </Button>
          </Link>
          <Link href="/resources">
            <Button className="w-full" variant="outline">
              Save Resource
            </Button>
          </Link>
          <Link href="/goals">
            <Button className="w-full" variant="outline">
              Set Goal
            </Button>
          </Link>
          <Link href="/tasks">
            <Button className="w-full" variant="outline">
              Add Task
            </Button>
          </Link>
          <Link href="/routines">
            <Button className="w-full" variant="outline">
              Create Routine
            </Button>
          </Link>
        </div>
      </div>

      {/* Welcome Message for New Users */}
      {!hasAnyData && (
        <div className="text-center py-12 mt-8">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🚀</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Welcome to Chronicle!</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Start your tracking journey by adding your first achievement, resource, goal, task, or routine.
          </p>
          <Link href="/achievements">
            <Button>Add Your First Achievement</Button>
          </Link>
        </div>
      )}
    </div>
  );
}