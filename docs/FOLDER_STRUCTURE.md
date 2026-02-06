# Chronicle Folder Structure

Clean, organized folder structure for the Chronicle application.

## Overview

```
chronicle/
├── 📁 docs/                    # Documentation
├── 📁 public/                  # Static assets
├── 📁 src/                     # Source code
├── 📁 database/                # Database schemas
├── 📁 scripts/                 # Build scripts
├── 📁 assets/                  # Design assets
├── 📁 icons/                   # App icons
├── 📁 android/                 # Android build (gitignored)
├── 📁 ios/                     # iOS build (gitignored)
└── 📄 Configuration files
```

## Documentation (`docs/`)

```
docs/
├── 📄 README.md
├── 📄 getting-started.md
├── 📄 development.md
├── 📄 contributing.md
├── 📄 project-structure.md
├── 📄 CLEANUP_SUMMARY.md
├── 📄 FOLDER_STRUCTURE.md (this file)
│
├── 📁 design/
│   └── 📄 design-system.md     # Design tokens, patterns, accessibility
│
├── 📁 features/
│   └── 📄 fast-capture.md      # Fast capture system docs
│
└── 📁 development/
    ├── 📄 PROJECT.md           # Original project specification
    └── 📄 AI_PROMPT.md         # AI development context
```

## Public Assets (`public/`)

```
public/
├── 📄 apple-icon.png           # Apple touch icon
├── 📄 favicon.ico              # Browser favicon
├── 📄 icon0.svg                # App icon variant
├── 📄 icon1.png                # App icon variant
├── 📄 logo.png                 # App logo
├── 📄 manifest.webmanifest     # PWA manifest
├── 📄 web-app-manifest-*.png   # PWA icons
├── 📄 *.svg                    # Various icons
│
└── 📁 downloads/
    └── 📄 chronicle-android.apk # Android APK download
```

## Source Code (`src/`)

### App Router (`src/app/`)

```
src/app/
├── 📄 page.tsx                 # Landing page
├── 📄 layout.tsx               # Root layout
├── 📄 globals.css              # Global styles
│
├── 📁 auth/
│   └── 📁 callback/
│       └── 📄 page.tsx         # OAuth callback handler
│
├── 📁 dashboard/
│   └── 📄 page.tsx             # Main dashboard
│
├── 📁 achievements/
│   └── 📄 page.tsx             # Achievements page
│
├── 📁 goals/
│   └── 📄 page.tsx             # Goals page
│
├── 📁 tasks/
│   └── 📄 page.tsx             # Tasks page
│
├── 📁 routines/
│   └── 📄 page.tsx             # Routines page
│
├── 📁 reminders/
│   └── 📄 page.tsx             # Reminders page
│
├── 📁 resources/
│   └── 📄 page.tsx             # Resources page
│
├── 📁 settings/
│   └── 📄 page.tsx             # Settings page
│
├── 📁 login/
│   └── 📄 page.tsx             # Login page
│
└── 📁 debug/
    └── 📄 page.tsx             # Debug utilities
```

### Components (`src/components/`)

