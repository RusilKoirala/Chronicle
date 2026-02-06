'use client';

import { Goal } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Pencil, Trash2, Target } from 'lucide-react';
import { format } from 'date-fns';
import { useContextualActions } from '@/hooks/use-contextual-actions';
import { QuickActions } from '@/components/ui/contextual-actions-menu';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  onAddRelatedTask?: (goalId: string) => void;
}

const statusColors = {
  'not-started': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
};

const statusLabels = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  'completed': 'Completed'
};

export function GoalCard({ goal, onEdit, onDelete, onUpdateProgress, onAddRelatedTask }: GoalCardProps) {
  const { actions } = useContextualActions({
    entity: goal,
    entityType: 'goal',
    onUpdateProgress,
    onAddRelatedTask,
    onEdit,
  });

  const handleProgressClick = () => {
    if (goal.status === 'completed') {
      onUpdateProgress(goal.id, 0);
    } else if (goal.status === 'not-started') {
      onUpdateProgress(goal.id, 25);
    } else {
      onUpdateProgress(goal.id, 100);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Target className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <CardTitle className="text-lg truncate">{goal.title}</CardTitle>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(goal.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {goal.description && (
          <p className="text-sm text-muted-foreground">{goal.description}</p>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge className={statusColors[goal.status]}>
              {statusLabels[goal.status]}
            </Badge>
            <span className="text-sm font-medium">{goal.progress}%</span>
          </div>
          
          <Progress 
            value={goal.progress} 
            className="cursor-pointer" 
            onClick={handleProgressClick}
          />
        </div>
        
        {goal.targetDate && (
          <div className="text-xs text-muted-foreground">
            Target: {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          Created {format(new Date(goal.createdAt), 'MMM dd, yyyy')}
        </div>
        
        {/* Contextual quick actions */}
        {goal.status !== 'completed' && actions.length > 0 && (
          <div className="pt-2 border-t">
            <QuickActions actions={actions} maxVisible={3} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}