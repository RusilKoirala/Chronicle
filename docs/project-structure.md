# Project Structure

Chronicle follows a professional, scalable project structure designed for maintainability and collaboration.

## Root Directory

```
chronicle/
├── 📁 docs/                    # Documentation
├── 📁 database/                # Database schemas and migrations
├── 📁 scripts/                 # Build and deployment scripts
├── 📁 public/                  # Static assets
├── 📁 src/                     # Source code
├── 📁 android/                 # Android app (Capacitor)
├── 📁 ios/                     # iOS app (Capacitor)
├── 📄 README.md               # Project overview
├── 📄 LICENSE                 # MIT License
├── 📄 CHANGELOG.md            # Version history
├── 📄 SECURITY.md             # Security policy
├── 📄 .gitignore              # Git ignore rules
├── 📄 .env.example            # Environment template
└── 📄 package.json            # Dependencies and scripts
```

## Documentation (`docs/`)

```
docs/
├── 📄 getting-started.md      # User guide
├── 📄 development.md          # Developer setup
├── 📄 contributing.md         # Contribution guidelines
├── 📄 project-structure.md    # This file
└── 📁 development/            # Development artifacts
    ├── 📄 PROJECT.md          # Original project spec
    └── 📄 AI_PROMPT.md        # AI development context
```

## Database (`database/`)

```
database/
├── 📄 README.md               # Database documentation
├── 📄 supabase-schema.sql     # Original schema
└── 📄 supabase-schema-fixed.sql # Updated schema
```

## Scripts (`scripts/`)

```
scripts/
├── 📄 build-mobile.sh         # Mobile app builder
└── 📄 deploy.sh               # Deployment script
```

## Source Code (`src/`)

```
src/
├── 📁 app/                    # Next.js App Router
│   ├── 📄 page.tsx           # Landing page
│   ├── 📄 layout.tsx         # Root layout
│   ├── 📁 dashboard/         # Main app
│   ├── 📁 achievements/      # Achievement pages
│   ├── 📁 resources/         # Resource pages
│   ├── 📁 goals/             # Goal pages
│   ├── 📁 tasks/             # Task pages
│   ├── 📁 routines/          # Routine pages
│   └── 📁 settings/          # Settings pages
│
├── 📁 components/             # React components
│   ├── 📁 ui/                # Reusable UI components
│   ├── 📁 auth/              # Authentication
│   ├── 📁 landing/           # Landing page
│   ├── 📁 layout/            # Navigation & layout
│   ├── 📁 achievements/      # Achievement components
│   ├── 📁 resources/         # Resource components
│   ├── 📁 goals/             # Goal components
│   ├── 📁 tasks/             # Task components
│   └── 📁 routines/          # Routine components
│
├── 📁 hooks/                  # Custom React hooks
│   ├── 📄 use-*.ts           # Feature-specific hooks
│   └── 📄 use-hybrid-*.ts    # Hybrid storage hooks
│
├── 📁 lib/                    # Utilities
│   ├── 📄 storage.ts         # localStorage utilities
│   └── 📄 utils.ts           # General utilities
│
└── 📁 types/                  # TypeScript definitions
    ├── 📄 index.ts           # Core types
    └── 📄 database.ts        # Database types
```

## Public Assets (`public/`)

```
public/
├── 📁 downloads/              # Mobile app files
│   ├── 📄 README.md          # Download instructions
│   └── 📄 chronicle-android.apk # Android APK
└── 📄 *.svg                  # Icons and graphics
```

## Mobile Apps

```
android/                       # Android project (Capacitor)
├── 📁 app/                   # Android app source
├── 📄 build.gradle           # Build configuration
└── 📄 variables.gradle       # Version variables

ios/                          # iOS project (Capacitor)
├── 📁 App/                   # iOS app source
└── 📄 debug.xcconfig         # Debug configuration
```

## Key Files

### Configuration
- `package.json` - Dependencies, scripts, metadata
- `next.config.ts` - Next.js configuration
- `capacitor.config.ts` - Mobile app configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Styling configuration

### Development
- `.env.example` - Environment template
- `.env.local` - Local environment (gitignored)
- `.gitignore` - Git ignore rules
- `eslint.config.mjs` - Code linting rules

### Documentation
- `README.md` - Project overview and setup
- `CHANGELOG.md` - Version history
- `SECURITY.md` - Security policy
- `LICENSE` - MIT license

## Naming Conventions

### Files
- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with `use-` prefix (`use-achievements.ts`)
- **Utilities**: camelCase (`storage.ts`)
- **Types**: camelCase (`index.ts`)
- **Pages**: kebab-case folders (`/achievements/`)

### Folders
- **Features**: kebab-case (`achievements/`, `user-profile/`)
- **Generic**: camelCase (`components/`, `hooks/`)
- **Config**: lowercase (`docs/`, `scripts/`)

### Code
- **Variables**: camelCase (`userName`, `isLoading`)
- **Functions**: camelCase (`getUserData`, `handleSubmit`)
- **Components**: PascalCase (`UserProfile`, `TaskList`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`, `MAX_ITEMS`)

## Architecture Principles

### Separation of Concerns
- **Pages**: Route handling and layout
- **Components**: UI rendering and user interaction
- **Hooks**: Business logic and state management
- **Utils**: Pure functions and helpers
- **Types**: Data structure definitions

### Feature Organization
Each feature (achievements, goals, etc.) follows the same pattern:
```
feature/
├── 📁 components/            # Feature-specific components
├── 📄 use-feature.ts        # Feature hook
└── 📄 page.tsx              # Feature page
```

### Dependency Flow
```
Pages → Components → Hooks → Utils
  ↓         ↓         ↓       ↓
Types ← Types ← Types ← Types
```

## Best Practices

### File Organization
- Group related files together
- Keep components small and focused
- Use index files for clean imports
- Separate concerns clearly

### Code Structure
- One component per file
- Export default for main component
- Named exports for utilities
- Clear, descriptive names

### Documentation
- README for each major folder
- Inline comments for complex logic
- Type definitions for all data
- Examples in documentation

This structure supports:
- ✅ Easy navigation and discovery
- ✅ Scalable feature development
- ✅ Clear separation of concerns
- ✅ Professional development workflow
- ✅ Collaborative development
- ✅ Maintainable codebase