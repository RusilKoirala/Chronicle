'use client';

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { TouchFeedback } from "./touch-feedback";

const mobileCardVariants = cva(
  "rounded-xl border bg-card text-card-foreground transition-all duration-200 ease-out",
  {
    variants: {
      variant: {
        default: "border-border shadow-system-subtle",
        elevated: "border-border shadow-system-medium hover:shadow-system-elevated",
        outlined: "border-2 border-border shadow-none",
        glass: "border-border/50 bg-card/80 backdrop-blur-sm shadow-system-medium",
      },
      padding: {
        none: "p-0",
        sm: "p-3", // 12px
        md: "p-4", // 16px
        lg: "p-6", // 24px
        xl: "p-8", // 32px
      },
      interactive: {
        true: "cursor-pointer hover:shadow-system-elevated active:scale-[0.98] transition-transform",
        false: "",
      },
      spacing: {
        none: "space-y-0",
        sm: "space-y-2",
        md: "space-y-3",
        lg: "space-y-4",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
      interactive: false,
      spacing: "md",
    },
  }
);

interface MobileCardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof mobileCardVariants> {
  asChild?: boolean;
  hapticFeedback?: boolean;
  pressAnimation?: boolean;
  rippleEffect?: boolean;
}

const MobileCard = React.forwardRef<HTMLDivElement, MobileCardProps>(
  ({ 
    className, 
    variant, 
    padding, 
    interactive, 
    spacing,
    hapticFeedback = false,
    pressAnimation = true,
    rippleEffect = false,
    onClick,
    children,
    ...props 
  }, ref) => {
    if (interactive || onClick) {
      return (
        <TouchFeedback
          ref={ref}
          className={cn(
            mobileCardVariants({ variant, padding, interactive: true, spacing }),
            className
          )}
          onClick={onClick}
          hapticFeedback={hapticFeedback}
          pressAnimation={pressAnimation}
          rippleEffect={rippleEffect}
          {...props}
        >
          {children}
        </TouchFeedback>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          mobileCardVariants({ variant, padding, interactive, spacing }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MobileCard.displayName = "MobileCard";

const MobileCardHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
));
MobileCardHeader.displayName = "MobileCardHeader";

const MobileCardTitle = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight text-lg", className)}
    {...props}
  />
));
MobileCardTitle.displayName = "MobileCardTitle";

const MobileCardDescription = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
MobileCardDescription.displayName = "MobileCardDescription";

const MobileCardContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("text-sm leading-relaxed", className)} 
    {...props} 
  />
));
MobileCardContent.displayName = "MobileCardContent";

const MobileCardFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-3 border-t border-border/50", className)}
    {...props}
  />
));
MobileCardFooter.displayName = "MobileCardFooter";

export {
  MobileCard,
  MobileCardHeader,
  MobileCardFooter,
  MobileCardTitle,
  MobileCardDescription,
  MobileCardContent,
  mobileCardVariants,
};
export type { MobileCardProps };