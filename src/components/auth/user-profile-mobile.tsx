'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from './auth-provider';
import { useUserProfile } from '@/hooks/use-user-profile';
import { isSupabaseConfigured } from '@/lib/supabase';
import { LogOut, User } from 'lucide-react';

export function UserProfileMobile() {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show user profile if Supabase is not configured or user is not authenticated
  if (!isSupabaseConfigured || !user) {
    return (
      <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
        <User className="h-8 w-8 opacity-50" />
        <span>Not signed in</span>
      </div>
    );
  }

  const displayName = profile?.full_name || user.user_metadata?.full_name || 'User';
  const userInitials = (profile?.full_name || user.email)
    ?.split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage 
            src={profile?.avatar_url || user.user_metadata?.avatar_url} 
            alt={displayName} 
          />
          <AvatarFallback className="text-sm">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium truncate">
          {displayName}
        </span>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleSignOut}
        disabled={isLoading}
        className="text-xs"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}