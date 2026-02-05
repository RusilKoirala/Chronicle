'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/hooks/use-device-detection';

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

export function MobileLayout({ children, className }: MobileLayoutProps) {
  const { isMobileApp } = useDeviceDetection();

  return (
    <div className={cn(
      "min-h-screen bg-background",
      // Mobile app specific styles
      isMobileApp && [
        "safe-area-inset-top safe-area-inset-bottom",
        "overflow-x-hidden"
      ],
      className
    )}>
      <div className={cn(
        "container mx-auto",
        // Consistent mobile padding
        isMobileApp ? "px-4 py-4" : "px-4 py-6",
        // Max width for better mobile experience
        "max-w-6xl"
      )}>
        {children}
      </div>
    </div>
  );
}

interface MobilePageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function MobilePageHeader({ 
  title, 
  description, 
  icon, 
  action, 
  className 
}: MobilePageHeaderProps) {
  const { isMobileApp } = useDeviceDetection();

  return (
    <div className={cn(
      "mb-6",
      // Consistent mobile header spacing
      isMobileApp && "mb-4",
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <h1 className={cn(
          "font-bold flex items-center gap-2",
          // Responsive text sizing
          isMobileApp ? "text-xl" : "text-2xl md:text-3xl"
        )}>
          {icon}
          {title}
        </h1>
        {action && (
          <div className="hidden sm:block">
            {action}
          </div>
        )}
      </div>
      {description && (
        <p className={cn(
          "text-muted-foreground",
          isMobileApp ? "text-sm" : "text-sm md:text-base"
        )}>
          {description}
        </p>
      )}
      {action && (
        <div className="sm:hidden mt-3">
          {action}
        </div>
      )}
    </div>
  );
}

interface MobileCardGridProps {
  children: ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  className?: string;
}

export function MobileCardGrid({ 
  children, 
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  className 
}: MobileCardGridProps) {
  const { isMobileApp } = useDeviceDetection();

  return (
    <div className={cn(
      "grid gap-4",
      // Responsive grid columns
      `grid-cols-${columns.mobile || 1}`,
      `sm:grid-cols-${columns.tablet || 2}`,
      `lg:grid-cols-${columns.desktop || 3}`,
      // Tighter spacing on mobile app
      isMobileApp && "gap-3",
      className
    )}>
      {children}
    </div>
  );
}

interface MobileCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function MobileCard({ 
  children, 
  className, 
  hover = true,
  onClick 
}: MobileCardProps) {
  const { isMobileApp } = useDeviceDetection();
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={cn(
        "bg-card text-card-foreground rounded-lg border shadow-sm",
        // Mobile app optimizations
        isMobileApp && [
          "touch-manipulation", // Better touch handling
          "active:scale-[0.98]", // Touch feedback
        ],
        // Hover effects (disabled on mobile app for better performance)
        hover && !isMobileApp && "hover:shadow-md transition-all duration-200",
        onClick && [
          "cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        ],
        className
      )}
    >
      {children}
    </Component>
  );
}

interface MobileButtonProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function MobileButton({ 
  children, 
  className, 
  variant = 'default',
  size = 'md',
  fullWidth = false,
  onClick,
  disabled = false,
  type = 'button'
}: MobileButtonProps) {
  const { isMobileApp } = useDeviceDetection();

  const baseClasses = cn(
    "inline-flex items-center justify-center rounded-md font-medium",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:pointer-events-none",
    // Mobile app optimizations
    isMobileApp && [
      "touch-manipulation",
      "active:scale-[0.98]",
      "min-h-[44px]", // iOS recommended touch target size
    ],
    // Transitions (reduced on mobile for performance)
    isMobileApp ? "transition-transform duration-100" : "transition-colors"
  );
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
  };
  
  const sizeClasses = {
    sm: isMobileApp ? "h-10 px-3 text-sm" : "h-9 px-3 text-sm",
    md: isMobileApp ? "h-11 px-4 py-2" : "h-10 px-4 py-2",
    lg: isMobileApp ? "h-12 px-8" : "h-11 px-8"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </button>
  );
}