'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureTooltipProps {
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onDismiss: () => void;
  className?: string;
}

export function FeatureTooltip({
  title,
  description,
  position = 'bottom',
  onDismiss,
  className
}: FeatureTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay showing tooltip for smooth animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 200);
  };

  return (
    <div
      className={cn(
        "absolute z-50 transition-all duration-200",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
        position === 'bottom' && "top-full mt-2",
        position === 'top' && "bottom-full mb-2",
        position === 'left' && "right-full mr-2",
        position === 'right' && "left-full ml-2",
        className
      )}
    >
      <Card className="shadow-lg border-2 border-primary/20 max-w-xs">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1">{title}</h4>
              <p className="text-xs text-muted-foreground mb-3">{description}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDismiss}
                className="w-full"
              >
                Got it!
              </Button>
            </div>
            <button
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
