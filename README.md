# Chronicle - Personal Tracker App

A simple, personal tracking application to help manage and remember achievements, resources, goals, tasks, and routines. Built as a web-first application that also works on mobile devices.

## 🚀 Current Status: MVP Phase 1 - Achievements Feature Complete

### ✅ What's Working Now

**Achievements Tracker** - Fully functional!
- ✅ Add new achievements with type, title, description, date, tags, and proof URL
- ✅ View all achievements in a responsive card grid
- ✅ Edit existing achievements
- ✅ Delete achievements with confirmation
- ✅ Filter by achievement type (book, certificate, skill, other)
- ✅ Search by title, description, or tags
- ✅ Data persists in localStorage
- ✅ Clean, responsive UI with shadcn/ui components

**Dashboard** - Basic overview
- ✅ Shows achievement counts by type
- ✅ Quick navigation to all features
- ✅ Welcome message for new users

**Navigation** - Working across all pages
- ✅ Responsive navigation bar
- ✅ Mobile-friendly dropdown menu

### 🔄 Coming Next (Phase 1 Remaining)

- **Resources Library** - Save notes, links, and information
- **Goals Planner** - Set and track progress towards goals
- **Task Manager** - Daily todos and task management
- **Routine Builder** - Create repeating daily/weekly habits

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Storage:** localStorage (browser-based)
- **Icons:** Lucide React

## 🏃‍♂️ Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── achievements/       # Achievements feature
│   ├── resources/          # Resources (placeholder)
│   ├── goals/             # Goals (placeholder)
│   ├── tasks/             # Tasks (placeholder)
│   ├── routines/          # Routines (placeholder)
│   ├── layout.tsx         # Root layout with navigation
│   └── page.tsx           # Dashboard
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── achievements/      # Achievement-specific components
│   └── layout/            # Navigation components
├── hooks/
│   └── use-achievements.ts # Achievement data management
├── lib/
│   ├── storage.ts         # localStorage utilities
│   └── utils.ts           # Helper functions
└── types/
    └── index.ts           # TypeScript interfaces
```

## 🎯 Features in Detail

### Achievements Tracker

Track your accomplishments with rich metadata:

- **Types:** Books, Certificates, Skills, Other
- **Rich Data:** Title, description, completion date, tags, proof URLs
- **Organization:** Filter by type, search across all fields
- **Persistence:** All data saved locally in your browser

### Data Storage

- **Local Storage:** All data stored in browser localStorage
- **No Account Required:** Single-user, local-only for MVP
- **Data Export/Import:** Coming in Phase 2

## 🧪 Testing

- **TypeScript:** `npx tsc --noEmit` - ✅ No errors
- **Linting:** `npm run lint` - ✅ No errors
- **Manual Testing:** All achievement features working correctly

## 📱 Browser Support

- Chrome, Firefox, Safari (latest versions)
- Mobile responsive design
- Works offline (localStorage)

## 🔮 Roadmap

### Phase 2: Complete MVP (Week 2)
- Resources Library
- Goals Planner  
- Task Manager
- Routine Builder
- Data export/import

### Phase 3: Mobile App (Week 3)
- Capacitor integration
- iOS/Android builds

### Phase 4: Backend Integration (Week 4-5)
- Supabase integration
- User authentication
- Cloud sync

## 🤝 Contributing

This is a personal project, but feel free to fork and adapt for your own use!

## 📄 License

MIT License - feel free to use this code for your own projects.

---

**Built with ❤️ using Next.js, TypeScript, and shadcn/ui**