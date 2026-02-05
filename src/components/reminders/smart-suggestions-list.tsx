'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSmartSuggestions } from '@/hooks/use-smart-suggestions';
import { useDeviceDetection } from '@/hooks/use-device-detection';
import { SmartSuggestion } from '@/types';
import { 
  Lightbulb, 
  ArrowRight, 
  Target, 
  TrendingUp, 
  Settings, 
  Heart,
  Clock,
  Star,
  X
} from 'lucide-react';

const suggestionTypeIcons: Record<SmartSuggestion['type'], React.ReactNode> = {
  'next-action': <ArrowRight className="h-4 w-4" />,
  'catch-up': <TrendingUp className="h-4 w-4" />,
  'optimization': <Settings className="h-4 w-4" />,
  'motivation': <Heart className="h-4 w-4" />
};

const priorityColors: Record<SmartSuggestion['priority'], string> = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

interface SuggestionCardProps {
  suggestion: SmartSuggestion;
  onAccept: (suggestion: SmartSuggestion) => void;
  onDismiss: (id: string) => void;
}

function SuggestionCard({ suggestion, onAccept, onDismiss }: SuggestionCardProps) {
  const { isMobile } = useDeviceDetection();
  
  const formatEstimatedTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <Card className={`${isMobile ? 'p-3' : 'p-4'} hover:shadow-md transition-shadow`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {suggestionTypeIcons[suggestion.type]}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className={`font-medium ${isMobile ? 'text-sm' : 'text-sm'}`}>
              {suggestion.title}
            </h4>
            <Badge className={`text-xs ${priorityColors[suggestion.priority]}`}>
              {suggestion.priority}
            </Badge>
          </div>
          
          <p className={`text-muted-foreground mb-2 ${isMobile ? 'text-sm' : 'text-sm'}`}>
            {suggestion.description}
          </p>
          
          <p className={`text-muted-foreground mb-3 italic ${isMobile ? 'text-xs' : 'text-xs'}`}>
            {suggestion.reasoning}
          </p>
          
          <div className={`flex items-center ${isMobile ? 'flex-col gap-2' : 'justify-between'}`}>
            <div className={`flex items-center gap-4 text-xs text-muted-foreground ${isMobile ? 'self-start' : ''}`}>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatEstimatedTime(suggestion.estimatedTime)}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {suggestion.points} points
              </div>
            </div>
            
            <div className={`flex items-center gap-1 ${isMobile ? 'self-end' : ''}`}>
              <Button
                size="sm"
                onClick={() => onAccept(suggestion)}
                className={`${isMobile ? 'h-8 px-3 text-xs' : 'h-7 px-3 text-xs'}`}
              >
                Accept
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDismiss(suggestion.id)}
                className={`${isMobile ? 'h-8 px-2 text-xs' : 'h-7 px-2 text-xs'} text-muted-foreground hover:text-destructive`}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function SmartSuggestionsList() {
  const { isMobile } = useDeviceDetection();
  const {
    suggestions,
    isLoading,
    error,
    deleteSuggestion,
    generateSuggestions,
    getSuggestionsByPriority
  } = useSmartSuggestions();

  React.useEffect(() => {
    // Generate suggestions on component mount only
    generateSuggestions();
    
    // Set up interval to generate suggestions periodically
    const interval = setInterval(() => {
      generateSuggestions();
    }, 10 * 60 * 1000); // Every 10 minutes

    return () => clearInterval(interval);
  }, []); // Empty dependency array to run only on mount

  const handleAcceptSuggestion = (suggestion: SmartSuggestion) => {
    // Handle different types of suggestions
    switch (suggestion.type) {
      case 'next-action':
        if (suggestion.actionData?.goalId) {
          // Navigate to goal or open goal edit modal
          window.location.href = `/goals?highlight=${suggestion.actionData.goalId}`;
        }
        break;
        
      case 'catch-up':
        if (suggestion.actionData?.taskIds) {
          // Navigate to tasks page with overdue filter
          window.location.href = '/tasks?filter=overdue';
        }
        break;
        
      case 'optimization':
        if (suggestion.actionData?.action === 'add-routine-today') {
          // Navigate to routines page
          window.location.href = '/routines';
        }
        break;
        
      case 'motivation':
        // Navigate to dashboard or achievements
        window.location.href = '/dashboard';
        break;
    }
    
    // Remove the suggestion after accepting
    deleteSuggestion(suggestion.id);
  };

  if (isLoading) {
    return (
      <Card className={isMobile ? 'p-4' : 'p-6'}>
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={isMobile ? 'p-4' : 'p-6'}>
        <div className="text-destructive">
          <p>Error loading suggestions: {error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-2"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  const highPrioritySuggestions = getSuggestionsByPriority('high');
  const mediumPrioritySuggestions = getSuggestionsByPriority('medium');
  const lowPrioritySuggestions = getSuggestionsByPriority('low');

  return (
    <div className="space-y-4">
      <div className={`flex items-center justify-between ${isMobile ? 'flex-col gap-3' : ''}`}>
        <div className={`flex items-center gap-2 ${isMobile ? 'self-start' : ''}`}>
          <Lightbulb className="h-5 w-5" />
          <h2 className={`font-semibold ${isMobile ? 'text-lg' : 'text-lg'}`}>Smart Suggestions</h2>
          {suggestions.length > 0 && (
            <Badge variant="default">{suggestions.length}</Badge>
          )}
        </div>
        
        <Button
          onClick={generateSuggestions}
          variant="outline"
          size="sm"
          className={isMobile ? 'self-end' : ''}
        >
          Refresh
        </Button>
      </div>

      {suggestions.length === 0 ? (
        <Card className={`${isMobile ? 'p-6' : 'p-8'} text-center`}>
          <Lightbulb className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'} text-muted-foreground mx-auto mb-4`} />
          <h3 className={`font-medium text-muted-foreground mb-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
            No suggestions available
          </h3>
          <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
            Keep using Chronicle and we'll provide personalized suggestions to help you stay productive!
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* High Priority Suggestions */}
          {highPrioritySuggestions.length > 0 && (
            <div>
              <h3 className={`font-medium text-muted-foreground mb-2 ${isMobile ? 'text-sm' : 'text-sm'}`}>
                High Priority
              </h3>
              <div className={`space-y-2 ${isMobile ? 'space-y-2' : ''}`}>
                {highPrioritySuggestions.map((suggestion) => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    onAccept={handleAcceptSuggestion}
                    onDismiss={deleteSuggestion}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Medium Priority Suggestions */}
          {mediumPrioritySuggestions.length > 0 && (
            <div>
              <h3 className={`font-medium text-muted-foreground mb-2 ${isMobile ? 'text-sm' : 'text-sm'}`}>
                Medium Priority
              </h3>
              <div className={`space-y-2 ${isMobile ? 'space-y-2' : ''}`}>
                {mediumPrioritySuggestions.map((suggestion) => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    onAccept={handleAcceptSuggestion}
                    onDismiss={deleteSuggestion}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Low Priority Suggestions */}
          {lowPrioritySuggestions.length > 0 && (
            <div>
              <h3 className={`font-medium text-muted-foreground mb-2 ${isMobile ? 'text-sm' : 'text-sm'}`}>
                Low Priority
              </h3>
              <div className={`space-y-2 ${isMobile ? 'space-y-2' : ''}`}>
                {lowPrioritySuggestions.map((suggestion) => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    onAccept={handleAcceptSuggestion}
                    onDismiss={deleteSuggestion}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}