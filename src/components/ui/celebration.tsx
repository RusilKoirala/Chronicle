'use client';

import * as React from 'react';
import { useReducedMotion } from '@/hooks/use-animations';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
}

interface CelebrationProps {
  type?: 'achievement' | 'milestone' | 'streak';
  duration?: number;
}

export function Celebration({ type = 'achievement', duration = 3000 }: CelebrationProps) {
  const [confetti, setConfetti] = React.useState<ConfettiPiece[]>([]);
  const [isActive, setIsActive] = React.useState(false);
  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    if (reducedMotion) return;

    const handleCelebrate = (e: CustomEvent) => {
      if (e.detail.type === type) {
        trigger();
      }
    };

    window.addEventListener('chronicle:celebrate', handleCelebrate as EventListener);
    return () => {
      window.removeEventListener('chronicle:celebrate', handleCelebrate as EventListener);
    };
  }, [type, reducedMotion]);

  const trigger = React.useCallback(() => {
    if (reducedMotion) return;

    setIsActive(true);

    const colors = [
      '#FF6B6B', // Red
      '#4ECDC4', // Teal
      '#45B7D1', // Blue
      '#FFA07A', // Orange
      '#98D8C8', // Mint
      '#F7DC6F', // Yellow
      '#BB8FCE', // Purple
    ];

    const pieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -20,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      velocity: {
        x: (Math.random() - 0.5) * 4,
        y: Math.random() * 3 + 2,
      },
    }));

    setConfetti(pieces);

    setTimeout(() => {
      setIsActive(false);
      setConfetti([]);
    }, duration);
  }, [duration, reducedMotion]);

  if (!isActive || reducedMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: piece.x,
            top: piece.y,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: '2px',
            animation: `confetti ${duration}ms ease-out forwards`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

interface SuccessCheckmarkProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SuccessCheckmark({ size = 'md', className }: SuccessCheckmarkProps) {
  const reducedMotion = useReducedMotion();

  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div
      className={`${sizeMap[size]} ${className} ${
        !reducedMotion ? 'animate-scale-in' : ''
      }`}
    >
      <svg
        viewBox="0 0 52 52"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="stroke-success fill-none"
          cx="26"
          cy="26"
          r="25"
          strokeWidth="2"
          style={{
            strokeDasharray: 166,
            strokeDashoffset: reducedMotion ? 0 : 166,
            animation: reducedMotion ? 'none' : 'checkmark-circle 0.6s ease-in-out forwards',
          }}
        />
        <path
          className="stroke-success fill-none"
          d="M14.1 27.2l7.1 7.2 16.7-16.8"
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            strokeDasharray: 48,
            strokeDashoffset: reducedMotion ? 0 : 48,
            animation: reducedMotion ? 'none' : 'checkmark-check 0.3s 0.6s ease-in-out forwards',
          }}
        />
      </svg>
      <style jsx>{`
        @keyframes checkmark-circle {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes checkmark-check {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}

interface ErrorCrossProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ErrorCross({ size = 'md', className }: ErrorCrossProps) {
  const reducedMotion = useReducedMotion();

  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div
      className={`${sizeMap[size]} ${className} ${
        !reducedMotion ? 'animate-shake' : ''
      }`}
    >
      <svg
        viewBox="0 0 52 52"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="stroke-destructive fill-none"
          cx="26"
          cy="26"
          r="25"
          strokeWidth="2"
        />
        <path
          className="stroke-destructive fill-none"
          d="M16 16 36 36 M36 16 16 36"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const reducedMotion = useReducedMotion();

  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={`${sizeMap[size]} ${className} rounded-full border-primary/20 border-t-primary ${
        !reducedMotion ? 'animate-spin' : ''
      }`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface PulseDotsProps {
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PulseDots({ count = 3, size = 'md', className }: PulseDotsProps) {
  const reducedMotion = useReducedMotion();

  const sizeMap = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  return (
    <div className={`flex gap-1.5 items-center ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${sizeMap[size]} rounded-full bg-primary ${
            !reducedMotion ? 'animate-pulse' : ''
          }`}
          style={{
            animationDelay: reducedMotion ? '0ms' : `${i * 150}ms`,
          }}
        />
      ))}
    </div>
  );
}
