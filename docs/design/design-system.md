# Chronicle Design System

This document outlines the design system and UI patterns used in Chronicle.

## Design Tokens

See `src/lib/design-tokens.ts` for the complete design token implementation.

## Component Library

Chronicle uses a custom component library built on top of Radix UI and Tailwind CSS.

### Core Components
- Located in `src/components/ui/`
- Built with accessibility in mind
- Responsive and mobile-optimized

## Mobile-First Approach

All components are designed mobile-first with progressive enhancement for larger screens.

### Touch Targets
- Minimum 44x44px touch targets
- Adequate spacing between interactive elements
- Touch feedback on all interactive elements

## Animation Guidelines

See `src/lib/animations.ts` for animation utilities and patterns.

### Principles
- Subtle and purposeful
- Performance-optimized
- Respects user preferences (prefers-reduced-motion)

## Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader optimization
- High contrast mode support
