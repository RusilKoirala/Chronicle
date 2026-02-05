# Chronicle - Project Documentation

## Project Overview

A simple, personal tracking application to help manage and remember achievements, resources, goals, tasks, and routines. Built as a web-first application that also works on mobile devices.

**Current Status:** MVP Phase - Focus on Core Features Only

---

## Core Problem Statement

"I struggle to keep track of things I've accomplished - books I've read, certificates I've earned, skills I've learned. I also need a place to store important resources, set goals, and manage daily tasks. I want one simple app where I can add these things and easily find them later."

---

## Tech Stack

### Frontend
- **Next.js 14** (App Router, TypeScript)
- **shadcn/ui** - Clean, minimal UI components
- **Tailwind CSS** - Styling
- **Capacitor 6** - Native mobile wrapper (iOS/Android)

### Backend (Phase 2)
- **Supabase** - PostgreSQL database, authentication, real-time sync

### Storage (MVP)
- **localStorage** - Client-side storage for MVP
- **JSON export/import** - Data portability

### Deployment
- **Web:** Vercel (free tier)
- **Mobile:** Capacitor native builds

---

## MVP Features (Phase 1 - Focus Here)

### 1. Achievements Tracker ⭐
**Purpose:** Remember things you've accomplished

**Features:**
- Add achievement with:
  - Type (book, certificate, skill, other)
  - Title (required)
  - Description (optional)
  - Date completed
  - Tags for categorization
  - Proof URL (optional)
- View all achievements in a list/card grid
- Filter by type
- Search by title/tags
- Delete achievement
- Simple stats (total count by type)

**UI Components:**
- Card layout for list view
- Dialog form for add/edit
- Badge for tags
- Simple filter dropdown

---

### 2. Resources Library 📚
**Purpose:** Save important notes, links, and information

**Features:**
- Add resource with:
  - Type (note, link, file, other)
  - Title (required)
  - Content/description
  - URL (for links)
  - Category
  - Tags
- View all resources
- Filter by type/category
- Search
- Delete resource

**UI Components:**
- Card layout
- Dialog form
- Different display for links vs notes

---

### 3. Goals Planner 🎯
**Purpose:** Set and track goals

**Features:**
- Add goal with:
  - Title (required)
  - Description
  - Target date (optional)
  - Status (not started, in progress, completed)
  - Progress percentage (0-100)
- View all goals
- Update progress
- Filter by status
- Delete goal

**UI Components:**
- Card with progress bar
- Status badges
- Dialog form
- Calendar for date picking

---

### 4. Task Manager ✅
**Purpose:** Daily todos and task management

**Features:**
- Add task with:
  - Title (required)
  - Description (optional)
  - Due date
  - Completed checkbox
  - Mark as routine task
- View all tasks
- Mark complete/incomplete
- Filter: all, active, completed
- Delete task

**UI Components:**
- List view with checkboxes
- Dialog form
- Date picker
- Filter tabs

---

### 5. Routine Builder 🔄
**Purpose:** Create repeating daily/weekly routines

**Features:**
- Add routine with:
  - Title (required)
  - Days of week selection
  - Time
  - Active/inactive toggle
- View all routines
- Toggle active status
- Delete routine

**UI Components:**
- List view
- Dialog form
- Checkbox group for days
- Time picker
- Switch for active/inactive

---

## NOT in MVP (Future Features)

❌ User authentication (use local storage only)
❌ Multi-user support
❌ Cloud sync
❌ Push notifications/reminders
❌ File uploads
❌ Sharing functionality
❌ Advanced analytics/charts
❌ Custom themes
❌ Collaboration features
❌ API integrations
❌ Calendar view
❌ Habit tracking

**Focus:** Get the 5 core features working perfectly before adding anything else.

---

## Project Structure

