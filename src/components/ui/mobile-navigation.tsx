'use client';

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { TouchTarget } from "./touch-target";
import { useDeviceDetection } from "@/hooks/use-device-detection";

// Bottom navigation variants
const bottomNavVariants = cva(
  "fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-t border-border/50",
  {
    variants: {
      variant: {
        default: "shadow-system-elevated",
        minimal: "shadow-system-medium",
        glass: "bg-background/70 backdrop-blur-xl border-border/30",
      },
      padding: {
        none: "",
        safe: "pb-safe-area",
        comfortable: "pb-2 pb-safe-area",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "comfortable",
    },
  }
);

// Navigation item variants
const navItemVariants = cva(
  "flex flex-col items-center justify-center gap-1 transition-all duration-200 ease-out touch-manipulation relative overflow-hidden",
  {
    variants: {
      size: {
        compact: "min-h-[56px] px-2 py-1",
        comfortable: "min-h-[60px] px-3 py-2",
        spacious: "min-h-[68px] px-4 py-3",
      },
      state: {
        default: "text-muted-foreground hover:text-foreground",
        active: "text-primary",
        disabled: "text-muted-foreground/50 pointer-events-none",
      },
      feedback: {
        none: "",
        subtle: "active:scale-95 active:opacity-80",
        medium: "active:scale-90 hover:bg-accent/30 rounded-lg",
        strong: "active:scale-90 hover:bg-accent/50 rounded-xl shadow-sm",
      },
    },
    defaultVariants: {
      size: "comfortable",
      state: "default",
      feedback: "medium",
    },
  }
);

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  disabled?: boolean;
}

interface MobileBottomNavigationProps
  extends React.ComponentProps<"nav">,
    VariantProps<typeof bottomNavVariants> {
  items: NavigationItem[];
  maxItems?: number;
  showLabels?: boolean;
  hapticFeedback?: boolean;
}

const MobileBottomNavigation = React.forwardRef<HTMLElement, MobileBottomNavigationProps>(
  ({ 
    className, 
    variant, 
    padding, 
    items, 
    maxItems = 5, 
    showLabels = true,
    hapticFeedback = false,
    ...props 
  }, ref) => {
    const pathname = usePathname();
    const { isMobileApp } = useDeviceDetection();

    // Limit items to maxItems
    const displayItems = items.slice(0, maxItems);

    return (
      <nav
        ref={ref}
        className={cn(bottomNavVariants({ variant, padding }), className)}
        role="navigation"
        aria-label="Main navigation"
        {...props}
      >
        <div className={cn(
          "grid gap-1 px-2",
          `grid-cols-${displayItems.length}`,
          displayItems.length <= 3 && "max-w-sm mx-auto",
          displayItems.length === 4 && "max-w-md mx-auto",
        )}>
          {displayItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isDisabled = item.disabled;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  navItemVariants({
                    state: isDisabled ? "disabled" : isActive ? "active" : "default",
                    feedback: isDisabled ? "none" : "medium",
                  })
                )}
                aria-current={isActive ? "page" : undefined}
                aria-disabled={isDisabled}
                onClick={(e) => {
                  if (isDisabled) {
                    e.preventDefault();
                    return;
                  }
                  
                  // Add haptic feedback
                  if (hapticFeedback && 'vibrate' in navigator) {
                    navigator.vibrate(10);
                  }
                }}
              >
                <div className="relative">
                  <Icon className="h-6 w-6 flex-shrink-0" />
                  
                  {/* Badge */}
                  {item.badge && (
                    <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                      {typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </div>
                
                {showLabels && (
                  <span className="text-xs font-medium leading-none text-center max-w-full truncate">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }
);

MobileBottomNavigation.displayName = "MobileBottomNavigation";

// Top navigation bar for mobile
const topNavVariants = cva(
  "sticky top-0 z-50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b border-border/50",
  {
    variants: {
      variant: {
        default: "shadow-system-subtle",
        elevated: "shadow-system-medium",
        glass: "bg-background/70 backdrop-blur-xl border-border/30",
      },
      height: {
        compact: "h-14",
        comfortable: "h-16",
        spacious: "h-20",
      },
    },
    defaultVariants: {
      variant: "default",
      height: "comfortable",
    },
  }
);

interface MobileTopNavigationProps
  extends React.ComponentProps<"header">,
    VariantProps<typeof topNavVariants> {
  title?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  centerContent?: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
}

const MobileTopNavigation = React.forwardRef<HTMLElement, MobileTopNavigationProps>(
  ({ 
    className, 
    variant, 
    height, 
    title, 
    leftAction, 
    rightAction, 
    centerContent,
    showBackButton = false,
    onBack,
    ...props 
  }, ref) => {
    const { isMobileApp } = useDeviceDetection();

    return (
      <header
        ref={ref}
        className={cn(
          topNavVariants({ variant, height }),
          isMobileApp && "pt-safe-area",
          className
        )}
        {...props}
      >
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Left section */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {showBackButton && (
                <TouchTarget
                  size="comfortable"
                  feedback="subtle"
                  onClick={onBack}
                  className="mr-2"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </TouchTarget>
              )}
              
              {leftAction || (title && (
                <h1 className="text-lg font-semibold truncate">
                  {title}
                </h1>
              ))}
            </div>

            {/* Center section */}
            {centerContent && (
              <div className="flex items-center justify-center min-w-0 flex-1">
                {centerContent}
              </div>
            )}

            {/* Right section */}
            <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
              {rightAction}
            </div>
          </div>
        </div>
      </header>
    );
  }
);

MobileTopNavigation.displayName = "MobileTopNavigation";

// Navigation wrapper that handles content spacing
interface MobileNavigationWrapperProps {
  children: React.ReactNode;
  hasBottomNav?: boolean;
  hasTopNav?: boolean;
  className?: string;
}

const MobileNavigationWrapper = React.forwardRef<HTMLDivElement, MobileNavigationWrapperProps>(
  ({ children, hasBottomNav = true, hasTopNav = true, className }, ref) => {
    const { isMobileApp } = useDeviceDetection();

    return (
      <div
        ref={ref}
        className={cn(
          "min-h-screen bg-background",
          hasTopNav && "pt-16",
          hasBottomNav && "pb-20",
          isMobileApp && [
            hasTopNav && "pt-safe-area",
            hasBottomNav && "pb-safe-area",
          ],
          className
        )}
      >
        {children}
      </div>
    );
  }
);

MobileNavigationWrapper.displayName = "MobileNavigationWrapper";

export {
  MobileBottomNavigation,
  MobileTopNavigation,
  MobileNavigationWrapper,
  bottomNavVariants,
  topNavVariants,
  navItemVariants,
};

export type {
  NavigationItem,
  MobileBottomNavigationProps,
  MobileTopNavigationProps,
  MobileNavigationWrapperProps,
};