'use client';

import { usePathname } from 'next/navigation';
import { Navigation } from './navigation';

export function ConditionalNavigation() {
  const pathname = usePathname();
  
  // Don't show app navigation on landing page
  if (pathname === '/') {
    return null;
  }
  
  return <Navigation />;
}