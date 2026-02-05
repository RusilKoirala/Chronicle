'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface ConditionalMainLayoutProps {
  children: ReactNode;
}

export function ConditionalMainLayout({ children }: ConditionalMainLayoutProps) {
  const pathname = usePathname();
  
  // Special layout for login page and auth pages - no padding, no navigation space
  if (pathname === '/login' || 
      pathname.startsWith('/auth/') || 
      pathname === '/callback') {
    return <>{children}</>;
  }
  
  // Regular app layout with navigation space
  return (
    <main className="min-h-screen bg-background pb-28 lg:pb-0">
      <div className="safe-area-inset">
        {children}
      </div>
    </main>
  );
}