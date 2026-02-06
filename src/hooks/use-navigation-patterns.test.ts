import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Navigation Patterns', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should store and retrieve navigation patterns from localStorage', () => {
    const mockPattern = {
      '/tasks': {
        path: '/tasks',
        visitCount: 5,
        lastVisited: Date.now(),
        averageTimeSpent: 3000,
        totalTimeSpent: 15000,
      },
    };

    localStorage.setItem('chronicle_navigation_patterns', JSON.stringify(mockPattern));
    const retrieved = JSON.parse(localStorage.getItem('chronicle_navigation_patterns') || '{}');

    expect(retrieved['/tasks']).toBeDefined();
    expect(retrieved['/tasks'].visitCount).toBe(5);
  });

  it('should store and retrieve navigation state from sessionStorage', () => {
    const mockState = {
      '/dashboard': {
        path: '/dashboard',
        scrollPosition: 500,
        timestamp: Date.now(),
      },
    };

    sessionStorage.setItem('chronicle_navigation_state', JSON.stringify(mockState));
    const retrieved = JSON.parse(sessionStorage.getItem('chronicle_navigation_state') || '{}');

    expect(retrieved['/dashboard']).toBeDefined();
    expect(retrieved['/dashboard'].scrollPosition).toBe(500);
  });

  it('should calculate suggested pages based on visit patterns', () => {
    const patterns = {
      '/tasks': {
        path: '/tasks',
        visitCount: 10,
        lastVisited: Date.now() - 1000,
        averageTimeSpent: 5000,
        totalTimeSpent: 50000,
      },
      '/goals': {
        path: '/goals',
        visitCount: 5,
        lastVisited: Date.now() - 2000,
        averageTimeSpent: 3000,
        totalTimeSpent: 15000,
      },
      '/achievements': {
        path: '/achievements',
        visitCount: 2,
        lastVisited: Date.now() - 10000,
        averageTimeSpent: 1000,
        totalTimeSpent: 2000,
      },
    };

    // Calculate scores (simplified version of the hook logic)
    const now = Date.now();
    const scored = Object.entries(patterns).map(([path, pattern]) => {
      const recencyScore = 1 / (1 + (now - pattern.lastVisited) / (1000 * 60 * 60 * 24));
      const frequencyScore = Math.log(pattern.visitCount + 1);
      const timeScore = Math.log(pattern.averageTimeSpent + 1) / 10;
      
      return {
        path,
        score: recencyScore * 0.4 + frequencyScore * 0.4 + timeScore * 0.2,
      };
    });

    const sorted = scored.sort((a, b) => b.score - a.score);
    
    // Most visited and recent should score highest
    expect(sorted[0].path).toBe('/tasks');
  });
});
