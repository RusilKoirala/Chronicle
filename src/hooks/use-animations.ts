import { useEffect, useState, useCallback } from 'react';
import { prefersReducedMotion, triggerHaptic, getStaggerDelay } from '@/lib/animations';

/**
 * Hook to detect reduced motion preference
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reducedMotion;
}

/**
 * Hook for staggered animations
 */
export function useStaggerAnimation(itemCount: number, baseDelay: number = 50) {
  const reducedMotion = useReducedMotion();

  const getDelay = useCallback(
    (index: number) => {
      if (reducedMotion) return 0;
      return getStaggerDelay(index, baseDelay);
    },
    [reducedMotion, baseDelay]
  );

  return { getDelay, reducedMotion };
}

/**
 * Hook for haptic feedback
 */
export function useHaptic() {
  const haptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    triggerHaptic(type);
  }, []);

  return haptic;
}

/**
 * Hook for celebration animations
 */
export function useCelebration() {
  const reducedMotion = useReducedMotion();

  const celebrate = useCallback(
    (type: 'achievement' | 'milestone' | 'streak' = 'achievement') => {
      if (reducedMotion) return;

      const event = new CustomEvent('chronicle:celebrate', {
        detail: { type },
      });
      window.dispatchEvent(event);
    },
    [reducedMotion]
  );

  return celebrate;
}

/**
 * Hook for mount animations
 */
export function useMountAnimation(delay: number = 0) {
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setMounted(true);
      return;
    }

    const timer = setTimeout(() => {
      setMounted(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, reducedMotion]);

  return mounted;
}

/**
 * Hook for scroll-triggered animations
 */
export function useScrollAnimation(threshold: number = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (!node || reducedMotion) {
        setIsVisible(true);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold }
      );

      observer.observe(node);

      return () => observer.disconnect();
    },
    [threshold, reducedMotion]
  );

  return { ref, isVisible };
}

/**
 * Hook for success animation
 */
export function useSuccessAnimation() {
  const [showSuccess, setShowSuccess] = useState(false);
  const reducedMotion = useReducedMotion();
  const haptic = useHaptic();

  const triggerSuccess = useCallback(() => {
    if (!reducedMotion) {
      setShowSuccess(true);
      haptic('medium');
      setTimeout(() => setShowSuccess(false), 500);
    }
  }, [reducedMotion, haptic]);

  return { showSuccess, triggerSuccess };
}

/**
 * Hook for error animation
 */
export function useErrorAnimation() {
  const [showError, setShowError] = useState(false);
  const reducedMotion = useReducedMotion();
  const haptic = useHaptic();

  const triggerError = useCallback(() => {
    if (!reducedMotion) {
      setShowError(true);
      haptic('heavy');
      setTimeout(() => setShowError(false), 400);
    }
  }, [reducedMotion, haptic]);

  return { showError, triggerError };
}

/**
 * Hook for loading animation state
 */
export function useLoadingAnimation(isLoading: boolean, minDuration: number = 300) {
  const [showLoading, setShowLoading] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (isLoading) {
      setShowLoading(true);
    } else if (showLoading) {
      // Keep loading state for minimum duration for smooth UX
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, reducedMotion ? 0 : minDuration);

      return () => clearTimeout(timer);
    }
  }, [isLoading, showLoading, minDuration, reducedMotion]);

  return showLoading;
}

/**
 * Hook for page transition animations
 */
export function usePageTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const reducedMotion = useReducedMotion();

  const startTransition = useCallback(() => {
    if (reducedMotion) return;
    setIsTransitioning(true);
  }, [reducedMotion]);

  const endTransition = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  return { isTransitioning, startTransition, endTransition };
}
