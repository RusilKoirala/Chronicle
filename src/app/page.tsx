'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAchievements } from '@/hooks/use-achievements';
import { Trophy, BookOpen, Target, CheckSquare, Repeat } from 'lucide-react';

export default function Dashboard() {
  const { achievements, isLoading } = useAchievements();

  const achievementsByType = {
    book: achievements.filter(a => a.type === 'book').length,
    certificate: achievements.filter(a => a.type === 'certificate').length,
    skill: achievements.filter(a => a.type === 'skill').length,
    other: achievements.filter(a => a.type === 'other').length,
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
            <div className="text-2xl font-bold mb-2">0</div>
            <p className="text-xs text-muted-foreground mb-4">
              Save important notes and links
            </p>
            <Link href="/resources">
              <Button className="w-full" variant="outline">
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
            <div className="text-2xl font-bold mb-2">0</div>
            <p className="text-xs text-muted-foreground mb-4">
              Track your progress towards goals
            </p>
            <Link href="/goals">
              <Button className="w-full" variant="outline">
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
            <div className="text-2xl font-bold mb-2">0</div>
            <p className="text-xs text-muted-foreground mb-4">
              Manage your daily tasks
            </p>
            <Link href="/tasks">
              <Button className="w-full" variant="outline">
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
            <div className="text-2xl font-bold mb-2">0</div>
            <p className="text-xs text-muted-foreground mb-4">
              Build consistent habits
            </p>
            <Link href="/routines">
              <Button className="w-full" variant="outline">
                View All
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/achievements">
              <Button className="w-full" size="sm" variant="outline">
                Add Achievement
              </Button>
            </Link>
            <Link href="/resources">
              <Button className="w-full" size="sm" variant="outline">
                Save Resource
              </Button>
            </Link>
            <Link href="/goals">
              <Button className="w-full" size="sm" variant="outline">
                Set Goal
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {achievements.length === 0 && (
        <div className="text-center py-12 mt-8">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🚀</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Welcome to Chronicle!</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Start your tracking journey by adding your first achievement, resource, or goal.
          </p>
          <Link href="/achievements">
            <Button>Add Your First Achievement</Button>
          </Link>
        </div>
      )}
    </div>
  );
}