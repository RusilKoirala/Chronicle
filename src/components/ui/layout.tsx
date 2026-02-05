'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { useDeviceDetection } from "@/hooks/use-device-detection";

interface LayoutProps extends React.ComponentProps<"div"> {
  variant?: "default" | "mobile-first" | "desktop";
  padding?: "none" | "sm" | "md" | "lg";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

function Layout({ 
  className, 
  variant = "mobile-first", 
  padding = "md",
  maxWidth = "lg",
  children,
  ...props 
}: LayoutProps) {
  const { isMobileApp } = useDeviceDetection();

  const paddingClasses = {
    none: "",
    sm: "p-2 md:p-4",
    md: "p-4 md:p-6",
    lg: "p-6 md:p-8"
  };

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full"
  };

  const variantClasses = {
    default: "container mx-auto",
    "mobile-first": "mobile-container mx-auto",
    desktop: "container mx-auto px-8"
  };

  return (
    <div
      data-slot="layout"
      data-variant={variant}
      data-padding={padding}
      data-max-width={maxWidth}
      data-mobile-app={isMobileApp}
      className={cn(
        "min-h-screen bg-background",
        variantClasses[variant],
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        // Mobile app specific styles
        isMobileApp && [
          "safe-area-inset pt-safe-area pb-safe-area",
          "overflow-x-hidden"
        ],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface PageHeaderProps extends React.ComponentProps<"div"> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  priority?: "high" | "medium" | "low";
}

function PageHeader({ 
  title, 
  description, 
  icon, 
  action, 
  priority,
  className,
  ...props 
}: PageHeaderProps) {
  const { isMobileApp } = useDeviceDetection();

  const priorityClasses = {
    high: "priority-high",
    medium: "priority-medium", 
    low: "priority-low"
  };

  return (
    <div
      data-slot="page-header"
      data-priority={priority}
      className={cn(
        "mb-6 space-system-4",
        isMobileApp && "mb-4",
        priority && priorityClasses[priority],
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between mb-2">
        <h1 className={cn(
          "font-bold flex items-center space-system-2",
          isMobileApp ? "text-xl" : "text-2xl md:text-3xl"
        )}>
          {icon}
          <span>{title}</span>
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

interface GridProps extends React.ComponentProps<"div"> {
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: "sm" | "md" | "lg";
}

function Grid({ 
  children, 
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = "md",
  className,
  ...props 
}: GridProps) {
  const { isMobileApp } = useDeviceDetection();

  const gapClasses = {
    sm: "gap-2 md:gap-3",
    md: "gap-4 md:gap-6", 
    lg: "gap-6 md:gap-8"
  };

  return (
    <div
      data-slot="grid"
      data-columns-mobile={columns.mobile}
      data-columns-tablet={columns.tablet}
      data-columns-desktop={columns.desktop}
      data-gap={gap}
      className={cn(
        "grid",
        `grid-cols-${columns.mobile || 1}`,
        `sm:grid-cols-${columns.tablet || 2}`,
        `lg:grid-cols-${columns.desktop || 3}`,
        gapClasses[gap],
        isMobileApp && "gap-3", // Tighter spacing on mobile app
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface StackProps extends React.ComponentProps<"div"> {
  direction?: "vertical" | "horizontal";
  gap?: "sm" | "md" | "lg";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
}

function Stack({ 
  children, 
  direction = "vertical",
  gap = "md",
  align = "stretch",
  justify = "start",
  className,
  ...props 
}: StackProps) {
  const gapClasses = {
    sm: "space-system-2",
    md: "space-system-4",
    lg: "space-system-6"
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center", 
    end: "items-end",
    stretch: "items-stretch"
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end", 
    between: "justify-between",
    around: "justify-around"
  };

  return (
    <div
      data-slot="stack"
      data-direction={direction}
      data-gap={gap}
      data-align={align}
      data-justify={justify}
      className={cn(
        "flex",
        direction === "vertical" ? "flex-col" : "flex-row",
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Layout, PageHeader, Grid, Stack };
export type { LayoutProps, PageHeaderProps, GridProps, StackProps };