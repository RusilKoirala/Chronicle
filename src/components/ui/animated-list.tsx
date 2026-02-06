'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useStaggerAnimation, useReducedMotion } from '@/hooks/use-animations';

interface AnimatedListProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
  animation?: 'fade' | 'slide' | 'scale';
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function AnimatedList({
  children,
  className,
  staggerDelay = 50,
  animation = 'slide',
  direction = 'up',
}: AnimatedListProps) {
  const { getDelay, reducedMotion } = useStaggerAnimation(children.length, staggerDelay);

  const animationClasses = {
    fade: 'animate-fade-in',
    slide: {
      up: 'animate-slide-in-bottom',
      down: 'animate-slide-in-top',
      left: 'animate-slide-in-right',
      right: 'animate-slide-in-left',
    },
    scale: 'animate-scale-in',
  };

  const getAnimationClass = () => {
    if (reducedMotion) return '';
    if (animation === 'slide') {
      return animationClasses.slide[direction];
    }
    return animationClasses[animation];
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className={getAnimationClass()}
          style={{
            animationDelay: `${getDelay(index)}ms`,
            animationFillMode: 'both',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

interface AnimatedGridProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
  columns?: number;
}

export function AnimatedGrid({
  children,
  className,
  staggerDelay = 50,
  columns = 2,
}: AnimatedGridProps) {
  const { getDelay, reducedMotion } = useStaggerAnimation(children.length, staggerDelay);

  return (
    <div
      className={cn('grid gap-4', className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className={!reducedMotion ? 'animate-scale-in' : ''}
          style={{
            animationDelay: `${getDelay(index)}ms`,
            animationFillMode: 'both',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

interface AnimatedPresenceProps {
  children: React.ReactNode;
  show: boolean;
  animation?: 'fade' | 'slide' | 'scale';
  duration?: number;
}

export function AnimatedPresence({
  children,
  show,
  animation = 'fade',
  duration = 200,
}: AnimatedPresenceProps) {
  const [shouldRender, setShouldRender] = React.useState(show);
  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    if (show) {
      setShouldRender(true);
    } else if (!reducedMotion) {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setShouldRender(false);
    }
  }, [show, duration, reducedMotion]);

  if (!shouldRender) return null;

  const animationClasses = {
    fade: show ? 'animate-fade-in' : 'animate-fade-out',
    slide: show ? 'animate-slide-in-bottom' : 'animate-fade-out',
    scale: show ? 'animate-scale-in' : 'animate-scale-out',
  };

  return (
    <div className={!reducedMotion ? animationClasses[animation] : ''}>
      {children}
    </div>
  );
}