```
my-tracker/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Dashboard
│   │   ├── achievements/
│   │   │   └── page.tsx
│   │   ├── resources/
│   │   │   └── page.tsx
│   │   ├── goals/
│   │   │   └── page.tsx
│   │   ├── tasks/
│   │   │   └── page.tsx
│   │   └── routines/
│   │       └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/                      # shadcn components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── separator.tsx
│   │   │
│   │   ├── achievements/
│   │   │   ├── achievement-list.tsx
│   │   │   ├── achievement-card.tsx
│   │   │   ├── achievement-form.tsx
│   │   │   └── achievement-filter.tsx
│   │   │
│   │   ├── resources/
│   │   │   ├── resource-list.tsx
│   │   │   ├── resource-card.tsx
│   │   │   └── resource-form.tsx
│   │   │
│   │   ├── goals/
│   │   │   ├── goal-list.tsx
│   │   │   ├── goal-card.tsx
│   │   │   └── goal-form.tsx
│   │   │
│   │   ├── tasks/
│   │   │   ├── task-list.tsx
│   │   │   ├── task-item.tsx
│   │   │   └── task-form.tsx
│   │   │
│   │   ├── routines/
│   │   │   ├── routine-list.tsx
│   │   │   ├── routine-card.tsx
│   │   │   └── routine-form.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── navigation.tsx
│   │   │   └── header.tsx
│   │   │
│   │   └── shared/
│   │       ├── search-bar.tsx
│   │       └── tag-input.tsx
│   │
│   ├── lib/
│   │   ├── storage.ts               # localStorage utilities
│   │   ├── utils.ts                 # Helper functions
│   │   └── constants.ts             # App constants
│   │
│   ├── hooks/
│   │   ├── use-achievements.ts
│   │   ├── use-resources.ts
│   │   ├── use-goals.ts
│   │   ├── use-tasks.ts
│   │   ├── use-routines.ts
│   │   └── use-local-storage.ts
│   │
│   └── types/
│       └── index.ts                 # TypeScript interfaces
│
├── public/
│   ├── icons/
│   └── favicon.ico
│
├── ios/                              # Generated by Capacitor
├── android/                          # Generated by Capacitor
│
├── .env.local                        # Environment variables
├── capacitor.config.ts              # Capacitor configuration
├── next.config.js                   # Next.js configuration
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json
└── README.md
```

---

## Data Models (TypeScript Interfaces)

```typescript
// src/types/index.ts

export interface Achievement {
  id: string;
  type: 'book' | 'certificate' | 'skill' | 'other';
  title: string;
  description?: string;
  dateCompleted: string; // ISO date string
  tags: string[];
  proofUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  type: 'note' | 'link' | 'file' | 'other';
  title: string;
  content: string;
  url?: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate?: string; // ISO date string
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number; // 0-100
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO date string
  completed: boolean;
  isRoutine: boolean;
  reminderTime?: string; // HH:MM format
  createdAt: string;
  updatedAt: string;
}

export interface Routine {
  id: string;
  title: string;
  daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
  time: string; // HH:MM format
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Storage structure
export interface AppData {
  achievements: Achievement[];
  resources: Resource[];
  goals: Goal[];
  tasks: Task[];
  routines: Routine[];
  version: string; // For future migrations
}
```

---

## Storage Strategy (MVP)

### localStorage Keys
```
tracker_achievements   // JSON array of achievements
tracker_resources      // JSON array of resources
tracker_goals          // JSON array of goals
tracker_tasks          // JSON array of tasks
tracker_routines       // JSON array of routines
tracker_version        // App version for data migration
```

### Data Operations
All data operations through custom hooks:
- `useAchievements()` - CRUD for achievements
- `useResources()` - CRUD for resources
- `useGoals()` - CRUD for goals
- `useTasks()` - CRUD for tasks
- `useRoutines()` - CRUD for routines

### Export/Import
- Export all data as JSON file
- Import from JSON file
- Backup functionality

---

## UI/UX Guidelines

### Design Principles
1. **Simple & Clean** - No fancy animations, focus on usability
2. **Minimal** - Only essential features in MVP
3. **Fast** - Instant feedback, no loading states (local data)
4. **Accessible** - Keyboard navigation, proper labels
5. **Mobile-first** - Works on small screens

