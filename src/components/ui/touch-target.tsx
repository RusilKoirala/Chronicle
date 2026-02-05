'use client';

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const touchTargetVariants = cva(
  "relative inline-flex items-center justify-center transition-all duration-200 ease-out select-none touch-manipulation",
  {
    variants: {
      size: {
        minimum: "min-h-[44px] min-w-[44px]", // iOS/Android minimum
        comfortable: "min-h-[48px] min-w-[48px]", // Comfortable touch
        large: "min-h-[56px] min-w-[56px]", // Large touch target
      },
      feedback: {
        none: "",
        subtle: "active:scale-[0.98] active:opacity-80",
        medium: "active:scale-[0.96] active:opacity-70 hover:scale-[1.02]",
        strong: "active:scale-[0.94] active:opacity-60 hover:scale-[1.04] hover:shadow-md",
      },
      spacing: {
        none: "",
        minimal: "p-1", // 4px
        comfortable: "p-2", // 8px
        spacious: "p-3", // 12px
      },
      shape: {
        square: "rounded-md",
        rounded: "rounded-lg",
        circular: "rounded-full",
      },
    },
    defaultVariants: {
      size: "comfortable",
      feedback: "subtle",
      spacing: "comfortable",
      shape: "rounded",
    },
  }
);

interface TouchTargetProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof touchTargetVariants> {
  asChild?: boolean;
  disabled?: boolean;
  hapticFeedback?: boolean;
}

const TouchTarget = React.forwardRef<HTMLDivElement, TouchTargetProps>(
  ({ 
    className, 
    size, 
    feedback, 
    spacing, 
    shape, 
    disabled = false,
    hapticFeedback = false,
    children,
    onClick,
    ...props 
  }, ref) => {
    const handleClick = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      
      // Add haptic feedback for mobile devices
      if (hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(10); // Light haptic feedback
      }
      
      onClick?.(e);
    }, [disabled, hapticFeedback, onClick]);

    return (
      <div
        ref={ref}
        className={cn(
          touchTargetVariants({ size, feedback, spacing, shape }),
          disabled && "opacity-50 pointer-events-none",
          className
        )}
        onClick={handleClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick && !disabled ? 0 : undefined}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TouchTarget.displayName = "TouchTarget";

export { TouchTarget, touchTargetVariants };
export type { TouchTargetProps };