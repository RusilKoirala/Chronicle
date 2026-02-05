'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SmartSuggestion } from '@/hooks/use-dashboard-data';
import { 
  Lightbulb, 
  Clock, 
  ArrowRight,
  Target,
  CheckSquare,
  Repeat
} from 'lucide-react';

interface SmartSuggestionsProps {
  suggestions: SmartSuggestion[];
  onActionClick?: (suggestion: SmartSuggestion) => void;
}

export function SmartSuggestionsSection({ suggestions, onActionClick }: SmartSuggestionsProps) {
  if (suggestions.length === 0) {
    return null;
  }

  const getIcon = (type: SmartSuggestion['type']) => {
    switch (type) {
      case 'task':
        return CheckSquare;
      case 'goal':
        return Target;
      case 'routine':
        return Repeat;
      default:
        return Lightbulb;
    }
  };

  const getPriorityIndicator = (priority: SmartSuggestion['priority']) => {
    switch (priority) {
      case 'high':
        return { symbol: '●', color: 'text-red-500' };
      case 'medium':
        return { symbol: '●', color: 'text-yellow-500' };
      case 'low':
        return { symbol: '●', color: 'text-green-500' };
      default:
        return { symbol: '●', color: 'text-gray-400' };
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          Suggested Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion) => {
          const Icon = getIcon(suggestion.type);
          
          return (
            <div 
              key={suggestion.id} 
              className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium leading-tight">{suggestion.title}</h4>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className={`${getPriorityIndicator(suggestion.priority).color}`}>
                        {getPriorityIndicator(suggestion.priority).symbol}
                      </span>
                      <span className="capitalize">{suggestion.priority}</span>
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {suggestion.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {suggestion.estimatedTime}m
                      </span>
                    </div>
                    
                    {onActionClick && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onActionClick(suggestion)}
                        className="h-7 px-2 text-xs"
                      >
                        Take Action
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                  
                  {/* Reasoning tooltip or expandable section */}
                  <details className="text-xs">
                    <summary className="text-muted-foreground cursor-pointer hover:text-foreground">
                      Why this suggestion?
                    </summary>
                    <p className="mt-1 text-muted-foreground leading-relaxed">
                      {suggestion.reasoning}
                    </p>
                  </details>
                </div>
              </div>
            </div>
          );
        })}
        
        {suggestions.length === 0 && (
          <div className="text-center py-4">
            <Lightbulb className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No suggestions right now. Keep up the great work!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}