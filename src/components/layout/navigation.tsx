'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { UserProfile } from '@/components/auth/user-profile';
import { UserProfileMobile } from '@/components/auth/user-profile-mobile';
import { StatusIndicator } from '@/components/status-indicator';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { FloatingActionMenu, quickActionPresets } from '@/components/ui/floating-action-menu';
import { Logo } from '@/components/ui/logo';
import { 
  Menu, 
  Home, 
  Trophy, 
  BookOpen, 
  Target, 
  CheckSquare, 
  Repeat,
  Bell,
  Settings
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/resources', label: 'Resources', icon: BookOpen },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/routines', label: 'Routines', icon: Repeat },
  { href: '/reminders', label: 'Reminders', icon: Bell },
];

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Double-check: Don't render navigation on login or auth pages
  if (pathname === '/login' || 
      pathname.startsWith('/auth/') || 
      pathname === '/callback' ||
      pathname === '/') {
    return null;
  }

  const closeSheet = () => setIsOpen(false);

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusIndicator />
              <Link href="/dashboard">
                <Logo size="sm" variant="full" />
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 px-3 py-2 rounded-md",
                    pathname === item.href
                      ? "text-foreground bg-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center gap-2">
                <Link href="/settings">
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
                <UserProfile />
              </div>
              
              {/* Mobile Menu Button */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <div className="flex flex-col h-full">
                    {/* Header with User Profile */}
                    <div className="p-6 border-b">
                      <SheetHeader className="text-left">
                        <SheetTitle className="flex items-center gap-2">
                          <Logo size="sm" variant="full" />
                        </SheetTitle>
                      </SheetHeader>
                      <UserProfileMobile />
                    </div>
                    
                    {/* Navigation Items */}
                    <div className="flex-1 p-4 space-y-1">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeSheet}
                            className={cn(
                              "mobile-nav-item flex items-center gap-3 px-3 py-3 text-sm font-medium",
                              pathname === item.href
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <Icon className="h-5 w-5" />
                            {item.label}
                          </Link>
                        );
                      })}
                      
                      <div className="pt-2 mt-2 border-t border-border/50">
                        <Link
                          href="/settings"
                          onClick={closeSheet}
                          className="mobile-nav-item flex items-center gap-3 px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
                        >
                          <Settings className="h-5 w-5" />
                          Settings
                        </Link>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t bottom-nav">
        <div className="grid grid-cols-7 px-2 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "bottom-nav-item",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <Icon className="h-6 w-6 flex-shrink-0" />
                <span className="bottom-nav-label">
                  {item.label === 'Achievements' ? 'Awards' : 
                   item.label === 'Resources' ? 'Notes' :
                   item.label === 'Dashboard' ? 'Home' :
                   item.label === 'Reminders' ? 'Alerts' :
                   item.label}
                </span>
              </Link>
            );
          })}
        </div>
        {/* Safe area padding for devices with home indicator */}
        <div className="h-safe-area-inset-bottom bg-background/95" />
      </div>

      {/* Floating Action Menu */}
      <FloatingActionMenu 
        actions={quickActionPresets.chronicle}
        position="bottom-right"
      />
    </>
  );
}