```
src/components/
├── 📁 ui/                      # Reusable UI components (40+ components)
│   ├── 📄 button.tsx
│   ├── 📄 card.tsx
│   ├── 📄 dialog.tsx
│   ├── 📄 input.tsx
│   ├── 📄 mobile-*.tsx         # Mobile-optimized components
│   ├── 📄 floating-action-*.tsx # FAB components
│   └── 📄 ...
│
├── 📁 auth/                    # Authentication
│   ├── 📄 auth-form.tsx
│   ├── 📄 auth-guard.tsx
│   ├── 📄 auth-provider.tsx
│   ├── 📄 user-profile.tsx
│   └── 📄 user-profile-mobile.tsx
│
├── 📁 landing/                 # Landing page
│   ├── 📄 landing-navbar.tsx
│   └── 📄 download-buttons.tsx
│
├── 📁 layout/                  # Navigation & layout
│   ├── 📄 optimized-navigation.tsx
│   └── 📄 quick-access.tsx
│
├── 📁 onboarding/              # User onboarding
│   ├── 📄 onboarding-flow.tsx
│   ├── 📄 contextual-help.tsx
│   └── 📄 feature-tooltip.tsx
│
├── 📁 providers/               # Context providers
│   └── 📄 offline-provider.tsx
│
├── 📁 dashboard/               # Dashboard components
│   ├── 📄 dashboard-stats.tsx
│   ├── 📄 focus-dashboard.tsx
│   ├── 📄 smart-suggestions.tsx
│   └── 📄 todays-focus.tsx
│
├── 📁 achievements/            # Achievement components
│   ├── 📄 achievement-card.tsx
│   ├── 📄 achievement-filter.tsx
│   ├── 📄 achievement-form.tsx
│   └── 📄 achievement-list.tsx
│
├── 📁 goals/                   # Goal components
│   ├── 📄 goal-card.tsx
│   ├── 📄 goal-form.tsx
│   └── 📄 goal-list.tsx
│
├── 📁 tasks/                   # Task components
│   ├── 📄 task-item.tsx
│   ├── 📄 task-form.tsx
│   ├── 📄 task-list.tsx
│   └── 📄 optimistic-task-item.tsx
│
├── 📁 routines/                # Routine components
│   └── 📄 batch-routine-actions.tsx
│
├── 📁 reminders/               # Reminder components
│   ├── 📄 reminder-list.tsx
│   ├── 📄 reminder-preferences.tsx
│   ├── 📄 notification-manager.tsx
│   └── 📄 smart-suggestions-list.tsx
│
├── 📁 resources/               # Resource components
│   ├── 📄 resource-card.tsx
│   ├── 📄 resource-form.tsx
│   └── 📄 resource-list.tsx
│
├── 📁 debug/                   # Debug components
│   └── 📄 supabase-status.tsx
│
├── 📄 fast-capture-system.tsx  # Fast capture modal
├── 📄 data-management.tsx      # Data export/import
├── 📄 data-migration.tsx       # Data migration
├── 📄 status-indicator.tsx     # Status indicator
├── 📄 theme-provider.tsx       # Theme context
└── 📄 theme-toggle.tsx         # Dark mode toggle
```

### Hooks (`src/hooks/`)

```
src/hooks/
├── 📄 use-achievements.ts      # Achievement management
├── 📄 use-goals.ts             # Goal management
├── 📄 use-tasks.ts             # Task management
├── 📄 use-routines.ts          # Routine management
├── 📄 use-resources.ts         # Resource management
├── 📄 use-reminders.ts         # Reminder management
│
├── 📄 use-hybrid-achievements.ts # Hybrid storage
├── 📄 use-hybrid-goals.ts
├── 📄 use-hybrid-tasks.ts
├── 📄 use-hybrid-routines.ts
├── 📄 use-hybrid-resources.ts
│
├── 📄 use-supabase-achievements.ts # Supabase integration
├── 📄 use-supabase-goals.ts
├── 📄 use-supabase-tasks.ts
├── 📄 use-supabase-routines.ts
├── 📄 use-supabase-resources.ts
│
├── 📄 use-optimistic-tasks.ts  # Optimistic updates
├── 📄 use-optimistic-goals.ts
├── 📄 use-optimistic-update.ts
│
├── 📄 use-auth.ts              # Authentication
├── 📄 use-user-profile.ts      # User profile
│
├── 📄 use-dashboard-data.ts    # Dashboard data
├── 📄 use-dashboard-data.test.ts
│
├── 📄 use-offline-sync.ts      # Offline sync
├── 📄 use-data-migration.ts    # Data migration
│
├── 📄 use-smart-suggestions.ts # AI suggestions
├── 📄 use-smart-form.ts        # Smart forms
│
├── 📄 use-push-notifications.ts # Push notifications
├── 📄 use-reminder-preferences.ts
│
├── 📄 use-onboarding.ts        # Onboarding flow
│
├── 📄 use-action-chaining.ts   # Action chaining
├── 📄 use-contextual-actions.ts # Contextual actions
│
├── 📄 use-navigation-patterns.ts # Navigation
├── 📄 use-navigation-patterns.test.ts
│
├── 📄 use-mobile-gestures.ts   # Mobile gestures
├── 📄 use-device-detection.ts  # Device detection
├── 📄 use-viewport.ts          # Viewport utilities
│
├── 📄 use-animations.ts        # Animation utilities
└── 📄 use-toast.ts             # Toast notifications
```

