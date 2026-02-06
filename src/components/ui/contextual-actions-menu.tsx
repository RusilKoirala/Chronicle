'use client';

import * as React from 'react';
import { 
  Check, 
  Calendar, 
  Pencil, 
  RotateCcw, 
  Plus, 
  TrendingUp, 
  CheckCircle,
  MoreVertical,
  Clock,
} from 'lucide-react';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { cn } from '@/lib/utils';
import { ContextualAction } from '@/hooks/use-contextual-actions';

interface ContextualActionsMenuProps {
  actions: ContextualAction[];
  trigger?: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  check: <Check className="h-4 w-4" />,
  calendar: <Calendar className="h-4 w-4" />,
  pencil: <Pencil className="h-4 w-4" />,
  'rotate-ccw': <RotateCcw className="h-4 w-4" />,
  plus: <Plus className="h-4 w-4" />,
  'trending-up': <TrendingUp className="h-4 w-4" />,
  'check-circle': <CheckCircle className="h-4 w-4" />,
  clock: <Clock className="h-4 w-4" />,
};

export function ContextualActionsMenu({
  actions,
  trigger,
  align = 'end',
  side = 'bottom',
  className,
}: ContextualActionsMenuProps) {
  if (actions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className={cn("h-8 w-8", className)}>
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open actions menu</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side} className="w-56">
        {actions.map((action, index) => (
          <React.Fragment key={action.id}>
            <DropdownMenuItem
              onClick={action.onClick}
              className={cn(
                "cursor-pointer",
                action.variant === 'success' && "text-green-600 dark:text-green-400",
                action.variant === 'warning' && "text-orange-600 dark:text-orange-400",
                action.variant === 'destructive' && "text-red-600 dark:text-red-400",
                action.variant === 'primary' && "text-primary"
              )}
            >
              <span className="mr-2">{iconMap[action.icon]}</span>
              {action.label}
            </DropdownMenuItem>
            {index === 0 && actions.length > 1 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Quick action buttons for mobile - shows primary actions as buttons
interface QuickActionsProps {
  actions: ContextualAction[];
  maxVisible?: number;
  className?: string;
}

export function QuickActions({ actions, maxVisible = 2, className }: QuickActionsProps) {
  if (actions.length === 0) return null;

  const visibleActions = actions.slice(0, maxVisible);
  const remainingActions = actions.slice(maxVisible);

  const getButtonVariant = (variant?: string) => {
    if (variant === 'success') return 'default';
    if (variant === 'warning') return 'default';
    if (variant === 'primary') return 'default';
    return 'secondary';
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {visibleActions.map((action) => (
        <Button
          key={action.id}
          variant={getButtonVariant(action.variant)}
          size="sm"
          onClick={action.onClick}
          className={cn(
            "touch-target",
            action.variant === 'success' && "bg-green-600 hover:bg-green-700 text-white",
            action.variant === 'warning' && "bg-orange-600 hover:bg-orange-700 text-white",
            action.variant === 'primary' && "bg-primary hover:bg-primary/90 text-primary-foreground"
          )}
        >
          {iconMap[action.icon]}
          <span className="ml-1.5">{action.label}</span>
        </Button>
      ))}
      
      {remainingActions.length > 0 && (
        <ContextualActionsMenu actions={remainingActions} />
      )}
    </div>
  );
}

// Inline action for single primary action
interface InlineActionProps {
  action: ContextualAction;
  className?: string;
}

export function InlineAction({ action, className }: InlineActionProps) {
  const getButtonVariant = (variant?: string) => {
    if (variant === 'success') return 'default';
    if (variant === 'warning') return 'default';
    if (variant === 'primary') return 'default';
    return 'secondary';
  };

  return (
    <Button
      variant={getButtonVariant(action.variant)}
      size="sm"
      onClick={action.onClick}
      className={cn(
        "touch-target",
        action.variant === 'success' && "bg-green-600 hover:bg-green-700 text-white",
        action.variant === 'warning' && "bg-orange-600 hover:bg-orange-700 text-white",
        action.variant === 'primary' && "bg-primary hover:bg-primary/90 text-primary-foreground",
        className
      )}
    >
      {iconMap[action.icon]}
      <span className="ml-1.5">{action.label}</span>
    </Button>
  );
}
