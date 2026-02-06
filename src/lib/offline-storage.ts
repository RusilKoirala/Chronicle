/**
 * Offline-aware storage utilities
 * Provides caching and offline support for data operations
 */

export const OFFLINE_CACHE_KEYS = {
  TASKS_CACHE: 'chronicle_tasks_cache',
  GOALS_CACHE: 'chronicle_goals_cache',
  ACHIEVEMENTS_CACHE: 'chronicle_achievements_cache',
  RESOURCES_CACHE: 'chronicle_resources_cache',
  ROUTINES_CACHE: 'chronicle_routines_cache',
  LAST_SYNC: 'chronicle_last_sync',
} as const;

export interface CacheMetadata {
  timestamp: number;
  version: string;
  userId?: string;
}

export interface CachedData<T> {
  data: T[];
  metadata: CacheMetadata;
}

/**
 * Offline storage manager for caching data
 */
export const offlineStorage = {
  /**
   * Get cached data with metadata
   */
  getCache: <T>(key: string): CachedData<T> | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const cached = JSON.parse(item) as CachedData<T>;
      
      // Check if cache is still valid (24 hours)
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      const age = Date.now() - cached.metadata.timestamp;
      
      if (age > maxAge) {
        // Cache expired
        localStorage.removeItem(key);
        return null;
      }
      
      return cached;
    } catch (error) {
      console.error(`Error reading cache for key "${key}":`, error);
      return null;
    }
  },

  /**
   * Set cached data with metadata
   */
  setCache: <T>(key: string, data: T[], userId?: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const cached: CachedData<T> = {
        data,
        metadata: {
          timestamp: Date.now(),
          version: '1.0',
          userId,
        },
      };
      
      localStorage.setItem(key, JSON.stringify(cached));
    } catch (error) {
      console.error(`Error writing cache for key "${key}":`, error);
      
      // If quota exceeded, try to clear old caches
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        offlineStorage.clearOldCaches();
        
        // Try again after clearing
        try {
          const cached: CachedData<T> = {
            data,
            metadata: {
              timestamp: Date.now(),
              version: '1.0',
              userId,
            },
          };
          localStorage.setItem(key, JSON.stringify(cached));
        } catch (retryError) {
          console.error('Failed to cache data even after cleanup:', retryError);
        }
      }
    }
  },

  /**
   * Get just the data without metadata
   */
  getData: <T>(key: string): T[] => {
    const cached = offlineStorage.getCache<T>(key);
    return cached?.data || [];
  },

  /**
   * Check if cache exists and is valid
   */
  hasValidCache: (key: string): boolean => {
    const cached = offlineStorage.getCache(key);
    return cached !== null;
  },

  /**
   * Clear a specific cache
   */
  clearCache: (key: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error clearing cache for key "${key}":`, error);
    }
  },

  /**
   * Clear all app caches
   */
  clearAllCaches: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      Object.values(OFFLINE_CACHE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing all caches:', error);
    }
  },

  /**
   * Clear old/expired caches to free up space
   */
  clearOldCaches: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
      const now = Date.now();
      
      Object.values(OFFLINE_CACHE_KEYS).forEach(key => {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const cached = JSON.parse(item);
            const age = now - (cached.metadata?.timestamp || 0);
            
            if (age > maxAge) {
              localStorage.removeItem(key);
            }
          }
        } catch (error) {
          // If we can't parse it, remove it
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing old caches:', error);
    }
  },

  /**
   * Get cache size information
   */
  getCacheInfo: () => {
    if (typeof window === 'undefined') return null;
    
    try {
      let totalSize = 0;
      const cacheInfo: Record<string, number> = {};
      
      Object.entries(OFFLINE_CACHE_KEYS).forEach(([name, key]) => {
        const item = localStorage.getItem(key);
        if (item) {
          const size = new Blob([item]).size;
          cacheInfo[name] = size;
          totalSize += size;
        }
      });
      
      return {
        totalSize,
        totalSizeKB: (totalSize / 1024).toFixed(2),
        caches: cacheInfo,
      };
    } catch (error) {
      console.error('Error getting cache info:', error);
      return null;
    }
  },

  /**
   * Update last sync timestamp
   */
  updateLastSync: (entity?: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const lastSync = JSON.parse(
        localStorage.getItem(OFFLINE_CACHE_KEYS.LAST_SYNC) || '{}'
      );
      
      if (entity) {
        lastSync[entity] = Date.now();
      } else {
        lastSync.global = Date.now();
      }
      
      localStorage.setItem(OFFLINE_CACHE_KEYS.LAST_SYNC, JSON.stringify(lastSync));
    } catch (error) {
      console.error('Error updating last sync:', error);
    }
  },

  /**
   * Get last sync timestamp
   */
  getLastSync: (entity?: string): number | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const lastSync = JSON.parse(
        localStorage.getItem(OFFLINE_CACHE_KEYS.LAST_SYNC) || '{}'
      );
      
      return entity ? lastSync[entity] || null : lastSync.global || null;
    } catch (error) {
      console.error('Error getting last sync:', error);
      return null;
    }
  },
};
