'use client';

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useDeviceDetection } from "@/hooks/use-device-detection";

// Mobile-first responsive container
const containerVariants = cva(
  "w-full mx-auto",
  {
    variants: {
      size: {
        sm: "max-w-sm", // 384px
        md: "max-w-md", // 448px
        lg: "max-w-2xl", // 672px
        xl: "max-w-4xl", // 896px
        "2xl": "max-w-6xl", // 1152px
        full: "max-w-full",
      },
      padding: {
        none: "",
        xs: "px-2", // 8px
        sm: "px-4", // 16px
        md: "px-4 md:px-6", // 16px -> 24px
        lg: "px-4 md:px-8", // 16px -> 32px
        xl: "px-6 md:px-12", // 24px -> 48px
      },
      safeArea: {
        true: "safe-area-inset pt-safe-area pb-safe-area",
        false: "",
      },
    },
    defaultVariants: {
      size: "2xl",
      padding: "md",
      safeArea: false,
    },
  }
);

interface ResponsiveContainerProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof containerVariants> {
  children: React.ReactNode;
}

const ResponsiveContainer = React.forwardRef<HTMLDivElement, ResponsiveContainerProps>(
  ({ className, size, padding, safeArea, children, ...props }, ref) => {
    const { isMobileApp } = useDeviceDetection();

    return (
      <div
        ref={ref}
        className={cn(
          containerVariants({ 
            size, 
            padding, 
            safeArea: isMobileApp ? true : safeArea 
          }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveContainer.displayName = "ResponsiveContainer";

// Mobile-first grid system
const gridVariants = cva(
  "grid w-full",
  {
    variants: {
      cols: {
        1: "grid-cols-1",
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
        12: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-12",
      },
      gap: {
        none: "gap-0",
        xs: "gap-1", // 4px
        sm: "gap-2", // 8px
        md: "gap-3 md:gap-4", // 12px -> 16px
        lg: "gap-4 md:gap-6", // 16px -> 24px
        xl: "gap-6 md:gap-8", // 24px -> 32px
      },
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
      },
      justify: {
        start: "justify-items-start",
        center: "justify-items-center",
        end: "justify-items-end",
        stretch: "justify-items-stretch",
      },
    },
    defaultVariants: {
      cols: 1,
      gap: "md",
      align: "stretch",
      justify: "stretch",
    },
  }
);

interface ResponsiveGridProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof gridVariants> {
  children: React.ReactNode;
  customCols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

const ResponsiveGrid = React.forwardRef<HTMLDivElement, ResponsiveGridProps>(
  ({ className, cols, gap, align, justify, customCols, children, ...props }, ref) => {
    let gridClasses = gridVariants({ cols, gap, align, justify });

    // Override with custom column configuration if provided
    if (customCols) {
      const { mobile = 1, tablet = 2, desktop = 3 } = customCols;
      gridClasses = cn(
        "grid w-full",
        `grid-cols-${mobile}`,
        `sm:grid-cols-${tablet}`,
        `lg:grid-cols-${desktop}`,
        gridVariants({ gap, align, justify, cols: undefined })
      );
    }

    return (
      <div
        ref={ref}
        className={cn(gridClasses, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveGrid.displayName = "ResponsiveGrid";

// Flexible stack layout
const stackVariants = cva(
  "flex",
  {
    variants: {
      direction: {
        row: "flex-row",
        col: "flex-col",
        "row-reverse": "flex-row-reverse",
        "col-reverse": "flex-col-reverse",
        responsive: "flex-col sm:flex-row", // Mobile-first: column -> row
      },
      gap: {
        none: "gap-0",
        xs: "gap-1", // 4px
        sm: "gap-2", // 8px
        md: "gap-3 md:gap-4", // 12px -> 16px
        lg: "gap-4 md:gap-6", // 16px -> 24px
        xl: "gap-6 md:gap-8", // 24px -> 32px
      },
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
        baseline: "items-baseline",
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
      },
      wrap: {
        true: "flex-wrap",
        false: "flex-nowrap",
      },
    },
    defaultVariants: {
      direction: "col",
      gap: "md",
      align: "stretch",
      justify: "start",
      wrap: false,
    },
  }
);

interface ResponsiveStackProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof stackVariants> {
  children: React.ReactNode;
}

const ResponsiveStack = React.forwardRef<HTMLDivElement, ResponsiveStackProps>(
  ({ className, direction, gap, align, justify, wrap, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(stackVariants({ direction, gap, align, justify, wrap }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveStack.displayName = "ResponsiveStack";

// Mobile-optimized page layout
interface MobilePageLayoutProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebar?: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const MobilePageLayout = React.forwardRef<HTMLDivElement, MobilePageLayoutProps>(
  ({ 
    children, 
    header, 
    footer, 
    sidebar, 
    padding = "md", 
    maxWidth = "2xl",
    className,
    ...props 
  }, ref) => {
    const { isMobileApp } = useDeviceDetection();

    return (
      <div
        ref={ref}
        className={cn(
          "min-h-screen bg-background flex flex-col",
          isMobileApp && "mobile-app-container",
          className
        )}
        {...props}
      >
        {header && (
          <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <ResponsiveContainer size={maxWidth} padding={padding}>
              {header}
            </ResponsiveContainer>
          </header>
        )}

        <main className="flex-1 flex">
          {sidebar && (
            <aside className="hidden lg:block w-64 border-r bg-muted/30">
              <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4">
                {sidebar}
              </div>
            </aside>
          )}

          <div className="flex-1 overflow-x-hidden">
            <ResponsiveContainer size={maxWidth} padding={padding}>
              <div className={cn(
                "py-6",
                isMobileApp && "py-4"
              )}>
                {children}
              </div>
            </ResponsiveContainer>
          </div>
        </main>

        {footer && (
          <footer className="border-t bg-muted/30">
            <ResponsiveContainer size={maxWidth} padding={padding}>
              <div className="py-4">
                {footer}
              </div>
            </ResponsiveContainer>
          </footer>
        )}
      </div>
    );
  }
);

MobilePageLayout.displayName = "MobilePageLayout";

// Responsive breakpoint utilities
const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
} as const;

function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<keyof typeof breakpoints>('mobile');

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= breakpoints.wide) {
        setBreakpoint('wide');
      } else if (width >= breakpoints.desktop) {
        setBreakpoint('desktop');
      } else if (width >= breakpoints.tablet) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('mobile');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop' || breakpoint === 'wide',
    isWide: breakpoint === 'wide',
  };
}

export {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveStack,
  MobilePageLayout,
  useBreakpoint,
  containerVariants,
  gridVariants,
  stackVariants,
};

export type {
  ResponsiveContainerProps,
  ResponsiveGridProps,
  ResponsiveStackProps,
  MobilePageLayoutProps,
};