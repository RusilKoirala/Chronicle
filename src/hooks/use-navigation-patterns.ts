'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface NavigationPattern {
  path: string;
  visitCount: number;
  lastVisited: number;
  averageTimeSpent: number;
  totalTimeSpent: number;
}

interface NavigationState {
  path: string;
  scrollPosition: number;
  timestamp: number;
}

const STORAGE_KEY = 'chronicle_navigation_patterns';
const STATE_STORAGE_KEY = 'chronicle_navigation_state';
const MAX_PATTERNS = 50;
const PATTERN_DECAY_DAYS = 30;

/**
 * Hook for tracking and learning user navigation patterns
 * Provides intelligent content surfacing based on user behavior
 */
export function useNavigationPatterns() {
  const pathname = usePathname();
  const [patterns, setPatterns] = useState<Record<string, NavigationPattern>>({});
  const [frequentPages, setFrequentPages] = useState<string[]>([]);
  const [recentPages, setRecentPages] = useState<string[]>([]);
  const [pageEntryTime, setPageEntryTime] = useState<number>(Date.now());

  // Load patterns from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Clean up old patterns
        const now = Date.now();
        const cleaned = Object.entries(parsed).reduce((acc, [key, value]) => {
          const pattern = value as NavigationPattern;
          const daysSinceVisit = (now - pattern.lastVisited) / (1000 * 60 * 60 * 24);
          if (daysSinceVisit < PATTERN_DECAY_DAYS) {
            acc[key] = pattern;
          }
          return acc;
        }, {} as Record<string, NavigationPattern>);
        setPatterns(cleaned);
      }
    } catch (error) {
      console.error('Failed to load navigation patterns:', error);
    }
  }, []);

  // Track page visit and time spent
  useEffect(() => {
    if (!pathname || pathname === '/login' || pathname.startsWith('/auth/')) return;

    const entryTime = Date.now();
    setPageEntryTime(entryTime);

    // Record page visit
    const updatePatterns = () => {
      setPatterns((prev) => {
        const existing = prev[pathname];
        const now = Date.now();
        const timeSpent = now - entryTime;

        const updated = {
          ...prev,
          [pathname]: {
            path: pathname,
            visitCount: (existing?.visitCount || 0) + 1,
            lastVisited: now,
            totalTimeSpent: (existing?.totalTimeSpent || 0) + timeSpent,
            averageTimeSpent: existing
              ? (existing.totalTimeSpent + timeSpent) / (existing.visitCount + 1)
              : timeSpent,
          },
        };

        // Limit stored patterns
        const entries = Object.entries(updated);
        if (entries.length > MAX_PATTERNS) {
          // Keep most recently visited
          entries.sort((a, b) => b[1].lastVisited - a[1].lastVisited);
          return Object.fromEntries(entries.slice(0, MAX_PATTERNS));
        }

        // Save to localStorage
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (error) {
          console.error('Failed to save navigation patterns:', error);
        }

        return updated;
      });
    };

    // Update on page leave
    return () => {
      updatePatterns();
    };
  }, [pathname]);

  // Calculate frequent and recent pages
  useEffect(() => {
    const entries = Object.entries(patterns);
    
    // Most frequently visited pages
    const frequent = entries
      .sort((a, b) => b[1].visitCount - a[1].visitCount)
      .slice(0, 5)
      .map(([path]) => path);
    setFrequentPages(frequent);

    // Most recently visited pages
    const recent = entries
      .sort((a, b) => b[1].lastVisited - a[1].lastVisited)
      .slice(0, 5)
      .map(([path]) => path);
    setRecentPages(recent);
  }, [patterns]);

  // Get suggested pages based on patterns
  const getSuggestedPages = (limit: number = 3): string[] => {
    const now = Date.now();
    const entries = Object.entries(patterns);

    // Score based on recency and frequency
    const scored = entries.map(([path, pattern]) => {
      const recencyScore = 1 / (1 + (now - pattern.lastVisited) / (1000 * 60 * 60 * 24)); // Decay over days
      const frequencyScore = Math.log(pattern.visitCount + 1);
      const timeScore = Math.log(pattern.averageTimeSpent + 1) / 10;
      
      return {
        path,
        score: recencyScore * 0.4 + frequencyScore * 0.4 + timeScore * 0.2,
      };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.path);
  };

  // Get pattern for specific page
  const getPatternForPage = (path: string): NavigationPattern | null => {
    return patterns[path] || null;
  };

  // Clear all patterns (for testing or user preference)
  const clearPatterns = () => {
    setPatterns({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear navigation patterns:', error);
    }
  };

  return {
    patterns,
    frequentPages,
    recentPages,
    getSuggestedPages,
    getPatternForPage,
    clearPatterns,
  };
}

/**
 * Hook for preserving and restoring navigation state (scroll position, etc.)
 */
export function useNavigationState() {
  const pathname = usePathname();
  const [states, setStates] = useState<Record<string, NavigationState>>({});

  // Load states from sessionStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = sessionStorage.getItem(STATE_STORAGE_KEY);
      if (stored) {
        setStates(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load navigation state:', error);
    }
  }, []);

  // Save scroll position before leaving page
  useEffect(() => {
    if (!pathname) return;

    const saveScrollPosition = () => {
      const scrollPosition = window.scrollY;
      
      setStates((prev) => {
        const updated = {
          ...prev,
          [pathname]: {
            path: pathname,
            scrollPosition,
            timestamp: Date.now(),
          },
        };

        try {
          sessionStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(updated));
        } catch (error) {
          console.error('Failed to save navigation state:', error);
        }

        return updated;
      });
    };

    // Save on scroll (debounced)
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(saveScrollPosition, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
      saveScrollPosition();
    };
  }, [pathname]);

  // Restore scroll position when returning to page
  const restoreScrollPosition = (path: string) => {
    const state = states[path];
    if (state && state.scrollPosition > 0) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        window.scrollTo({
          top: state.scrollPosition,
          behavior: 'instant' as ScrollBehavior,
        });
      });
    }
  };

  // Get state for specific page
  const getStateForPage = (path: string): NavigationState | null => {
    return states[path] || null;
  };

  // Clear all states
  const clearStates = () => {
    setStates({});
    try {
      sessionStorage.removeItem(STATE_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear navigation state:', error);
    }
  };

  return {
    states,
    restoreScrollPosition,
    getStateForPage,
    clearStates,
  };
}
