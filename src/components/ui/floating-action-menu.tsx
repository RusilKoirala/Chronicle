'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus, X } from 'lucide-react';

interface FABAction {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

interface FloatingActionMenuProps {
  actions: FABAction[];
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const colorVariants = {
  primary: 'bg-background hover:bg-accent text-foreground border border-border',
  secondary: 'bg-background hover:bg-accent text-foreground border border-border',
  success: 'bg-background hover:bg-accent text-foreground border border-border',
  warning: 'bg-background hover:bg-accent text-foreground border border-border',
  danger: 'bg-background hover:bg-accent text-foreground border border-border',
};

const positionVariants = {
  'bottom-right': 'bottom-24 right-4',
  'bottom-left': 'bottom-24 left-4',
  'top-right': 'top-24 right-4',
  'top-left': 'top-24 left-4',
};

export function FloatingActionMenu({ 
  actions, 
  className, 
  position = 'bottom-right' 
}: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Don't render on login, auth, or landing pages
  if (pathname === '/login' || 
      pathname.startsWith('/auth/') || 
      pathname === '/callback' ||
      pathname === '/') {
    return null;
  }

  const handleActionClick = () => {
    setIsOpen(false);
  };

  return (
    <div 
      data-floating-action-menu
      className={cn(
        "lg:hidden fixed z-40",
        positionVariants[position],
        className
      )}
    >
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm fab-backdrop -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Actions Menu */}
      {isOpen && (
        <div className={cn(
          "absolute space-y-3",
          position.includes('bottom') ? 'bottom-20' : 'top-20',
          position.includes('right') ? 'right-0' : 'left-0'
        )}>
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div 
                key={action.href}
                className={cn(
                  "flex items-center gap-3 fab-action-item",
                  position.includes('right') ? 'flex-row' : 'flex-row-reverse'
                )}
                style={{ 
                  animationDelay: `${index * 80}ms`,
                  animationFillMode: 'both'
                }}
              >
                <div className={cn(
                  "fab-label px-4 py-2 rounded-full text-sm font-medium shadow-lg whitespace-nowrap",
                  "bg-background/95 text-foreground border border-border/50"
                )}>
                  {action.label}
                </div>
                <Link href={action.href} onClick={handleActionClick}>
                  <Button
                    size="sm"
                    className={cn(
                      "h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105",
                      colorVariants[action.color || 'secondary']
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Main FAB */}
      <Button
        size="lg"
        className={cn(
          "fab-main h-16 w-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300",
          "bg-background hover:bg-accent text-foreground border-2 border-border",
          isOpen && "rotate-45 scale-110"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6 transition-transform duration-300" />
        ) : (
          <Plus className="h-6 w-6 transition-transform duration-300" />
        )}
      </Button>
    </div>
  );
}

// Preset action configurations
export const quickActionPresets = {
  chronicle: [
    { href: '/achievements', label: 'Add Achievement', icon: ({ className }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { href: '/resources', label: 'Save Resource', icon: ({ className }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
    { href: '/goals', label: 'Set Goal', icon: ({ className }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
    { href: '/tasks', label: 'Add Task', icon: ({ className }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
    { href: '/routines', label: 'Create Routine', icon: ({ className }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> },
  ]
};