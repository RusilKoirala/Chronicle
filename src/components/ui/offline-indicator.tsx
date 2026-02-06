'use client';

import { useOfflineSync } from '@/hooks/use-offline-sync';
import { Alert, AlertDescription } from './alert';
import { Button } from './button';
import { WifiOff, Wifi, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfflineIndicatorProps {
  className?: string;
  position?: 'top' | 'bottom';
  showWhenOnline?: boolean;
}

/**
 * Displays offline status and sync information
 * Shows when offline or when there are queued operations
 */
export function OfflineIndicator({ 
  className = '',
  position = 'top',
  showWhenOnline = false,
}: OfflineIndicatorProps) {
  const {
    isOnline,
    isSyncing,
    queuedCount,
    syncError,
    syncQueue,
    hasQueuedOperations,
  } = useOfflineSync();

  // Don't show if online and no queued operations (unless showWhenOnline is true)
  if (isOnline && !hasQueuedOperations && !showWhenOnline) {
    return null;
  }

  const positionClasses = position === 'top' 
    ? 'top-0 rounded-t-none' 
    : 'bottom-0 rounded-b-none';

  return (
    <div className={cn(
      'fixed left-0 right-0 z-50 px-4 py-2',
      positionClasses,
      className
    )}>
      <Alert 
        variant={!isOnline ? 'destructive' : syncError ? 'destructive' : 'default'}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2 flex-1">
          {!isOnline ? (
            <WifiOff className="h-4 w-4" />
          ) : isSyncing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : syncError ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <Wifi className="h-4 w-4" />
          )}
          
          <AlertDescription className="mb-0">
            {!isOnline ? (
              <>
                You're offline. Changes will sync when connection is restored.
                {queuedCount > 0 && ` (${queuedCount} pending)`}
              </>
            ) : isSyncing ? (
              `Syncing ${queuedCount} change${queuedCount !== 1 ? 's' : ''}...`
            ) : syncError ? (
              syncError
            ) : hasQueuedOperations ? (
              `${queuedCount} change${queuedCount !== 1 ? 's' : ''} pending sync`
            ) : (
              'All changes synced'
            )}
          </AlertDescription>
        </div>

        {isOnline && hasQueuedOperations && !isSyncing && (
          <Button
            size="sm"
            variant="outline"
            onClick={syncQueue}
            className="ml-2"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Sync Now
          </Button>
        )}
      </Alert>
    </div>
  );
}

/**
 * Compact offline badge for navigation bars
 */
export function OfflineBadge({ className = '' }: { className?: string }) {
  const { isOnline, queuedCount } = useOfflineSync();

  if (isOnline && queuedCount === 0) {
    return null;
  }

  return (
    <div className={cn(
      'flex items-center gap-1 px-2 py-1 rounded-full text-xs',
      !isOnline ? 'bg-destructive text-destructive-foreground' : 'bg-muted text-muted-foreground',
      className
    )}>
      {!isOnline ? (
        <>
          <WifiOff className="h-3 w-3" />
          <span>Offline</span>
        </>
      ) : (
        <>
          <RefreshCw className="h-3 w-3" />
          <span>{queuedCount} pending</span>
        </>
      )}
    </div>
  );
}