### Library (`src/lib/`)

```
src/lib/
├── 📄 utils.ts                 # General utilities
├── 📄 storage.ts               # localStorage wrapper
├── 📄 offline-storage.ts       # Offline data storage
│
├── 📄 supabase.ts              # Supabase client
├── 📄 supabase-utils.ts        # Supabase helpers
│
├── 📄 animations.ts            # Animation utilities
├── 📄 design-tokens.ts         # Design system tokens
│
├── 📄 form-utils.ts            # Form helpers
├── 📄 notification-service.ts  # Notification service
```

### Tests (`src/test/`)

```
src/test/
├── 📄 setup.ts                 # Test configuration
├── 📄 accessibility.test.ts    # A11y tests
├── 📄 cross-device.test.ts     # Cross-device tests
├── 📄 integration.test.ts      # Integration tests
└── 📄 performance.test.ts      # Performance tests
```

### Types (`src/types/`)

```
src/types/
├── 📄 index.ts                 # Core type definitions
└── 📄 database.ts              # Database types
```

## Database (`database/`)

```
database/
├── 📄 README.md
├── 📄 supabase-schema.sql      # Original schema
└── 📄 supabase-schema-fixed.sql # Updated schema
```

## Scripts (`scripts/`)

```
scripts/
├── 📄 build-mobile.sh          # Mobile app builder
└── 📄 deploy.sh                # Deployment script
```

## Design Assets

```
assets/
└── 📄 icon-only.svg            # Icon source file

icons/
├── 📄 icon-48.webp
├── 📄 icon-72.webp
├── 📄 icon-96.webp
├── 📄 icon-128.webp
├── 📄 icon-192.webp
├── 📄 icon-256.webp
└── 📄 icon-512.webp
```

## Configuration Files

```
Root Directory:
├── 📄 package.json             # Dependencies & scripts
├── 📄 package-lock.json        # Dependency lock
├── 📄 tsconfig.json            # TypeScript config
├── 📄 tsconfig.tsbuildinfo     # TS build cache
├── 📄 next.config.ts           # Next.js config
├── 📄 next-env.d.ts            # Next.js types
├── 📄 capacitor.config.ts      # Capacitor config
├── 📄 components.json          # shadcn/ui config
├── 📄 postcss.config.mjs       # PostCSS config
├── 📄 eslint.config.mjs        # ESLint config
├── 📄 vitest.config.ts         # Vitest config
├── 📄 .gitignore               # Git ignore rules
├── 📄 .env.example             # Environment template
├── 📄 .env.local               # Local environment (gitignored)
├── 📄 README.md                # Project overview
├── 📄 LICENSE                  # MIT License
├── 📄 CHANGELOG.md             # Version history
└── 📄 SECURITY.md              # Security policy
```

## Key Principles

### 1. Feature-Based Organization
Each feature has its own folder with related components, hooks, and pages.

### 2. Clear Separation
- **Pages** (`src/app/`) - Routing and page layouts
- **Components** (`src/components/`) - UI components
- **Hooks** (`src/hooks/`) - Business logic
- **Lib** (`src/lib/`) - Utilities
- **Types** (`src/types/`) - Type definitions

### 3. No Clutter
- No empty folders
- No duplicate files
- Assets in `public/`
- Docs in `docs/`
- Build artifacts gitignored

### 4. Scalable Structure
Easy to:
- Find files
- Add features
- Maintain code
- Onboard developers

## Statistics

- **Total Pages**: 11 routes
- **UI Components**: 40+ reusable components
- **Feature Components**: 30+ feature-specific components
- **Custom Hooks**: 40+ hooks
- **Utilities**: 10+ utility modules
- **Tests**: 5 test suites
- **Documentation**: 10+ docs

---

**Last Updated**: February 6, 2026
**Status**: ✅ Clean & Organized
