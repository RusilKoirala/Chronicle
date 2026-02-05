'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Cloud, HardDrive } from 'lucide-react';

export function StatusIndicator() {
  const { user } = useAuth();
  
  const isUsingCloud = isSupabaseConfigured && supabase && user;
  
  return (
    <Badge variant={isUsingCloud ? "default" : "secondary"} className="text-xs">
      {isUsingCloud ? (
        <>
          <Cloud className="h-3 w-3 mr-1" />
          Cloud
        </>
      ) : (
        <>
          <HardDrive className="h-3 w-3 mr-1" />
          Local
        </>
      )}
    </Badge>
  );
}