# Chronicle Design System

## Overview

The Chronicle Design System provides a unified foundation for building consistent, accessible, and mobile-first user interfaces. It's built on top of Tailwind CSS v4 with custom design tokens and components optimized for both web and mobile experiences.

## Core Principles

### 1. Mobile-First
- All components are designed for mobile devices first
- Touch targets meet minimum 44px requirements
- Responsive breakpoints scale up from mobile
- Font sizes prevent zoom on iOS (16px minimum)

### 2. Consistency
- Single source of truth for colors, spacing, typography
- Reusable components with consistent APIs
- Semantic naming conventions
- Unified animation and interaction patterns

### 3. Accessibility
- WCAG 2.1 AA compliance
- Proper focus management
- Screen reader support
- High contrast mode support
- Reduced motion preferences

### 4. Performance
- Optimized for 60fps animations
- Minimal bundle size impact
- Efficient CSS custom properties
- Touch-optimized interactions

## Design Tokens

### Spacing System (4px base unit)
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
```

### Typography Scale
```css
--font-size-xs: 0.75rem;   /* 12px */
--font-size-sm: 0.875rem;  /* 14px */
--font-size-base: 1rem;    /* 16px */
--font-size-lg: 1.125rem;  /* 18px */
--font-size-xl: 1.25rem;   /* 20px */
```

### Touch Targets
```css
--touch-target-min: 44px;         /* iOS/Android minimum */
--touch-target-comfortable: 48px; /* Comfortable size */
--touch-target-large: 56px;       /* Large size */
```

### Animation System
```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--ease-out: cubic-bezier(0, 0, 0.2, 1);
```

### Shadow System
```css
--shadow-subtle: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-medium: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-elevated: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-floating: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

## Component Usage

### Button
```tsx
import { Button } from '@/components/ui';

// Standard button
<Button variant="default" size="md">Click me</Button>

// Mobile-optimized button
<Button mobile variant="primary" size="lg">Mobile Button</Button>

// Status buttons
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="destructive">Delete</Button>
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

<Card variant="elevated" padding="lg" interactive mobile>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

### Layout
```tsx
import { Layout, PageHeader, Grid } from '@/components/ui';

<Layout variant="mobile-first" padding="md">
  <PageHeader 
    title="Page Title" 
    description="Page description"
    priority="high"
  />
  <Grid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
    {/* Grid items */}
  </Grid>
</Layout>
```

### Input
```tsx
import { Input } from '@/components/ui';

// Standard input
<Input type="text" placeholder="Enter text" />

// Mobile-optimized input
<Input mobile type="email" placeholder="Email address" />
```

## Utility Classes

### Touch Targets
```css
.touch-target              /* 44px minimum */
.touch-target-comfortable  /* 48px comfortable */
.touch-target-large       /* 56px large */
```

### Spacing
```css
.space-system-1  /* gap: 4px */
.space-system-2  /* gap: 8px */
.space-system-4  /* gap: 16px */
.space-system-6  /* gap: 24px */
```

### Shadows
```css
.shadow-system-subtle
.shadow-system-medium
.shadow-system-elevated
.shadow-system-floating
```

### Animations
```css
.transition-system-fast    /* 150ms ease-out */
.transition-system-normal  /* 200ms ease-out */
.transition-system-slow    /* 300ms ease-out */
```

### Status Colors
```css
.text-success, .bg-success
.text-warning, .bg-warning
.text-info, .bg-info
```

### Priority Indicators
```css
.priority-high    /* Red border-left */
.priority-medium  /* Yellow border-left */
.priority-low     /* Green border-left */
```

## Mobile-Specific Features

### Safe Area Support
```css
.pt-safe-area  /* padding-top: env(safe-area-inset-top) */
.pb-safe-area  /* padding-bottom: env(safe-area-inset-bottom) */
.safe-area-inset  /* left/right safe area padding */
```

### Mobile Container
```css
.mobile-container  /* Responsive padding: 16px → 24px → 32px */
```

### Touch Interactions
- All interactive elements have minimum 44px touch targets
- Active states provide visual feedback on touch
- Smooth animations optimized for mobile performance
- Gesture-friendly spacing and positioning

## Responsive Breakpoints

```css
/* Mobile-first approach */
@media (min-width: 768px)  /* Tablet */
@media (min-width: 1024px) /* Desktop */
@media (min-width: 1280px) /* Wide */
```

## Dark Mode Support

All components automatically support dark mode through CSS custom properties. The system uses `oklch` color space for consistent appearance across devices.

## Best Practices

### Do's
- Use design tokens instead of hardcoded values
- Test on actual mobile devices
- Ensure 44px minimum touch targets
- Use semantic color names
- Follow mobile-first responsive design
- Implement proper focus management

### Don'ts
- Don't use fixed pixel values for spacing
- Don't ignore safe area insets on mobile
- Don't create touch targets smaller than 44px
- Don't use animations longer than 300ms
- Don't override design tokens directly
- Don't forget to test with reduced motion preferences

## Performance Considerations

- CSS custom properties enable efficient theming
- Minimal JavaScript for component logic
- Optimized for 60fps animations
- Efficient re-renders through proper React patterns
- Bundle size optimized through tree-shaking