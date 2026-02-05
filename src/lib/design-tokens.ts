/**
 * Design Tokens - Unified Design System Foundation
 * 
 * This file defines all design tokens used throughout the Chronicle app
 * to ensure consistency across all components and pages.
 */

// Spacing System (4px base unit)
export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
} as const;

// Typography Scale
export const typography = {
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

// Border Radius System
export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// Shadow System
export const shadows = {
  none: 'none',
  subtle: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  medium: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  elevated: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  floating: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

// Animation Durations
export const animation = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
  easing: {
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// Mobile-First Breakpoints
export const breakpoints = {
  mobile: '0px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
} as const;

// Touch Target Standards
export const touchTargets = {
  minimum: '44px',    // iOS/Android minimum
  comfortable: '48px', // Comfortable touch target
  large: '56px',      // Large touch target
} as const;

// Z-Index Scale
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  modal: 30,
  popover: 40,
  tooltip: 50,
  toast: 60,
} as const;

// Component Variants
export const componentVariants = {
  button: {
    sizes: ['xs', 'sm', 'md', 'lg'] as const,
    variants: ['primary', 'secondary', 'outline', 'ghost', 'danger'] as const,
  },
  card: {
    variants: ['default', 'elevated', 'outlined'] as const,
    padding: ['sm', 'md', 'lg'] as const,
  },
  input: {
    sizes: ['sm', 'md', 'lg'] as const,
    variants: ['default', 'filled', 'outlined'] as const,
  },
} as const;

// Semantic Color Mappings (using CSS custom properties)
export const semanticColors = {
  // Status Colors
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error: 'var(--color-destructive)',
  info: 'var(--color-info)',
  
  // Priority Colors
  priority: {
    high: 'var(--color-destructive)',
    medium: 'var(--color-warning)',
    low: 'var(--color-success)',
  },
  
  // Gamification Colors
  points: 'var(--color-primary)',
  streak: 'var(--color-warning)',
  achievement: 'var(--color-success)',
} as const;

// Mobile-Specific Design Tokens
export const mobile = {
  safeArea: {
    top: 'env(safe-area-inset-top)',
    bottom: 'env(safe-area-inset-bottom)',
    left: 'env(safe-area-inset-left)',
    right: 'env(safe-area-inset-right)',
  },
  navigation: {
    topBarHeight: '56px',
    bottomNavHeight: '60px',
    fabSize: '56px',
  },
  form: {
    inputHeight: '48px',
    buttonHeight: '48px',
    fontSize: '16px', // Prevents zoom on iOS
  },
} as const;

// Design System Utilities
export const designSystem = {
  spacing,
  typography,
  borderRadius,
  shadows,
  animation,
  breakpoints,
  touchTargets,
  zIndex,
  componentVariants,
  semanticColors,
  mobile,
} as const;

export type DesignTokens = typeof designSystem;