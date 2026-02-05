'use client';

import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/components/auth/auth-provider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export function SupabaseStatus() {
  const { user } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error' | 'no-config'>('checking');
  const [error, setError] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<'checking' | 'ready' | 'missing-tables' | 'error'>('checking');

  const checkConnection = async () => {
    setConnectionStatus('checking');
    setDbStatus('checking');
    setError(null);

    if (!isSupabaseConfigured || !supabase) {
      setConnectionStatus('no-config');
      return;
    }

    try {
      // Test basic connection
      const { data, error: connError } = await supabase.from('profiles').select('count').limit(1);
      
      if (connError) {
        if (connError.code === '42P01') {
          setConnectionStatus('connected');
          setDbStatus('missing-tables');
          setError('Database tables not found. Please run the schema from supabase-schema.sql');
        } else {
          setConnectionStatus('error');
          setError(`Connection error: ${connError.message}`);
        }
      } else {
        setConnectionStatus('connected');
        setDbStatus('ready');
      }
    } catch (err: any) {
      setConnectionStatus('error');
      setError(`Failed to connect: ${err.message}`);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return dbStatus === 'ready' ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'no-config':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <RefreshCw className="h-4 w-4 animate-spin" />;
    }
  };

  const getStatusMessage = () => {
    if (connectionStatus === 'checking') return 'Checking Supabase connection...';
    if (connectionStatus === 'no-config') return 'Supabase not configured - using localStorage only';
    if (connectionStatus === 'error') return error || 'Connection failed';
    if (connectionStatus === 'connected') {
      if (dbStatus === 'missing-tables') return 'Connected but database schema missing';
      if (dbStatus === 'ready') return 'Connected and ready';
      return 'Connected, checking database...';
    }
    return 'Unknown status';
  };

  const getVariant = () => {
    if (connectionStatus === 'error') return 'destructive';
    if (connectionStatus === 'no-config' || dbStatus === 'missing-tables') return 'default';
    return 'default';
  };

  return (
    <div className="space-y-4">
      <Alert variant={getVariant()}>
        {getStatusIcon()}
        <AlertDescription>
          <div className="space-y-2">
            <div>{getStatusMessage()}</div>
            
            {connectionStatus === 'connected' && (
              <div className="text-xs space-y-1">
                <div>User: {user ? `${user.email} (authenticated)` : 'Not authenticated'}</div>
                <div>Database: {dbStatus === 'ready' ? 'Schema ready' : 'Schema missing'}</div>
              </div>
            )}
            
            {connectionStatus === 'no-config' && (
              <div className="text-xs">
                Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
              </div>
            )}
            
            {dbStatus === 'missing-tables' && (
              <div className="text-xs">
                Run the SQL schema from supabase-schema.sql in your Supabase dashboard
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>
      
      <Button onClick={checkConnection} size="sm" variant="outline">
        <RefreshCw className="h-4 w-4 mr-2" />
        Recheck Status
      </Button>
    </div>
  );
}