'use client';

import { Routine } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Pencil, Trash2, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useRoutines } from '@/hooks/use-routines';

interface RoutineCardProps {
  routine: Routine;
  onEdit: (routine: Routine) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

export function RoutineCard({ routine, onEdit, onDelete, onToggleActive }: RoutineCardProps) {
  const { formatDaysOfWeek } = useRoutines();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-lg">{routine.title}</CardTitle>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(routine)}
              className="h-8 w-8"
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(routine.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{routine.time}</span>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Days:</div>
          <Badge variant="outline" className="text-xs">
            {formatDaysOfWeek(routine.daysOfWeek)}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">Active</span>
            <Switch
              checked={routine.isActive}
              onCheckedChange={() => onToggleActive(routine.id)}
            />
          </div>
          <Badge 
            variant={routine.isActive ? "default" : "secondary"}
            className="text-xs"
          >
            {routine.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        
        <div className="text-xs text-muted-foreground pt-2 border-t">
          Created {format(new Date(routine.createdAt), 'MMM dd, yyyy')}
        </div>
      </CardContent>
    </Card>
  );
}