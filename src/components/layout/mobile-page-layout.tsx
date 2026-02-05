'use client';

import { cn } from '@/lib/utils';

interface MobilePageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export function MobilePageLayout({ 
  children, 
  title, 
  subtitle, 
  className 
}: MobilePageLayoutProps) {
  return (
    <div className={cn("container mx-auto p-4 max-w-6xl", className)}>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
        {subtitle && (
          <p className="text-muted-foreground text-sm md:text-base">
            {subtitle}
          </p>
        )}
      </div>
      
      {/* Page Content */}
      <div className="pb-safe-area">
        {children}
      </div>
    </div>
  );
}