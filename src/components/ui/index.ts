/**
 * Chronicle Design System - Component Library
 * 
 * Unified component exports for consistent usage across the app
 */

// Core Components
export { Button, buttonVariants } from './button';
export type { ButtonProps } from './button';

export { Input } from './input';
export type { InputProps } from './input';

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardAction, 
  CardDescription, 
  CardContent 
} from './card';
export type { CardProps } from './card';

// Layout Components
export { Layout, PageHeader, Grid, Stack } from './layout';
export type { LayoutProps, PageHeaderProps, GridProps, StackProps } from './layout';

// Form Components
export { Label } from './label';
export { Textarea } from './textarea';
export { Checkbox } from './checkbox';
export { Switch } from './switch';
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

// Navigation Components
export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

// Feedback Components
export { Alert, AlertDescription, AlertTitle } from './alert';
export { Badge } from './badge';
export { Progress } from './progress';

// Overlay Components
export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
export { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './sheet';
export { Popover, PopoverContent, PopoverTrigger } from './popover';
export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './dropdown-menu';

// Specialized Components
export { Avatar, AvatarFallback, AvatarImage } from './avatar';
export { Calendar } from './calendar';
export { Slider } from './slider';
export { Separator } from './separator';
export { FloatingActionButton, FABAction } from './floating-action-button';
export { FloatingActionMenu } from './floating-action-menu';

// Design System Utilities
export { designSystem } from '../../lib/design-tokens';
export type { DesignTokens } from '../../lib/design-tokens';