### Color Scheme (shadcn default)
- Use slate color palette
- Minimal color usage
- Clear visual hierarchy

### Layout
- Consistent spacing
- Clear navigation
- Responsive grid (1 col mobile, 2-3 cols desktop)

### Components Pattern
Every feature follows same pattern:
1. List/Grid view
2. Add button (opens dialog)
3. Edit/Delete actions on items
4. Search/Filter at top

---

## Development Phases

### Phase 1: MVP (Weeks 1-2) ← **CURRENT FOCUS**

#### Week 1: Setup + Core Features
**Day 1-2: Project Setup**
- [ ] Create Next.js project
- [ ] Install shadcn/ui
- [ ] Setup TypeScript types
- [ ] Create basic layout and navigation
- [ ] Setup localStorage utilities

**Day 3-4: Achievements Feature**
- [ ] Achievement data model
- [ ] Achievement form (add/edit)
- [ ] Achievement list view
- [ ] Achievement card component
- [ ] Delete functionality
- [ ] Filter by type
- [ ] Search functionality

**Day 5-6: Resources Feature**
- [ ] Resource data model
- [ ] Resource form
- [ ] Resource list view
- [ ] Resource card (different for links/notes)
- [ ] Delete functionality
- [ ] Filter and search

**Day 7: Goals Feature**
- [ ] Goal data model
- [ ] Goal form with progress slider
- [ ] Goal list with progress bars
- [ ] Update goal progress
- [ ] Delete functionality

#### Week 2: Tasks, Routines, Polish

**Day 8-9: Tasks Feature**
- [ ] Task data model
- [ ] Task form
- [ ] Task list with checkboxes
- [ ] Toggle complete/incomplete
- [ ] Filter tabs (all/active/completed)
- [ ] Delete functionality

**Day 10-11: Routines Feature**
- [ ] Routine data model
- [ ] Routine form (days selector, time picker)
- [ ] Routine list view
- [ ] Toggle active/inactive
- [ ] Delete functionality

**Day 12-13: Dashboard & Polish**
- [ ] Dashboard overview cards
- [ ] Stats (counts for each category)
- [ ] Navigation between pages
- [ ] Responsive design fixes
- [ ] Mobile testing

**Day 14: Data Management**
- [ ] Export all data as JSON
- [ ] Import JSON data
- [ ] Clear all data option
- [ ] Data validation

---

### Phase 2: Mobile App (Week 3)
- [ ] Install Capacitor
- [ ] Configure for static export
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Build mobile apps
- [ ] Test on real devices

---

### Phase 3: Backend Integration (Week 4-5)
**NOT IN MVP - Future Enhancement**
- Setup Supabase project
- Create database tables
- Migrate localStorage to Supabase
- Add authentication
- Sync local and remote data

---

## Development Guidelines for AI

### When Building Features:

1. **Start Simple**
   - Basic functionality first
   - No animations or complex logic
   - Focus on working code

2. **Follow Patterns**
   - Use same structure for all features
   - Consistent naming conventions
   - Reuse components where possible

3. **TypeScript First**
   - Type everything
   - No `any` types
   - Use interfaces from types/index.ts

4. **Component Size**
   - Keep components small (< 200 lines)
   - Extract repeated logic
   - One responsibility per component

5. **Form Handling**
   - Use controlled inputs
   - Simple validation (required fields only for MVP)
   - Clear error messages

6. **State Management**
   - Use hooks for state
   - No global state library (MVP)
   - localStorage as source of truth

### Code Style:
```typescript
// Good - Simple and clear
export function AchievementCard({ achievement }: { achievement: Achievement }) {
  const { deleteAchievement } = useAchievements();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{achievement.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{achievement.description}</p>
        <Button onClick={() => deleteAchievement(achievement.id)}>
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}

// Bad - Over-complicated for MVP
export const AchievementCard = memo(({ achievement, onDelete, onEdit, theme }: Props) => {
  const [isAnimating, setIsAnimating] = useState(false);
  // ... complex animation logic
  // ... theme customization
  // Not needed in MVP!
});
```

