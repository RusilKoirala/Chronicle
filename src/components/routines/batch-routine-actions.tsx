'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CheckCircle, 
  XCircle, 
  Trash2, 
  MoreHorizontal,
  CheckSquare,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useBatchRoutineOperations } from '@/hooks/use-action-chaining';

interface BatchRoutineActionsProps {
  totalRoutines: number;
  onActivateSelected: (routineIds: string[]) => void;
  onDeactivateSelected: (routineIds: string[]) => void;
  onDeleteSelected: (routineIds: string[]) => void;
  className?: string;
}

export function BatchRoutineActions({
  totalRoutines,
  onActivateSelected,
  onDeactivateSelected,
  onDeleteSelected,
  className,
}: BatchRoutineActionsProps) {
  const {
    selectedRoutines,
    isBatchMode,
    toggleBatchMode,
    clearSelection,
    hasSelection,
    selectionCount,
  } = useBatchRoutineOperations();

  const handleActivate = () => {
    onActivateSelected(selectedRoutines);
    clearSelection();
  };

  const handleDeactivate = () => {
    onDeactivateSelected(selectedRoutines);
    clearSelection();
  };

  const handleDelete = () => {
    if (confirm(`Delete ${selectionCount} routine${selectionCount > 1 ? 's' : ''}?`)) {
      onDeleteSelected(selectedRoutines);
      clearSelection();
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {!isBatchMode ? (
        <Button
          variant="outline"
          size="sm"
          onClick={toggleBatchMode}
          className="touch-target"
        >
          <CheckSquare className="h-4 w-4 mr-2" />
          Select Multiple
        </Button>
      ) : (
        <>
          <div className="text-sm text-muted-foreground">
            {selectionCount} selected
          </div>
          
          {hasSelection && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleActivate}
                className="touch-target"
              >
                <CheckCircle className="h-4 w-4 mr-1.5" />
                Activate
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeactivate}
                className="touch-target"
              >
                <XCircle className="h-4 w-4 mr-1.5" />
                Deactivate
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-destructive cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              toggleBatchMode();
              clearSelection();
            }}
          >
            Cancel
          </Button>
        </>
      )}
    </div>
  );
}

// Hook to expose batch operations to parent components
export function useBatchRoutineActionsContext() {
  return useBatchRoutineOperations();
}
