'use client';

import { usePathname } from 'next/navigation';
import { OptimizedNavigation } from './optimized-navigation';

export function ConditionalNavigation() {
  const pathname = usePathname();
  
  // Don't show app navigation on landing page, login page, or auth callback pages
  if (pathname === '/' || 
      pathname === '/login' || 
      pathname.startsWith('/auth/') || 
      pathname === '/callback') {
    return null;
  }
  
  return <OptimizedNavigation />;
}