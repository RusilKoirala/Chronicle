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
import { 
  Menu, 
  Home, 
  Trophy, 
  BookOpen, 
  Target, 
  CheckSquare, 
  Repeat,
  Settings,
  Plus
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/resources', label: 'Resources', icon: BookOpen },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/routines', label: 'Routines', icon: Repeat },
];

const quickActions = [
  { href: '/achievements', label: 'Add Achievement', icon: Trophy },
  { href: '/resources', label: 'Save Resource', icon: BookOpen },
  { href: '/goals', label: 'Set Goal', icon: Target },
  { href: '/tasks', label: 'Add Task', icon: CheckSquare },
  { href: '/routines', label: 'Create Routine', icon: Repeat },
];

export function NavigationIconOnly() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const closeSheet = () => setIsOpen(false);

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusIndicator />
              <Link href="/" className="text-xl font-bold">
                Chronicle
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
                        <SheetTitle className="text-lg">Chronicle</SheetTitle>
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

      {/* Bottom Navigation for Mobile - Icon Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        <div className="grid grid-cols-6 px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-center p-3 rounded-lg transition-colors touch-target",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
                title={item.label} // Tooltip for accessibility
              >
                <Icon className="h-6 w-6" />
              </Link>
            );
          })}
        </div>
        {/* Safe area padding for devices with home indicator */}
        <div className="h-safe-area-inset-bottom bg-background/95" />
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        {/* Backdrop */}
        {showQuickActions && (
          <div 
            className="fixed inset-0 bg-black/50 -z-10 backdrop-blur-sm"
            onClick={() => setShowQuickActions(false)}
          />
        )}
        
        {/* Quick Actions Menu */}
        {showQuickActions && (
          <div className="absolute bottom-20 right-0 space-y-3 animate-in slide-in-from-bottom-4 fade-in-0 duration-300">
            {quickActions.map((action, index) => (
              <div 
                key={action.href} 
                className="flex items-center gap-3 animate-in slide-in-from-right-2 fade-in-0"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="bg-background/95 backdrop-blur-sm text-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-border/50 whitespace-nowrap">
                  {action.label}
                </div>
                <Link href={action.href} onClick={() => setShowQuickActions(false)}>
                  <Button
                    size="sm"
                    className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    variant="secondary"
                  >
                    <action.icon className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
        
        {/* Main FAB */}
        <Button
          size="lg"
          className={cn(
            "h-16 w-16 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300",
            "bg-primary hover:bg-primary/90 text-primary-foreground",
            "border-4 border-background",
            showQuickActions && "rotate-45 scale-110"
          )}
          onClick={() => setShowQuickActions(!showQuickActions)}
        >
          <Plus className="h-7 w-7 transition-transform duration-300" />
        </Button>
      </div>
    </>
  );
}