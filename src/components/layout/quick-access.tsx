'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavigationPatterns } from '@/hooks/use-navigation-patterns';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Trophy, 
  BookOpen, 
  Target, 
  CheckSquare, 
  Repeat,
  Bell,
  Settings,
  Bug,
  Clock,
  TrendingUp,
  Sparkles
} from 'lucide-react';

const pageIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  '/dashboard': Home,
  '/tasks': CheckSquare,
  '/goals': Target,
  '/achievements': Trophy,
  '/resources': BookOpen,
  '/routines': Repeat,
  '/reminders': Bell,
  '/settings': Settings,
  '/debug': Bug,
};

const pageLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/tasks': 'Tasks',
  '/goals': 'Goals',
  '/achievements': 'Achievements',
  '/resources': 'Resources',
  '/routines': 'Routines',
  '/reminders': 'Reminders',
  '/settings': 'Settings',
  '/debug': 'Debug',
};

interface QuickAccessProps {
  className?: string;
  variant?: 'frequent' | 'recent' | 'suggested';
  limit?: number;
}

/**
 * Quick access component that shows frequently accessed or suggested pages
 * based on user navigation patterns
 */
export function QuickAccess({ className, variant = 'suggested', limit = 3 }: QuickAccessProps) {
  const pathname = usePathname();
  const { frequentPages, recentPages, getSuggestedPages } = useNavigationPatterns();

  let pages: string[] = [];
  let title = '';
  let icon = Sparkles;

  switch (variant) {
    case 'frequent':
      pages = frequentPages.slice(0, limit);
      title = 'Frequently Visited';
      icon = TrendingUp;
      break;
    case 'recent':
      pages = recentPages.slice(0, limit);
      title = 'Recently Visited';
      icon = Clock;
      break;
    case 'suggested':
      pages = getSuggestedPages(limit);
      title = 'Quick Access';
      icon = Sparkles;
      break;
  }

  // Filter out current page
  pages = pages.filter(page => page !== pathname);

  if (pages.length === 0) {
    return null;
  }

  const TitleIcon = icon;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 px-1">
        <TitleIcon className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
      </div>
      
      <div className="grid gap-2">
        {pages.map((page) => {
          const Icon = pageIcons[page] || Home;
          const label = pageLabels[page] || page;

          return (
            <Link
              key={page}
              href={page}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                'text-sm font-medium transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                'border border-border/50 hover:border-border',
                'group'
              )}
            >
              <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="flex-1">{label}</span>
              <svg
                className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Compact quick access for mobile bottom sheet or sidebar
 */
export function QuickAccessCompact({ className, limit = 4 }: { className?: string; limit?: number }) {
  const pathname = usePathname();
  const { getSuggestedPages } = useNavigationPatterns();

  const pages = getSuggestedPages(limit).filter(page => page !== pathname);

  if (pages.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex gap-2 overflow-x-auto pb-2', className)}>
      {pages.map((page) => {
        const Icon = pageIcons[page] || Home;
        const label = pageLabels[page] || page;

        return (
          <Link
            key={page}
            href={page}
            className={cn(
              'flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-lg',
              'text-xs font-medium transition-colors flex-shrink-0',
              'hover:bg-accent hover:text-accent-foreground',
              'border border-border/50 hover:border-border',
              'min-w-[80px]'
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-center">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