---

## Testing Checklist (MVP)

### Manual Testing
- [ ] Add item to each category
- [ ] Edit item
- [ ] Delete item
- [ ] Search works
- [ ] Filter works
- [ ] Data persists on page reload
- [ ] Works on mobile screen size
- [ ] Export data works
- [ ] Import data works
- [ ] No console errors

### Browser Testing
- [ ] Chrome
- [ ] Safari
- [ ] Firefox

### Mobile Testing (Phase 2)
- [ ] iOS app works
- [ ] Android app works
- [ ] Touch interactions work
- [ ] Keyboard opens properly

---

## Deployment Checklist

### Web (Vercel)
- [ ] Push code to GitHub
- [ ] Connect to Vercel
- [ ] Verify build succeeds
- [ ] Test deployed app
- [ ] Custom domain (optional)

### Mobile (Capacitor)
- [ ] Build static export
- [ ] Sync with Capacitor
- [ ] Test iOS build
- [ ] Test Android build
- [ ] Create app store assets
- [ ] Submit to stores (future)

---

## Success Criteria for MVP

✅ **MVP is Complete When:**
1. All 5 core features work (achievements, resources, goals, tasks, routines)
2. Can add, view, edit, delete items in each category
3. Data persists in localStorage
4. Can export/import data
5. Works on mobile screen sizes
6. No critical bugs
7. Deployed to Vercel

❌ **Not Required for MVP:**
- User accounts
- Cloud sync
- Notifications
- Advanced features
- Perfect polish

---

## Next Steps After MVP

### Phase 2 Features (Priority Order)
1. Supabase integration (backend)
2. User authentication
3. Mobile app builds
4. Push notifications for tasks
5. Search improvements
6. Stats and insights
7. Custom themes
8. Data export formats (CSV, PDF)

---

## Resources & References

### Documentation
- Next.js: https://nextjs.org/docs
- shadcn/ui: https://ui.shadcn.com
- Capacitor: https://capacitorjs.com
- Supabase: https://supabase.com/docs

### Design Inspiration
- Keep it simple like: Apple Reminders, Google Keep, Notion (minimal view)

---

## Notes

### Important Decisions Made
1. **Web-first approach**: Build for web, then wrap for mobile
2. **localStorage for MVP**: Fastest way to get working
3. **No auth in MVP**: Single user, local only
4. **shadcn over component library**: More control, simpler
5. **TypeScript required**: Better code quality

### Known Limitations (MVP)
- No cloud sync (local only)
- No multi-device support
- No data backup (manual export only)
- No collaboration
- No offline indicator (always offline!)

### Future Considerations
- Data migration strategy when adding Supabase
- How to handle conflicts in sync
- Multi-user data isolation
- Performance with large datasets

---

## Project Metrics

### Target MVP Timeline
- Setup: 2 days
- Core features: 10 days
- Polish: 2 days
- **Total: 14 days (2 weeks)**

### Estimated Code Size
- ~2,000-3,000 lines of TypeScript
- ~20-30 React components
- ~5 custom hooks
- ~5 pages

### Performance Targets (MVP)
- Page load: < 2 seconds
- Action response: Instant (local data)
- Build time: < 2 minutes

---

**Version:** 1.0  
**Last Updated:** 2026-02-04  
**Status:** Planning Phase → Ready for Development

---

## Quick Start Command Reference

```bash
# Create project
npx create-next-app@latest my-tracker

# Install shadcn
npx shadcn@latest init

# Install components (run after shadcn init)
npx shadcn@latest add button input card dialog form calendar checkbox badge tabs select textarea separator

# Development
npm run dev

# Build
npm run build

# Capacitor (later)
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add ios android
```

---

## Contact & Support

This is a personal project. For future multi-user version:
- Add contact form
- Add feedback mechanism
- Add bug reporting

---

**Remember:** Focus on making 5 features work really well. Don't add anything else until MVP is complete and deployed!
