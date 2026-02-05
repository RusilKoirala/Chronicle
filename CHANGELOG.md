# Changelog

All notable changes to Chronicle will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup
- Landing page with device-specific download buttons
- Professional project structure
- Documentation and contributing guidelines

## [1.0.0] - 2026-02-05

### Added
- **Core Features**
  - Track achievements (books, certificates, skills)
  - Save resources (notes, links, files)
  - Set and monitor goals with progress tracking
  - Manage daily tasks and todos
  - Build repeating routines
- **User Interface**
  - Clean, minimalist design
  - Dark and light theme support
  - Mobile-responsive layout
  - Touch-friendly interactions
- **Cross-Platform Support**
  - Web application (Next.js)
  - Android APK download
  - iOS app support
- **Data Management**
  - Local storage for privacy
  - Export/import functionality
  - Data persistence across sessions
- **Technical Features**
  - TypeScript for type safety
  - Tailwind CSS for styling
  - Capacitor for mobile apps
  - Static site generation

### Technical Details
- Built with Next.js 16 and React 19
- Uses shadcn/ui component library
- Capacitor 8 for mobile development
- localStorage for data persistence
- Vercel-ready deployment

### Known Limitations
- Local storage only (no cloud sync)
- Single user per device
- Manual data backup required

## Development Notes

### Version 1.0.0 Goals
- ✅ Five core features working
- ✅ Mobile app builds
- ✅ Clean, professional UI
- ✅ Data export/import
- ✅ Cross-platform compatibility

### Future Roadmap
- Cloud sync with Supabase
- Multi-device support
- Push notifications
- Advanced analytics
- Collaboration features