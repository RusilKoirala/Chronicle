'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useNavigationState } from '@/hooks/use-navigation-patterns';

/**
 * Component that manages navigation state restoration
 * Automatically restores scroll position when navigating back to a page
 */
export function NavigationStateManager() {
  const pathname = usePathname();
  const { restoreScrollPosition, getStateForPage } = useNavigationState();

  useEffect(() => {
    if (!pathname) return;

    // Check if we have a saved state for this page
    const state = getStateForPage(pathname);
    
    if (state) {
      // Restore scroll position after a short delay to ensure content is loaded
      const timer = setTimeout(() => {
        restoreScrollPosition(pathname);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [pathname, restoreScrollPosition, getStateForPage]);

  // This component doesn't render anything
  return null;
}
