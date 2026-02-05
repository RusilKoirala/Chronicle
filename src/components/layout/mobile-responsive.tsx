'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface MobileResponsiveProps {
  children: ReactNode;
  className?: string;
}

export function MobileResponsiveContainer({ children, className }: MobileResponsiveProps) {
  return (
    <div className={cn(
      "container mx-auto mobile-container max-w-6xl",
      className
    )}>
      {children}
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, icon, action, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
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
        <p className="text-muted-foreground text-sm md:text-base">
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

interface ResponsiveGridProps {
  children: ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: number;
  className?: string;
}

export function ResponsiveGrid({ 
  children, 
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 4,
  className 
}: ResponsiveGridProps) {
  const gridClasses = cn(
    "grid",
    `gap-${gap}`,
    `grid-cols-${columns.mobile || 1}`,
    `sm:grid-cols-${columns.tablet || 2}`,
    `lg:grid-cols-${columns.desktop || 3}`,
    className
  );

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
}

interface MobileCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function MobileCard({ children, className, hover = true }: MobileCardProps) {
  return (
    <div className={cn(
      "bg-card text-card-foreground rounded-lg border shadow-sm",
      "card-mobile",
      hover && "hover:shadow-md hover-lift transition-all duration-200",
      className
    )}>
      {children}
    </div>
  );
}

interface TouchButtonProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function TouchButton({ 
  children, 
  className, 
  variant = 'default',
  size = 'md',
  fullWidth = false,
  onClick,
  disabled = false,
  type = 'button'
}: TouchButtonProps) {
  const baseClasses = "touch-target inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
  };
  
  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8"
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

interface MobileListProps {
  children: ReactNode;
  className?: string;
}

export function MobileList({ children, className }: MobileListProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
    </div>
  );
}

interface MobileListItemProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  active?: boolean;
}

export function MobileListItem({ children, className, onClick, active = false }: MobileListItemProps) {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-lg border bg-card text-card-foreground",
        "touch-target transition-colors",
        onClick && "hover:bg-accent hover:text-accent-foreground cursor-pointer",
        active && "bg-accent text-accent-foreground",
        className
      )}
    >
      {children}
    </Component>
  );
}