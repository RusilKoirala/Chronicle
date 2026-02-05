'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/components/auth/auth-provider';
import { useDataMigration } from '@/hooks/use-data-migration';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Upload, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export function DataMigration() {
  const { user } = useAuth();
  const { migrateData, hasLocalData, clearLocalData, isLoading, status, error } = useDataMigration();
  const [isOpen, setIsOpen] = useState(false);

  // Don't show migration if Supabase is not configured or user is not authenticated or no local data
  if (!isSupabaseConfigured || !user || !hasLocalData) return null;

  const handleMigrate = async () => {
    await migrateData();
  };

  const handleClearLocal = () => {
    clearLocalData();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700">
          <Upload className="h-4 w-4 mr-2" />
          Migrate Local Data
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Migrate to Cloud
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              We found local data that can be migrated to your cloud account. This will sync your data across devices.
            </AlertDescription>
          </Alert>

          {isLoading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Migrating data...</span>
              </div>
              <Progress value={undefined} className="w-full" />
              <p className="text-sm text-muted-foreground">Please wait while we migrate your data</p>
            </div>
          )}

          {status && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Migration Results:</div>
              {Object.entries(status).map(([type, result]) => (
                <div key={type} className="text-sm">
                  <div className="flex justify-between">
                    <span className="capitalize">{type}:</span>
                    <span>{result.migrated}/{result.total}</span>
                  </div>
                  {result.errors.length > 0 && (
                    <div className="text-xs text-red-600 ml-2">
                      {result.errors.slice(0, 2).map((err: string, i: number) => (
                        <div key={i}>• {err}</div>
                      ))}
                      {result.errors.length > 2 && (
                        <div>• ... and {result.errors.length - 2} more errors</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {status && !isLoading && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div>Migration completed! Your data is now synced to the cloud.</div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleClearLocal}
                    className="text-xs"
                  >
                    Clear Local Data
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={handleMigrate} 
              disabled={isLoading || !!status}
              className="flex-1"
            >
              {isLoading ? 'Migrating...' : 'Start Migration'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              {status ? 'Done' : 'Cancel'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}