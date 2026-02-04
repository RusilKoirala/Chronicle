# Chronicle - Personal Tracker

A simple, personal tracking application to help manage and remember achievements, resources, goals, tasks, and routines. Built as a web-first application that also works on mobile devices.

## ✨ Features

### 🏆 Achievements Tracker
- Track books read, certificates earned, skills learned, and other accomplishments
- Add descriptions, completion dates, tags, and proof URLs
- Filter by type and search functionality
- Visual cards with detailed information

### 📚 Resources Library
- Save important notes, links, files, and information
- Organize by categories and tags
- Different display formats for different resource types
- Full-text search across all resources

### 🎯 Goals Planner
- Set and track progress towards your goals
- Visual progress bars and status tracking
- Target dates and completion tracking
- Click progress bars for quick updates

### ✅ Task Manager
- Daily task management with due dates
- Mark tasks as routine or one-time
- Filter by active, completed, or all tasks
- Overdue and due-today indicators

### 🔄 Routine Builder
- Create repeating daily/weekly routines
- Flexible day-of-week selection
- Active/inactive toggle for seasonal routines
- Today's routine overview

### 🌙 Dark/Light Mode
- System-aware theme switching
- Manual theme toggle
- Consistent theming across all components

### � Data Management
- Export all data as JSON backup
- Import data from backup files
- Local storage with instant sync
- Clear all data option

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chronicle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## � Mobile App (iOS/Android)

### Prerequisites for Mobile
- Xcode (for iOS development)
- Android Studio (for Android development)
- iOS Simulator or physical iOS device
- Android Emulator or physical Android device

### Build Mobile Apps

1. **Build web assets**
   ```bash
   npm run build:mobile
   ```

2. **Open iOS project**
   ```bash
   npm run ios
   ```

3. **Open Android project**
   ```bash
   npm run android
   ```

### Mobile Development Workflow
1. Make changes to your web app
2. Run `npm run build:mobile` to sync changes
3. Build and test in Xcode/Android Studio

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Icons**: Lucide React
- **Mobile**: Capacitor 6
- **Storage**: localStorage (MVP), Supabase (future)
- **Deployment**: Vercel (web), App Stores (mobile)

## 📁 Project Structure

```
chronicle/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── achievements/      # Achievement components
│   │   ├── resources/         # Resource components
│   │   ├── goals/             # Goal components
│   │   ├── tasks/             # Task components
│   │   ├── routines/          # Routine components
│   │   └── layout/            # Layout components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   └── types/                 # TypeScript definitions
├── ios/                       # iOS Capacitor project
├── android/                   # Android Capacitor project
└── out/                       # Static build output
```

## 🎨 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:mobile` - Build and sync with mobile apps
- `npm run ios` - Open iOS project in Xcode
- `npm run android` - Open Android project in Android Studio
- `npm run add:ios` - Add iOS platform
- `npm run add:android` - Add Android platform

## 💾 Data Storage

### Current (MVP)
- **localStorage**: All data stored locally in browser
- **Export/Import**: JSON backup and restore functionality
- **No sync**: Single device, offline-first

### Future (Phase 3)
- **Supabase**: Cloud database with real-time sync
- **Authentication**: User accounts and data isolation
- **Multi-device**: Sync across devices

## 🔧 Configuration

### Environment Variables
Create `.env.local` for future backend integration:
```env
# Future Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Capacitor Configuration
Mobile app settings in `capacitor.config.ts`:
```typescript
const config: CapacitorConfig = {
  appId: 'com.chronicle.app',
  appName: 'Chronicle',
  webDir: 'out'
};
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Add items to each category (achievements, resources, goals, tasks, routines)
- [ ] Edit and delete items
- [ ] Search and filter functionality
- [ ] Data persistence on page reload
- [ ] Export/import data
- [ ] Theme switching
- [ ] Mobile responsiveness

### Browser Testing
- [ ] Chrome/Chromium
- [ ] Safari
- [ ] Firefox
- [ ] Mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🗺 Roadmap

### ✅ Phase 1: MVP (Complete)
- [x] All 5 core features (achievements, resources, goals, tasks, routines)
- [x] localStorage data persistence
- [x] Export/import functionality
- [x] Dark/light mode
- [x] Responsive design

### ✅ Phase 2: Mobile App (Complete)
- [x] Capacitor integration
- [x] iOS app setup
- [x] Android app setup
- [x] Static export configuration

### 🔄 Phase 3: Backend Integration (Future)
- [ ] Supabase integration
- [ ] User authentication
- [ ] Cloud data sync
- [ ] Multi-device support

### 🔄 Phase 4: Enhanced Features (Future)
- [ ] Push notifications
- [ ] Advanced analytics
- [ ] Data visualization
- [ ] Collaboration features
- [ ] API integrations

## 📞 Support

For support, please open an issue on GitHub or contact [your-email@example.com].

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Capacitor](https://capacitorjs.com/) for mobile app capabilities
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

---

**Built with ❤️ for personal productivity and growth tracking.**