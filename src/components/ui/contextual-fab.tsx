'use client';

import * as React from "react";
import { usePathname } from "next/navigation";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { FloatingActionButton, FloatingActionMenu } from "./floating-action-button";
import { useDeviceDetection } from "@/hooks/use-device-detection";
import { Plus, FileText, Target, CheckCircle, BookOpen, RotateCcw } from "lucide-react";

// Context-aware action definitions
interface ContextualAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "accent" | "success" | "warning";
  priority?: number; // Lower number = higher priority
}

interface ContextualFABProps {
  className?: string;
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  customActions?: ContextualAction[];
  maxActions?: number;
  hapticFeedback?: boolean;
}

// Context-aware action generator
function useContextualActions(): ContextualAction[] {
  const pathname = usePathname();
  
  return React.useMemo(() => {
    const baseActions: ContextualAction[] = [];
    
    switch (pathname) {
      case '/dashboard':
        return [
          {
            icon: <Plus className="h-5 w-5" />,
            label: "Quick Task",
            onClick: () => {
              // Open quick task modal
              window.dispatchEvent(new CustomEvent('open-quick-capture', { 
                detail: { type: 'task' } 
              }));
            },
            variant: "primary",
            priority: 1,
          },
          {
            icon: <CheckCircle className="h-5 w-5" />,
            label: "Log Achievement",
            onClick: () => {
              window.dispatchEvent(new CustomEvent('open-quick-capture', { 
                detail: { type: 'achievement' } 
              }));
            },
            variant: "success",
            priority: 2,
          },
          {
            icon: <BookOpen className="h-5 w-5" />,
            label: "Save Resource",
            onClick: () => {
              window.dispatchEvent(new CustomEvent('open-quick-capture', { 
                detail: { type: 'resource' } 
              }));
            },
            variant: "accent",
            priority: 3,
          },
        ];
        
      case '/tasks':
        return [
          {
            icon: <Plus className="h-5 w-5" />,
            label: "New Task",
            onClick: () => {
              window.dispatchEvent(new CustomEvent('open-quick-capture', { 
                detail: { type: 'task' } 
              }));
            },
            variant: "primary",
            priority: 1,
          },
          {
            icon: <Target className="h-5 w-5" />,
            label: "Set Goal",
            onClick: () => {
              window.dispatchEvent(new CustomEvent('open-quick-capture', { 
                detail: { type: 'goal' } 
              }));
            },
            variant: "warning",
            priority: 2,
          },
        ];
        
      case '/goals':
        return [
          {
            icon: <Target className="h-5 w-5" />,
            label: "New Goal",
            onClick: () => {
              window.dispatchEvent(new CustomEvent('open-quick-capture', { 
                detail: { type: 'goal' } 
              }));
            },
            variant: "primary",
            priority: 1,
          },
          {
            icon: <Plus className="h-5 w-5" />,
            label: "Add Task",
            onClick: () => {
              window.dispatchEvent(new CustomEvent('open-quick-capture', { 
                detail: { type: 'task' } 
              }));
            },
            variant: "secondary",
            priority: 2,
          },
        ];
        
      case '/resources':
        return [
          {
            icon: <BookOpen className="h-5 w-5" />,
            label: "Save Resource",
            onClick: () => {
              window.dispatchEvent(new CustomEvent('open-quick-capture', { 
                detail: { type: 'resource' } 
              }));
            },
            variant: "primary",
            priority: 1,
          },
          {
            icon: <FileText className="h-5 w-5" />,
            label: "Quick Note",
            onClick: () => {
              window.dispatchEvent(new CustomEvent('open-quick-capture', { 
                detail: { type: 'resource', subtype: 'note' } 
              }));
            },
            variant: "accent",
            priority: 2,
          },
        ];
        
      case '/achievements':
        return [
          {
            icon: <CheckCircle className="h-5 w-5" />,
            label: "Log Achievement",
            onClick: () => {
              window.dispatchEvent(new CustomEvent('open-quick-capture', { 
                detail: { type: 'achievement' } 
              }));
            },
            variant: "primary",
            priority: 1,
          },
          {
            icon: <Plus className="h-5 w-5" />,
            label: "Add Task",
            onClick: () => {
              window.dispatchEvent(new CustomEvent('open-quick-capture', { 
                detail: { type: 'task' } 
              }));
            },
            variant: "secondary",
            priority: 2,
          },
        ];
        
      case '/routines':
        return [
          {
            icon: <RotateCcw className="h-5 w-5" />,
            label: "New Routine",
            onClick: () => {
              window.dispatchEvent(new CustomEvent('open-quick-capture', { 
                detail: { type: 'routine' } 
              }));
            },
            variant: "primary",
            priority: 1,
          },
          {
            icon: <Plus className="h-5 w-5" />,
            label: "Quick Task",
            onClick: () => {
              window.dispatchEvent(new CustomEvent('open-quick-capture', { 
                detail: { type: 'task' } 
              }));
            },
            variant: "secondary",
            priority: 2,
          },
        ];
        
      default:
        // Generic actions for other pages
        return [
          {
            icon: <Plus className="h-5 w-5" />,
            label: "Quick Add",
            onClick: () => {
              window.dispatchEvent(new CustomEvent('open-quick-capture', { 
                detail: { type: 'task' } 
              }));
            },
            variant: "primary",
            priority: 1,
          },
          {
            icon: <BookOpen className="h-5 w-5" />,
            label: "Save Resource",
            onClick: () => {
              window.dispatchEvent(new CustomEvent('open-quick-capture', { 
                detail: { type: 'resource' } 
              }));
            },
            variant: "accent",
            priority: 2,
          },
        ];
    }
  }, [pathname]);
}

