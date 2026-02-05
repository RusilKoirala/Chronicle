'use client';

import * as React from "react";
import { cn } from "@/lib/utils";

interface TouchFeedbackProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
  disabled?: boolean;
  hapticFeedback?: boolean;
  pressAnimation?: boolean;
  rippleEffect?: boolean;
}

const TouchFeedback = React.forwardRef<HTMLDivElement, TouchFeedbackProps>(
  ({ 
    children, 
    className,
    disabled = false,
    hapticFeedback = false,
    pressAnimation = true,
    rippleEffect = false,
    onClick,
    onTouchStart,
    onTouchEnd,
    ...props 
  }, ref) => {
    const [isPressed, setIsPressed] = React.useState(false);
    const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);
    const rippleIdRef = React.useRef(0);

    const handleTouchStart = React.useCallback((e: React.TouchEvent<HTMLDivElement>) => {
      if (disabled) return;
      
      setIsPressed(true);
      
      // Add ripple effect
      if (rippleEffect) {
        const rect = e.currentTarget.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        const newRipple = {
          id: rippleIdRef.current++,
          x,
          y,
        };
        
        setRipples(prev => [...prev, newRipple]);
        
        // Remove ripple after animation
        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
        }, 600);
      }
      
      onTouchStart?.(e);
    }, [disabled, rippleEffect, onTouchStart]);

    const handleTouchEnd = React.useCallback((e: React.TouchEvent<HTMLDivElement>) => {
      setIsPressed(false);
      onTouchEnd?.(e);
    }, [onTouchEnd]);

    const handleClick = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      
      // Add haptic feedback for mobile devices
      if (hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }
      
      onClick?.(e);
    }, [disabled, hapticFeedback, onClick]);

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden transition-all duration-200 ease-out touch-manipulation",
          pressAnimation && isPressed && "scale-[0.98] opacity-80",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        {...props}
      >
        {children}
        
        {/* Ripple effects */}
        {rippleEffect && ripples.map(ripple => (
          <span
            key={ripple.id}
            className="absolute pointer-events-none animate-ping"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
            }}
          >
            <span className="absolute inline-flex h-full w-full rounded-full bg-current opacity-20" />
          </span>
        ))}
      </div>
    );
  }
);

TouchFeedback.displayName = "TouchFeedback";

export { TouchFeedback };
export type { TouchFeedbackProps };