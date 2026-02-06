'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion, useHaptic } from "@/hooks/use-animations";

interface TouchFeedbackProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
  disabled?: boolean;
  hapticFeedback?: boolean;
  pressAnimation?: boolean;
  rippleEffect?: boolean;
  hapticType?: 'light' | 'medium' | 'heavy';
}

const TouchFeedback = React.forwardRef<HTMLDivElement, TouchFeedbackProps>(
  ({ 
    children, 
    className,
    disabled = false,
    hapticFeedback = false,
    pressAnimation = true,
    rippleEffect = false,
    hapticType = 'light',
    onClick,
    onTouchStart,
    onTouchEnd,
    ...props 
  }, ref) => {
    const [isPressed, setIsPressed] = React.useState(false);
    const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);
    const rippleIdRef = React.useRef(0);
    const reducedMotion = useReducedMotion();
    const haptic = useHaptic();

    const handleTouchStart = React.useCallback((e: React.TouchEvent<HTMLDivElement>) => {
      if (disabled) return;
      
      setIsPressed(true);
      
      // Add haptic feedback on touch start
      if (hapticFeedback) {
        haptic(hapticType);
      }
      
      // Add ripple effect
      if (rippleEffect && !reducedMotion) {
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
    }, [disabled, rippleEffect, reducedMotion, hapticFeedback, haptic, hapticType, onTouchStart]);

    const handleTouchEnd = React.useCallback((e: React.TouchEvent<HTMLDivElement>) => {
      setIsPressed(false);
      onTouchEnd?.(e);
    }, [onTouchEnd]);

    const handleClick = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      
      // Add haptic feedback for mobile devices
      if (hapticFeedback) {
        haptic(hapticType);
      }
      
      onClick?.(e);
    }, [disabled, hapticFeedback, haptic, hapticType, onClick]);

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden touch-manipulation",
          !reducedMotion && "transition-all duration-200 ease-out",
          pressAnimation && isPressed && !reducedMotion && "scale-[0.98] opacity-90",
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
        {rippleEffect && !reducedMotion && ripples.map(ripple => (
          <span
            key={ripple.id}
            className="absolute pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
          >
            <span 
              className="absolute inline-flex rounded-full bg-current opacity-20"
              style={{
                width: 0,
                height: 0,
                animation: 'ripple 600ms ease-out',
              }}
            />
          </span>
        ))}
        
        <style jsx>{`
          @keyframes ripple {
            to {
              width: 100px;
              height: 100px;
              margin-left: -50px;
              margin-top: -50px;
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  }
);

TouchFeedback.displayName = "TouchFeedback";

export { TouchFeedback };
export type { TouchFeedbackProps };