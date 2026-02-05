'use client';

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { TouchTarget } from "./touch-target";

const mobileAlertVariants = cva(
  "relative w-full rounded-xl border text-sm transition-all duration-200 ease-out",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border/50",
        destructive: "bg-red-50 text-red-900 border-red-200 dark:bg-red-950/50 dark:text-red-100 dark:border-red-800/50",
        warning: "bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-100 dark:border-yellow-800/50",
        success: "bg-green-50 text-green-900 border-green-200 dark:bg-green-950/50 dark:text-green-100 dark:border-green-800/50",
        info: "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/50 dark:text-blue-100 dark:border-blue-800/50",
      },
      size: {
        sm: "p-3 gap-2",
        md: "p-4 gap-3",
        lg: "p-5 gap-4",
      },
      layout: {
        default: "flex items-start gap-3",
        stacked: "space-y-2",
        inline: "flex items-center gap-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      layout: "default",
    },
  }
);

const mobileAlertIconVariants = cva(
  "flex-shrink-0 transition-colors",
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        destructive: "text-red-600 dark:text-red-400",
        warning: "text-yellow-600 dark:text-yellow-400",
        success: "text-green-600 dark:text-green-400",
        info: "text-blue-600 dark:text-blue-400",
      },
      size: {
        sm: "h-4 w-4 mt-0.5",
        md: "h-5 w-5 mt-0.5",
        lg: "h-6 w-6 mt-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface MobileAlertProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof mobileAlertVariants> {
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

const MobileAlert = React.forwardRef<HTMLDivElement, MobileAlertProps>(
  ({ 
    className, 
    variant, 
    size, 
    layout,
    icon, 
    dismissible = false,
    onDismiss,
    title,
    description,
    actions,
    children,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(mobileAlertVariants({ variant, size, layout }), className)}
        {...props}
      >
        {/* Icon */}
        {icon && (
          <div className={cn(mobileAlertIconVariants({ variant, size }))}>
            {icon}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <div className="font-medium leading-tight mb-1">
              {title}
            </div>
          )}
          
          {description && (
            <div className="text-sm opacity-90 leading-relaxed">
              {description}
            </div>
          )}
          
          {children && (
            <div className="mt-2">
              {children}
            </div>
          )}
          
          {actions && (
            <div className="mt-3 flex flex-wrap gap-2">
              {actions}
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <TouchTarget
            size="comfortable"
            feedback="subtle"
            onClick={onDismiss}
            className="ml-2 -mr-1 -mt-1"
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </TouchTarget>
        )}
      </div>
    );
  }
);

MobileAlert.displayName = "MobileAlert";

// Toast-style alert that appears at the top of the screen
interface MobileToastProps extends MobileAlertProps {
  visible?: boolean;
  duration?: number;
  position?: "top" | "bottom";
}

const MobileToast = React.forwardRef<HTMLDivElement, MobileToastProps>(
  ({ 
    className,
    visible = true,
    duration = 5000,
    position = "top",
    onDismiss,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(visible);

    React.useEffect(() => {
      setIsVisible(visible);
    }, [visible]);

    React.useEffect(() => {
      if (isVisible && duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          onDismiss?.();
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [isVisible, duration, onDismiss]);

    const handleDismiss = () => {
      setIsVisible(false);
      onDismiss?.();
    };

    if (!isVisible) return null;

    return (
      <div
        className={cn(
          "fixed left-4 right-4 z-50 transition-all duration-300 ease-out",
          position === "top" ? "top-4 safe-area-top" : "bottom-4 safe-area-bottom",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        )}
      >
        <MobileAlert
          ref={ref}
          className={cn("shadow-system-elevated", className)}
          dismissible
          onDismiss={handleDismiss}
          {...props}
        />
      </div>
    );
  }
);

MobileToast.displayName = "MobileToast";

// Banner-style alert for important messages
interface MobileBannerProps extends MobileAlertProps {
  sticky?: boolean;
}

const MobileBanner = React.forwardRef<HTMLDivElement, MobileBannerProps>(
  ({ 
    className,
    sticky = false,
    ...props 
  }, ref) => {
    return (
      <div
        className={cn(
          "w-full",
          sticky && "sticky top-0 z-40"
        )}
      >
        <MobileAlert
          ref={ref}
          className={cn(
            "rounded-none border-x-0 border-t-0",
            sticky && "shadow-system-subtle",
            className
          )}
          layout="inline"
          {...props}
        />
      </div>
    );
  }
);

MobileBanner.displayName = "MobileBanner";

// Inline alert for form validation and contextual messages
const MobileInlineAlert = React.forwardRef<HTMLDivElement, MobileAlertProps>(
  ({ className, size = "sm", ...props }, ref) => {
    return (
      <MobileAlert
        ref={ref}
        className={cn("border-0 bg-transparent p-0", className)}
        size={size}
        layout="inline"
        {...props}
      />
    );
  }
);

MobileInlineAlert.displayName = "MobileInlineAlert";

// Hook for managing toast notifications
interface ToastState {
  id: string;
  variant?: MobileAlertProps['variant'];
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  duration?: number;
  actions?: React.ReactNode;
}

export function useMobileToast() {
  const [toasts, setToasts] = React.useState<ToastState[]>([]);

  const addToast = React.useCallback((toast: Omit<ToastState, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = React.useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = React.useCallback((message: string, options?: Partial<ToastState>) => {
    return addToast({
      variant: 'success',
      description: message,
      ...options,
    });
  }, [addToast]);

  const error = React.useCallback((message: string, options?: Partial<ToastState>) => {
    return addToast({
      variant: 'destructive',
      description: message,
      ...options,
    });
  }, [addToast]);

  const warning = React.useCallback((message: string, options?: Partial<ToastState>) => {
    return addToast({
      variant: 'warning',
      description: message,
      ...options,
    });
  }, [addToast]);

  const info = React.useCallback((message: string, options?: Partial<ToastState>) => {
    return addToast({
      variant: 'info',
      description: message,
      ...options,
    });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info,
  };
}

// Toast container component
interface MobileToastContainerProps {
  toasts: ToastState[];
  onRemove: (id: string) => void;
  position?: "top" | "bottom";
}

export function MobileToastContainer({ 
  toasts, 
  onRemove, 
  position = "top" 
}: MobileToastContainerProps) {
  return (
    <div
      className={cn(
        "fixed left-0 right-0 z-50 pointer-events-none",
        position === "top" ? "top-0 safe-area-top" : "bottom-0 safe-area-bottom"
      )}
    >
      <div className="p-4 space-y-2">
        {toasts.map((toast) => (
          <MobileToast
            key={toast.id}
            variant={toast.variant}
            title={toast.title}
            description={toast.description}
            icon={toast.icon}
            duration={toast.duration}
            actions={toast.actions}
            position={position}
            onDismiss={() => onRemove(toast.id)}
            className="pointer-events-auto"
          />
        ))}
      </div>
    </div>
  );
}

export {
  MobileAlert,
  MobileToast,
  MobileBanner,
  MobileInlineAlert,
  mobileAlertVariants,
  mobileAlertIconVariants,
};

export type {
  MobileAlertProps,
  MobileToastProps,
  MobileBannerProps,
  ToastState,
};