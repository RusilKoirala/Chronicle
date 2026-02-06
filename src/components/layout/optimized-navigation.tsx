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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Menu, 
  Home, 
  Trophy, 
  BookOpen, 
  Target, 
  CheckSquare, 
  Repeat,
  Bell,
  Settings,
  MoreHorizontal,
  Bug
} from 'lucide-react';
import { QuickAccess } from './quick-access';

// Primary navigation items - limited to 4 for mobile bottom nav
const primaryNavItems = [
  { href: '/dashboard', label: 'Dashboard', shortLabel: 'Home', icon: Home },
  { href: '/tasks', label: 'Tasks', shortLabel: 'Tasks', icon: CheckSquare },
  { href: '/goals', label: 'Goals', shortLabel: 'Goals', icon: Target },
];

// Secondary navigation items - accessible via "More" menu
const secondaryNavItems = [
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/resources', label: 'Resources', icon: BookOpen },
  { href: '/routines', label: 'Routines', icon: Repeat },
  { href: '/reminders', label: 'Reminders', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/debug', label: 'Debug', icon: Bug },
];

export function OptimizedNavigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Don't render navigation on login or auth pages
  if (pathname === '/login' || 
      pathname.startsWith('/auth/') || 
      pathname === '/callback' ||
      pathname === '/') {
    return null;
  }

  const closeSheet = () => setIsOpen(false);

  // Check if current page is in secondary nav
  const isSecondaryPageActive = secondaryNavItems.some(item => pathname === item.href);

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
              {primaryNavItems.map((item) => (
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
              
              {/* Desktop More Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={cn(
                      "text-sm font-medium flex items-center gap-2 px-3 py-2",
                      isSecondaryPageActive && "text-foreground bg-accent"
                    )}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    More
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>More Features</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {secondaryNavItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2 cursor-pointer",
                          pathname === item.href && "bg-accent"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center gap-2">
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
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                      {/* Quick Access Section */}
                      <QuickAccess variant="suggested" limit={3} />
                      
                      <div className="text-xs font-semibold text-muted-foreground px-3 py-2">
                        PRIMARY
                      </div>
                      {primaryNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeSheet}
                            className={cn(
                              "mobile-nav-item flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md",
                              pathname === item.href
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                            )}
                          >
                            <Icon className="h-5 w-5" />
                            {item.label}
                          </Link>
                        );
                      })}
                      
                      <div className="pt-4">
                        <div className="text-xs font-semibold text-muted-foreground px-3 py-2">
                          MORE FEATURES
                        </div>
                        {secondaryNavItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={closeSheet}
                              className={cn(
                                "mobile-nav-item flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md",
                                pathname === item.href
                                  ? "bg-accent text-accent-foreground"
                                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                              )}
                            >
                              <Icon className="h-5 w-5" />
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation for Mobile - Limited to 4 items */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t bottom-nav">
        <div className="grid grid-cols-4 px-2 py-1">
          {primaryNavItems.map((item) => {
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
                  {item.shortLabel}
                </span>
              </Link>
            );
          })}
          
          {/* More button as 4th item */}
          <Sheet open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
            <SheetTrigger asChild>
              <button
                className={cn(
                  "bottom-nav-item",
                  isSecondaryPageActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <MoreHorizontal className="h-6 w-6 flex-shrink-0" />
                <span className="bottom-nav-label">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[60vh] rounded-t-2xl">
              <SheetHeader>
                <SheetTitle>More Features</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-1">
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMoreMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors",
                        pathname === item.href
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
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
