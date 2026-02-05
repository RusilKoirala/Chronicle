'use client';

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { TouchFeedback } from "./touch-feedback";
import { useDeviceDetection } from "@/hooks/use-device-detection";

const fabVariants = cva(
  "fixed z-40 rounded-full shadow-system-floating transition-all duration-300 ease-out touch-manipulation",
  {
    variants: {
      size: {
        sm: "h-12 w-12",
        md: "h-14 w-14", 
        lg: "h-16 w-16",
        xl: "h-20 w-20",
      },
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90",
        success: "bg-success text-white hover:bg-success/90 shadow-success/20",
        warning: "bg-warning text-white hover:bg-warning/90 shadow-warning/20",
        glass: "bg-background/80 backdrop-blur-md border border-border/50 text-foreground hover:bg-background/90",
      },
      position: {
        "bottom-right": "bottom-6 right-6",
        "bottom-left": "bottom-6 left-6",
        "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
        "top-right": "top-6 right-6",
        "top-left": "top-6 left-6",
        "center-right": "top-1/2 -translate-y-1/2 right-6",
        "center-left": "top-1/2 -translate-y-1/2 left-6",
      },
      state: {
        default: "scale-100 opacity-100",
        expanded: "scale-110",
        hidden: "scale-0 opacity-0 pointer-events-none",
      },
    },
    defaultVariants: {
      size: "lg",
      variant: "primary",
      position: "bottom-right",
      state: "default",
    },
  }
);

interface FloatingActionButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof fabVariants> {
  icon?: React.ReactNode;
  label?: string;
  badge?: number | string;
  hapticFeedback?: boolean;
}

const FloatingActionButton = React.forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({ 
    className, 
    size, 
    variant, 
    position, 
    state,
    icon, 
    label,
    badge,
    hapticFeedback = true,
    onClick,
    children,
    ...props 
  }, ref) => {
    const { isMobileApp } = useDeviceDetection();

    const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      // Add haptic feedback for mobile
      if (hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(15);
      }
      
      onClick?.(e);
    }, [hapticFeedback, onClick]);

    return (
      <button
        ref={ref}
        className={cn(
          fabVariants({ size, variant, position, state }),
          // Adjust position for mobile safe areas
          isMobileApp && position?.includes('bottom') && "bottom-20",
          className
        )}
        onClick={handleClick}
        aria-label={label}
        {...props}
      >
        <div className="relative flex items-center justify-center">
          {icon || children}
          
          {/* Badge */}
          {badge && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {typeof badge === 'number' && badge > 99 ? '99+' : badge}
            </span>
          )}
        </div>
        
        {/* Ripple effect overlay */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-white/20 rounded-full scale-0 transition-transform duration-300 group-active:scale-100" />
        </div>
      </button>
    );
  }
);

FloatingActionButton.displayName = "FloatingActionButton";

// Enhanced floating action menu with better mobile UX
interface FloatingActionMenuProps {
  trigger?: React.ReactNode;
  actions: Array<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    variant?: "primary" | "secondary" | "accent" | "success" | "warning";
  }>;
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  direction?: "up" | "left" | "right";
  spacing?: "tight" | "normal" | "loose";
  backdrop?: boolean;
  hapticFeedback?: boolean;
  className?: string;
}

