'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TodaysFocus } from '@/hooks/use-dashboard-data';
import { 
  AlertTriangle, 
  Calendar, 
  Target, 
  Repeat, 
  Clock,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

interface TodaysFocusProps {
  data: TodaysFocus;
  onCompleteTask?: (taskId: string) => void;
  onUpdateGoalProgress?: (goalId: string, progress: number) => void;
}

export function TodaysFocusSection({ data, onCompleteTask, onUpdateGoalProgress }: TodaysFocusProps) {
  const { overdueItems, scheduledTasks, activeRoutines, goalProgress, suggestedActions } = data;
  
  const totalFocusItems = overdueItems.length + scheduledTasks.length + activeRoutines.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Today's Focus</h2>
        <Badge variant="secondary" className="text-xs">
          {totalFocusItems} items
        </Badge>
      </div>

      {/* Overdue Items - Highest Priority */}
      {overdueItems.length > 0 && (
        <Card className="border-l-2 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Overdue ({overdueItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {overdueItems.slice(0, 3).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {onCompleteTask && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCompleteTask(task.id)}
                      className="h-8 px-2"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                    </Button>
                  )}
                  <Link href="/tasks">
                    <Button size="sm" variant="ghost" className="h-8 px-2">
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            {overdueItems.length > 3 && (
              <Link href="/tasks">
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View {overdueItems.length - 3} more overdue tasks
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {/* Scheduled Tasks */}
      {scheduledTasks.length > 0 && (
        <Card className="border-l-2 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              Due Today ({scheduledTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {scheduledTasks.slice(0, 3).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  {task.description && (
                    <p className="text-xs text-muted-foreground truncate">{task.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {onCompleteTask && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCompleteTask(task.id)}
                      className="h-8 px-2"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                    </Button>
                  )}
                  <Link href="/tasks">
                    <Button size="sm" variant="ghost" className="h-8 px-2">
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            {scheduledTasks.length > 3 && (
              <Link href="/tasks">
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View {scheduledTasks.length - 3} more tasks
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {/* Active Routines */}
      {activeRoutines.length > 0 && (
        <Card className="border-l-2 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Repeat className="h-4 w-4 text-green-500" />
              Today's Routines ({activeRoutines.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeRoutines.slice(0, 3).map((routine) => (
              <div key={routine.id} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{routine.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {routine.time}
                  </p>
                </div>
                <Link href="/routines">
                  <Button size="sm" variant="ghost" className="h-8 px-2">
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            ))}
            {activeRoutines.length > 3 && (
              <Link href="/routines">
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View {activeRoutines.length - 3} more routines
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {/* Goal Progress */}
      {goalProgress.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Goal Progress ({goalProgress.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {goalProgress.slice(0, 2).map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate flex-1">{goal.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{goal.progress}%</span>
                    {goal.progressChange !== 0 && (
                      <Badge 
                        variant={goal.progressChange > 0 ? "default" : "secondary"}
                        className="text-xs px-1"
                      >
                        {goal.progressChange > 0 ? '+' : ''}{goal.progressChange}%
                      </Badge>
                    )}
                  </div>
                </div>
                <Progress value={goal.progress} className="h-2 [&>div]:bg-blue-500" />
                {goal.targetDate && (
                  <p className="text-xs text-muted-foreground">
                    Target: {new Date(goal.targetDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
            {goalProgress.length > 2 && (
              <Link href="/goals">
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View {goalProgress.length - 2} more goals
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {totalFocusItems === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">All caught up!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              No overdue tasks or scheduled items for today.
            </p>
            <Link href="/tasks">
              <Button variant="outline" size="sm">Add a task</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}