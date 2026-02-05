'use client';

import { useEffect, useRef } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export function useSwipeGestures(handlers: SwipeHandlers) {
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const onTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchStartY.current) return;

    const distanceX = touchStartX.current - touchEndX.current;
    const distanceY = touchStartY.current - touchEndY.current;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isUpSwipe = distanceY > minSwipeDistance;
    const isDownSwipe = distanceY < -minSwipeDistance;

    if (isLeftSwipe && handlers.onSwipeLeft) {
      handlers.onSwipeLeft();
    }
    if (isRightSwipe && handlers.onSwipeRight) {
      handlers.onSwipeRight();
    }
    if (isUpSwipe && handlers.onSwipeUp) {
      handlers.onSwipeUp();
    }
    if (isDownSwipe && handlers.onSwipeDown) {
      handlers.onSwipeDown();
    }
  };

  useEffect(() => {
    document.addEventListener('touchstart', onTouchStart);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [handlers]);
}

export function usePullToRefresh(onRefresh: () => void) {
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const isRefreshing = useRef<boolean>(false);

  const onTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const onTouchMove = (e: TouchEvent) => {
    if (window.scrollY === 0 && !isRefreshing.current) {
      currentY.current = e.touches[0].clientY;
      const pullDistance = currentY.current - startY.current;
      
      if (pullDistance > 100) {
        // Add visual feedback here if needed
      }
    }
  };

  const onTouchEnd = () => {
    if (window.scrollY === 0 && !isRefreshing.current) {
      const pullDistance = currentY.current - startY.current;
      
      if (pullDistance > 100) {
        isRefreshing.current = true;
        onRefresh();
        setTimeout(() => {
          isRefreshing.current = false;
        }, 1000);
      }
    }
    
    startY.current = 0;
    currentY.current = 0;
  };

  useEffect(() => {
    document.addEventListener('touchstart', onTouchStart);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [onRefresh]);
}