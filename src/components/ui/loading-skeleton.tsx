'use client';

import { Skeleton } from './skeleton';
import { Card } from './card';

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'form' | 'dashboard' | 'table';
  count?: number;
  className?: string;
}

/**
 * Reusable loading skeleton components for different content types
 * Provides meaningful loading states instead of blank screens
 */
export function LoadingSkeleton({ 
  type = 'card', 
  count = 3,
  className = '' 
}: LoadingSkeletonProps) {
  switch (type) {
    case 'card':
      return (
        <div className={`space-y-4 ${className}`}>
          {Array.from({ length: count }).map((_, i) => (
            <Card key={i} className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      );

    case 'list':
      return (
        <div className={`space-y-3 ${className}`}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4 border rounded-lg">
              <Skeleton className="h-5 w-5 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          ))}
        </div>
      );

    case 'form':
      return (
        <div className={`space-y-4 ${className}`}>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="flex gap-2 mt-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      );

    case 'dashboard':
      return (
        <div className={`space-y-6 ${className}`}>
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </Card>
            ))}
          </div>

          {/* Main content */}
          <Card className="p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 border rounded">
                  <Skeleton className="h-5 w-5 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      );

    case 'table':
      return (
        <div className={`space-y-3 ${className}`}>
          {/* Header */}
          <div className="flex gap-4 p-4 border-b">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          {/* Rows */}
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border-b">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}

/**
 * Inline loading spinner for buttons and small areas
 */
export function InlineLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
    </div>
  );
}

/**
 * Full page loading state
 */
export function PageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