const ContextualFAB: React.FC<ContextualFABProps> = ({ 
    className,
    position = "bottom-right",
    customActions,
    maxActions = 4,
    hapticFeedback = true,
  }) => {
    const pathname = usePathname();
    const { isMobileApp } = useDeviceDetection();
    const contextualActions = useContextualActions();
    
    // Don't render on login, auth, or landing pages
    if (pathname === '/login' || 
        pathname.startsWith('/auth/') || 
        pathname === '/callback' ||
        pathname === '/') {
      return null;
    }

    // Use custom actions if provided, otherwise use contextual actions
    const actions = customActions || contextualActions;
    
    // Sort by priority and limit to maxActions
    const sortedActions = actions
      .sort((a, b) => (a.priority || 999) - (b.priority || 999))
      .slice(0, maxActions);

    // If only one action, show as single FAB
    if (sortedActions.length === 1) {
      const action = sortedActions[0];
      return (
        <FloatingActionButton
          position={position}
          variant={action.variant || "primary"}
          onClick={action.onClick}
          label={action.label}
          hapticFeedback={hapticFeedback}
          className={cn(
            "transition-all duration-300 ease-out",
            "hover:scale-105 active:scale-95",
            className
          )}
        >
          {action.icon}
        </FloatingActionButton>
      );
    }

    // Multiple actions - show as menu
    return (
      <FloatingActionMenu
        position={position}
        actions={sortedActions}
        hapticFeedback={hapticFeedback}
        className={className}
        trigger={
          <Plus className="h-6 w-6 transition-transform duration-300" />
        }
      />
    );
  };

ContextualFAB.displayName = "ContextualFAB";

// Hook for managing contextual actions
export function useContextualFAB() {
  const [isVisible, setIsVisible] = React.useState(true);
  const [customActions, setCustomActions] = React.useState<ContextualAction[]>();
  
  const hide = React.useCallback(() => setIsVisible(false), []);
  const show = React.useCallback(() => setIsVisible(true), []);
  const toggle = React.useCallback(() => setIsVisible(prev => !prev), []);
  
  const setActions = React.useCallback((actions: ContextualAction[]) => {
    setCustomActions(actions);
  }, []);
  
  const clearActions = React.useCallback(() => {
    setCustomActions(undefined);
  }, []);
  
  return {
    isVisible,
    customActions,
    hide,
    show,
    toggle,
    setActions,
    clearActions,
  };
}

// Smart FAB that adapts based on scroll behavior
interface SmartFABProps extends ContextualFABProps {
  hideOnScroll?: boolean;
  scrollThreshold?: number;
}

export const SmartFAB: React.FC<SmartFABProps> = ({ 
    hideOnScroll = true, 
    scrollThreshold = 100,
    className,
    ...props 
  }) => {
    const [isVisible, setIsVisible] = React.useState(true);
    const [lastScrollY, setLastScrollY] = React.useState(0);
    
    React.useEffect(() => {
      if (!hideOnScroll) return;
      
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > scrollThreshold) {
          // Hide when scrolling down, show when scrolling up
          setIsVisible(currentScrollY < lastScrollY);
        } else {
          // Always show when near top
          setIsVisible(true);
        }
        
        setLastScrollY(currentScrollY);
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }, [hideOnScroll, scrollThreshold, lastScrollY]);
    
    if (!isVisible) return null;
    
    return (
      <ContextualFAB
        className={cn(
          "transition-all duration-300 ease-out",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none",
          className
        )}
        {...props}
      />
    );
  };

SmartFAB.displayName = "SmartFAB";

export {
  ContextualFAB,
  useContextualActions,
};

export type {
  ContextualAction,
  ContextualFABProps,
  SmartFABProps,
};