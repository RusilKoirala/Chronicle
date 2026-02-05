'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus, X } from 'lucide-react';

interface FloatingActionButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function FloatingActionButton({ children, className }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Don't render on login, auth, or landing pages
  if (pathname === '/login' || 
      pathname.startsWith('/auth/') || 
      pathname === '/callback' ||
      pathname === '/') {
    return null;
  }

  return (
    <div className={cn("fixed bottom-20 right-4 z-40 md:hidden", className)}>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Action Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-2 animate-in slide-in-from-bottom-2 duration-200">
          {children}
        </div>
      )}
      
      {/* Main FAB */}
      <Button
        size="lg"
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Plus className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
}

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
      <Button
        size="sm"
        className={cn("h-12 w-12 rounded-full shadow-md", className)}
        onClick={onClick}
        variant="secondary"
      >
        {icon}
      </Button>
    </div>
  );
}