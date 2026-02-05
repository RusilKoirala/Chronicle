'use client';

import { useCallback, useRef, useEffect } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export function useSwipeGestures(handlers: SwipeHandlers, element?: HTMLElement | null) {
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const minSwipeDistance = 50;

  const onTouchStart = useCallback((e: Event) => {
    const touchEvent = e as TouchEvent;
    touchStartX.current = touchEvent.touches[0].clientX;
    touchStartY.current = touchEvent.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback((e: Event) => {
    const touchEvent = e as TouchEvent;
    if (!touchEvent.changedTouches.length) return;

    const touchEndX = touchEvent.changedTouches[0].clientX;
    const touchEndY = touchEvent.changedTouches[0].clientY;
    
    const distanceX = touchStartX.current - touchEndX;
    const distanceY = touchStartY.current - touchEndY;
    
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
    
    if (Math.abs(distanceX) > minSwipeDistance || Math.abs(distanceY) > minSwipeDistance) {
      if (isHorizontalSwipe) {
        if (distanceX > 0) {
          handlers.onSwipeLeft?.();
        } else {
          handlers.onSwipeRight?.();
        }
      } else {
        if (distanceY > 0) {
          handlers.onSwipeUp?.();
        } else {
          handlers.onSwipeDown?.();
        }
      }
    }
  }, [handlers, minSwipeDistance]);

  useEffect(() => {
    const target = element || document;
    
    target.addEventListener('touchstart', onTouchStart, { passive: true });
    target.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      target.removeEventListener('touchstart', onTouchStart);
      target.removeEventListener('touchend', onTouchEnd);
    };
  }, [element, onTouchStart, onTouchEnd]);
}

// Simple tap gesture hook
export function useTapGesture(onTap: () => void, element?: HTMLElement | null) {
  const onTouchEnd = useCallback((e: Event) => {
    e.preventDefault();
    onTap();
  }, [onTap]);

  useEffect(() => {
    const target = element || document;
    
    target.addEventListener('touchend', onTouchEnd, { passive: false });

    return () => {
      target.removeEventListener('touchend', onTouchEnd);
    };
  }, [element, onTouchEnd]);
}