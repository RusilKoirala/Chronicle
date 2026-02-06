'use client';

import * as React from 'react';
import { 
  Plus, 
  Target, 
  Trophy, 
  RotateCcw, 
  LayoutDashboard,
  X,
  Sparkles,
} from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { cn } from '@/lib/utils';
import { NextStepSuggestion } from '@/hooks/use-action-chaining';

interface NextStepSuggestionsProps {
  suggestions: NextStepSuggestion[];
  onExecute: (suggestionId: string) => void;
  onDismiss: () => void;
  className?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  plus: <Plus className="h-4 w-4" />,
  target: <Target className="h-4 w-4" />,
  trophy: <Trophy className="h-4 w-4" />,
  'rotate-ccw': <RotateCcw className="h-4 w-4" />,
  'layout-dashboard': <LayoutDashboard className="h-4 w-4" />,
};

export function NextStepSuggestions({
  suggestions,
  onExecute,
  onDismiss,
  className,
}: NextStepSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <Card className={cn(
      "border-primary/20 bg-primary/5 animate-in slide-in-from-bottom-4 duration-300",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">What's Next?</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="h-6 w-6"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => onExecute(suggestion.id)}
            className={cn(
              "w-full flex items-start gap-3 p-3 rounded-lg border transition-all",
              "hover:bg-accent hover:border-primary/30",
              "text-left touch-target",
              suggestion.priority === 'high' && "border-primary/30 bg-primary/5",
              suggestion.priority === 'medium' && "border-border",
              suggestion.priority === 'low' && "border-border/50"
            )}
          >
            <div className={cn(
              "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
              suggestion.priority === 'high' && "bg-primary/10 text-primary",
              suggestion.priority === 'medium' && "bg-accent text-accent-foreground",
              suggestion.priority === 'low' && "bg-muted text-muted-foreground"
            )}>
              {iconMap[suggestion.icon]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{suggestion.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {suggestion.description}
              </div>
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

// Compact version for mobile
export function NextStepSuggestionsCompact({
  suggestions,
  onExecute,
  onDismiss,
  className,
}: NextStepSuggestionsProps) {
  if (suggestions.length === 0) return null;

  const topSuggestion = suggestions[0];

  return (
    <div className={cn(
      "fixed bottom-20 left-4 right-4 z-30 animate-in slide-in-from-bottom-4 duration-300",
      className
    )}>
      <div className="bg-primary text-primary-foreground rounded-lg shadow-system-elevated p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm mb-1">{topSuggestion.title}</div>
            <div className="text-xs opacity-90">{topSuggestion.description}</div>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onExecute(topSuggestion.id)}
              className="h-8 text-primary-foreground hover:bg-white/20"
            >
              Do it
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDismiss}
              className="h-8 w-8 text-primary-foreground hover:bg-white/20"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
        {suggestions.length > 1 && (
          <div className="mt-2 text-xs opacity-75">
            +{suggestions.length - 1} more suggestion{suggestions.length > 2 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
