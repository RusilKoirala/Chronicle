# Development Guide

This guide covers setting up Chronicle for development and contributing to the project.

## Prerequisites

- **Node.js**: 18.0 or higher
- **npm**: 9.0 or higher
- **Java**: 21 (for Android builds)
- **Xcode**: Latest version (for iOS builds, macOS only)
- **Git**: For version control

## Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/chronicle.git
cd chronicle
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit with your settings (optional)
nano .env.local
```

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Project Structure

```
chronicle/
├── docs/                    # Documentation
├── public/                  # Static assets
│   ├── downloads/          # Mobile app downloads
│   └── icons/              # App icons and favicons
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/        # Auth-protected routes
│   │   ├── dashboard/     # Main app dashboard
│   │   └── page.tsx       # Landing page
│   ├── components/
│   │   ├── ui/            # shadcn/ui components
│   │   ├── auth/          # Authentication
│   │   ├── landing/       # Landing page
│   │   ├── layout/        # Navigation and layout
│   │   ├── achievements/  # Achievement components
│   │   ├── resources/     # Resource components
│   │   ├── goals/         # Goal components
│   │   ├── tasks/         # Task components
│   │   └── routines/      # Routine components
│   ├── hooks/             # Custom React hooks
│   │   ├── use-*.ts       # Feature-specific hooks
│   │   └── use-hybrid-*.ts # Hybrid storage hooks
│   ├── lib/               # Utilities
│   │   ├── storage.ts     # localStorage utilities
│   │   └── utils.ts       # General utilities
│   └── types/             # TypeScript definitions
├── android/               # Capacitor Android
├── ios/                   # Capacitor iOS
└── scripts/               # Build scripts
```

## Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# Test locally
npm run dev

# Build and test
npm run build
npm run start
```

### 2. Code Quality
```bash
# Lint code
npm run lint

# Type check
npx tsc --noEmit

# Format code (if using Prettier)
npm run format
```

### 3. Testing
```bash
# Run tests (when available)
npm test

# Test mobile builds
npm run build:mobile
```

## Architecture

### Data Flow
1. **UI Components** → trigger actions
2. **Custom Hooks** → manage state and side effects
3. **Storage Layer** → persist data (localStorage/Supabase)
4. **Type System** → ensures data consistency

### State Management
- **Local State**: React useState/useReducer
- **Shared State**: Custom hooks with localStorage
- **Server State**: Supabase hooks (optional)

### Storage Strategy
- **MVP**: localStorage only
- **Enhanced**: Hybrid localStorage + Supabase
- **Mobile**: Native storage via Capacitor

## Adding New Features

### 1. Create Types
```typescript
// src/types/index.ts
export interface NewFeature {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}
```

### 2. Create Hook
```typescript
// src/hooks/use-new-feature.ts
export function useNewFeature() {
  // State management logic
  // CRUD operations
  // localStorage integration
}
```

### 3. Create Components
```typescript
// src/components/new-feature/
// - new-feature-list.tsx
// - new-feature-form.tsx
// - new-feature-card.tsx
```

### 4. Add Route
```typescript
// src/app/new-feature/page.tsx
export default function NewFeaturePage() {
  // Page component
}
```

### 5. Update Navigation
```typescript
// src/components/layout/navigation.tsx
// Add new route to navItems
```

## Mobile Development

### Android Setup
```bash
# Install Android Studio
# Set ANDROID_HOME environment variable

# Add Android platform
npx cap add android

# Build and sync
npm run build:mobile

# Open in Android Studio
npm run android
```

### iOS Setup
```bash
# Install Xcode from App Store

# Add iOS platform
npx cap add ios

# Build and sync
npm run build:mobile

# Open in Xcode
npm run ios
```

## Deployment

### Web Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel deploy
```

### Mobile Deployment
```bash
# Build mobile apps
npm run build:apps

# Follow platform-specific deployment guides
```

## Contributing Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Keep components small and focused
- Use custom hooks for logic
- Add proper TypeScript types

### Commit Messages
```
feat: add new achievement filtering
fix: resolve mobile navigation issue
docs: update development guide
style: format code with prettier
refactor: simplify storage hooks
test: add unit tests for goals
```

### Pull Request Process
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Update documentation
5. Submit pull request
6. Address review feedback

## Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules
rm -rf node_modules
npm install
```

**Mobile Build Issues**
```bash
# Clean Capacitor
npx cap clean

# Rebuild
npm run build:mobile
```

**TypeScript Errors**
```bash
# Check types
npx tsc --noEmit

# Restart TypeScript server in VS Code
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)