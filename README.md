# Chronicle

> Your personal tracking companion for achievements, goals, tasks, and more.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Capacitor](https://img.shields.io/badge/Capacitor-8.0-blue)](https://capacitorjs.com/)

Chronicle is a simple, clean personal tracking application that helps you manage and remember your achievements, save important resources, set goals, manage tasks, and build routines. Built with modern web technologies and available on web, iOS, and Android.

## ✨ Features

- **🏆 Track Achievements** - Remember books read, certificates earned, skills learned
- **📚 Save Resources** - Store important notes, links, and information
- **🎯 Set Goals** - Plan your future and track progress
- **✅ Manage Tasks** - Daily todos and task management
- **🔄 Build Routines** - Create repeating daily and weekly habits
- **🌙 Dark Mode** - Beautiful light and dark themes
- **📱 Cross-Platform** - Web, iOS, and Android support
- **🔒 Privacy First** - Your data stays with you

## 🚀 Quick Start

### Web App
Visit [chronicle-app.com](https://chronicle-app.com) to use Chronicle in your browser.

### Mobile Apps
- **iOS**: [Download from App Store](https://apps.apple.com/app/chronicle)
- **Android**: [Download APK](https://chronicle-app.com/downloads/chronicle-android.apk)

## 🛠 Development

### Prerequisites
- Node.js 18+ and npm
- Java 21 (for Android builds)
- Xcode (for iOS builds, macOS only)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/chronicle.git
cd chronicle

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building

```bash
# Build web app
npm run build

# Build mobile apps
npm run build:apps
```

### Project Structure

```
chronicle/
├── docs/                    # Documentation
├── public/                  # Static assets
│   └── downloads/          # Mobile app files
├── src/
│   ├── app/                # Next.js app router pages
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── auth/          # Authentication components
│   │   ├── landing/       # Landing page components
│   │   └── layout/        # Layout components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   └── types/             # TypeScript type definitions
├── android/               # Android app (Capacitor)
├── ios/                   # iOS app (Capacitor)
└── scripts/               # Build and utility scripts
```

## 📱 Mobile Development

Chronicle uses [Capacitor](https://capacitorjs.com/) to create native mobile apps from the web codebase.

### Android
```bash
# Add Android platform
npx cap add android

# Build and sync
npm run build:mobile

# Open in Android Studio
npm run android
```

### iOS
```bash
# Add iOS platform
npx cap add ios

# Build and sync
npm run build:mobile

# Open in Xcode
npm run ios
```

## 🎨 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Mobile**: Capacitor 8
- **Storage**: localStorage (web), native storage (mobile)
- **Authentication**: Supabase (optional)
- **Deployment**: Vercel (web), App Stores (mobile)

## 📖 Documentation

- [Getting Started](docs/getting-started.md)
- [Development Guide](docs/development.md)
- [Mobile App Building](docs/mobile-builds.md)
- [Deployment Guide](docs/deployment.md)
- [Contributing](docs/contributing.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/contributing.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Capacitor](https://capacitorjs.com/) for cross-platform mobile development
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

## 📞 Support

- 📧 Email: support@chronicle-app.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/chronicle/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/chronicle/discussions)

---

Made with ❤️ by the Chronicle team