'use client';

import { ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/hooks/use-device-detection';

interface LoginLayoutProps {
  children: ReactNode;
  className?: string;
}

export function LoginLayout({ children, className }: LoginLayoutProps) {
  const { isMobileApp } = useDeviceDetection();

  // Prevent scrolling on login page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div 
      data-login-page
      className={cn(
        "min-h-screen bg-gradient-to-br from-background to-muted",
        // Mobile app specific styles
        isMobileApp && [
          "safe-area-inset-top safe-area-inset-bottom",
        ],
        // Prevent scrolling on all devices for login
        "overflow-hidden h-screen",
        className
      )}
    >
      <div className={cn(
        "h-full flex items-center justify-center",
        // Consistent mobile padding
        isMobileApp ? "px-4" : "px-4",
        // Prevent any scrolling
        "overflow-hidden"
      )}>
        {children}
      </div>
    </div>
  );
}