const FloatingActionMenu = React.forwardRef<HTMLDivElement, FloatingActionMenuProps>(
  ({ 
    trigger,
    actions,
    position = "bottom-right",
    direction = "up",
    spacing = "normal",
    backdrop = true,
    hapticFeedback = true,
    className,
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const { isMobileApp } = useDeviceDetection();

    const spacingMap = {
      tight: "gap-2",
      normal: "gap-3",
      loose: "gap-4",
    };

    const directionMap = {
      up: "flex-col-reverse",
      left: "flex-row-reverse",
      right: "flex-row",
    };

    const handleToggle = React.useCallback(() => {
      if (hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }
      setIsOpen(!isOpen);
    }, [isOpen, hapticFeedback]);

    const handleActionClick = React.useCallback((action: typeof actions[0]) => {
      if (action.disabled) return;
      
      if (hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(15);
      }
      
      action.onClick();
      setIsOpen(false);
    }, [hapticFeedback]);

    const handleBackdropClick = React.useCallback(() => {
      setIsOpen(false);
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          "fixed z-40",
          position === "bottom-right" && "bottom-6 right-6",
          position === "bottom-left" && "bottom-6 left-6", 
          position === "bottom-center" && "bottom-6 left-1/2 -translate-x-1/2",
          // Adjust for mobile safe areas
          isMobileApp && position.includes('bottom') && "bottom-20",
          className
        )}
      >
        {/* Backdrop */}
        {backdrop && isOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 transition-opacity duration-300"
            onClick={handleBackdropClick}
          />
        )}

        {/* Action items */}
        {isOpen && (
          <div className={cn(
            "flex absolute bottom-20 right-0",
            directionMap[direction],
            spacingMap[spacing],
            "animate-in fade-in-0 slide-in-from-bottom-4 duration-300"
          )}>
            {actions.map((action, index) => (
              <div
                key={index}
                className="flex items-center gap-3 animate-in slide-in-from-right-2 fade-in-0"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Label */}
                <div className="bg-background/95 backdrop-blur-sm text-foreground px-3 py-2 rounded-full text-sm font-medium shadow-system-medium border border-border/50 whitespace-nowrap">
                  {action.label}
                </div>
                
                {/* Action button */}
                <TouchFeedback
                  hapticFeedback={hapticFeedback}
                  pressAnimation={true}
                  rippleEffect={true}
                  onClick={() => handleActionClick(action)}
                >
                  <div className={cn(
                    "h-12 w-12 rounded-full shadow-system-elevated flex items-center justify-center transition-all duration-200",
                    action.variant === "success" && "bg-success text-white",
                    action.variant === "warning" && "bg-warning text-white",
                    action.variant === "secondary" && "bg-secondary text-secondary-foreground",
                    action.variant === "accent" && "bg-accent text-accent-foreground",
                    (!action.variant || action.variant === "primary") && "bg-primary text-primary-foreground",
                    action.disabled && "opacity-50 pointer-events-none",
                    "hover:scale-105 active:scale-95"
                  )}>
                    {action.icon}
                  </div>
                </TouchFeedback>
              </div>
            ))}
          </div>
        )}

        {/* Main trigger button */}
        <FloatingActionButton
          size="lg"
          variant="primary"
          onClick={handleToggle}
          hapticFeedback={hapticFeedback}
          className={cn(
            "transition-transform duration-300",
            isOpen && "rotate-45 scale-110"
          )}
        >
          {trigger || (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          )}
        </FloatingActionButton>
      </div>
    );
  }
);

FloatingActionMenu.displayName = "FloatingActionMenu";

// Legacy components for backward compatibility
interface FABActionProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  className?: string;
}

export function FABAction({ onClick, icon, label, className }: FABActionProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="bg-background text-foreground px-3 py-1 rounded-lg text-sm font-medium shadow-md">
        {label}
      </span>
      <button
        className={cn("h-12 w-12 rounded-full shadow-md bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors touch-target", className)}
        onClick={onClick}
      >
        {icon}
      </button>
    </div>
  );
}

// Predefined action sets for common use cases
export const quickActionPresets = {
  chronicle: [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      ),
      label: "Add Task",
      onClick: () => window.location.href = "/tasks",
      variant: "primary" as const,
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      label: "Log Achievement",
      onClick: () => window.location.href = "/achievements",
      variant: "success" as const,
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10,9 9,9 8,9" />
        </svg>
      ),
      label: "Save Resource",
      onClick: () => window.location.href = "/resources",
      variant: "accent" as const,
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        </svg>
      ),
      label: "Set Goal",
      onClick: () => window.location.href = "/goals",
      variant: "warning" as const,
    },
  ],
};

export {
  FloatingActionButton,
  FloatingActionMenu,
  fabVariants,
};

export type {
  FloatingActionButtonProps,
  FloatingActionMenuProps,
};