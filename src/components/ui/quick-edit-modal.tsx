/**
 * Quick edit modal for lightweight editing without full page navigation
 */

'use client';

import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './dialog';
import { cn } from '@/lib/utils';

export interface QuickEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

export function QuickEditModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'md',
  className,
}: QuickEditModalProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    full: 'max-w-full mx-4',
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          'w-[95vw]',
          sizeClasses[size],
          className
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        
        <div className="mt-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
