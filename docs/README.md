# Chronicle Documentation

Welcome to the Chronicle documentation! This folder contains all the documentation you need to understand, use, and contribute to Chronicle.

## 📚 Documentation Index

### Getting Started
- **[Getting Started Guide](getting-started.md)** - How to use Chronicle
- **[Development Guide](development.md)** - Setting up your development environment
- **[Contributing Guide](contributing.md)** - How to contribute to the project

### Project Structure
- **[Project Structure](project-structure.md)** - Detailed project organization
- **[Folder Structure](FOLDER_STRUCTURE.md)** - Complete folder breakdown
- **[Cleanup Summary](CLEANUP_SUMMARY.md)** - Recent codebase improvements

### Design & Features
- **[Design System](design/design-system.md)** - Design tokens, patterns, and accessibility
- **[Fast Capture System](features/fast-capture.md)** - Quick input feature documentation

### Development
- **[Project Specification](development/PROJECT.md)** - Original project requirements
- **[AI Development Context](development/AI_PROMPT.md)** - AI assistant context

## 🗂️ Documentation Structure

```
docs/
├── README.md (this file)
├── getting-started.md
├── development.md
├── contributing.md
├── project-structure.md
├── FOLDER_STRUCTURE.md
├── CLEANUP_SUMMARY.md
│
├── design/
│   └── design-system.md
│
├── features/
│   └── fast-capture.md
│
└── development/
    ├── PROJECT.md
    └── AI_PROMPT.md
```

## 🎯 Quick Links

### For Users
- [How to use Chronicle](getting-started.md)
- [Download mobile apps](../README.md#-quick-start)

### For Developers
- [Setup development environment](development.md)
- [Project structure overview](project-structure.md)
- [Contributing guidelines](contributing.md)

### For Designers
- [Design system documentation](design/design-system.md)
- [Design tokens](../src/lib/design-tokens.ts)

### For Contributors
- [How to contribute](contributing.md)
- [Project structure](project-structure.md)
- [Code organization](FOLDER_STRUCTURE.md)

## 📖 Documentation Guidelines

When adding new documentation:

1. **Location**
   - User guides → Root `docs/` folder
   - Design docs → `docs/design/`
   - Feature docs → `docs/features/`
   - Dev artifacts → `docs/development/`

2. **Format**
   - Use Markdown (.md)
   - Include a clear title
   - Add a table of contents for long docs
   - Use code blocks with language tags
   - Include examples where helpful

3. **Style**
   - Write clearly and concisely
   - Use headings for structure
   - Include links to related docs
   - Add diagrams when helpful
   - Keep it up to date

4. **Naming**
   - Use kebab-case: `my-document.md`
   - Be descriptive: `fast-capture.md` not `fc.md`
   - Use README.md for folder overviews

## 🔄 Keeping Docs Updated

Documentation should be updated when:
- Adding new features
- Changing project structure
- Updating dependencies
- Modifying workflows
- Fixing bugs that affect usage

## 📝 Documentation Checklist

When creating new documentation:

- [ ] Clear title and purpose
- [ ] Table of contents (if > 3 sections)
- [ ] Code examples with syntax highlighting
- [ ] Links to related documentation
- [ ] Screenshots or diagrams (if helpful)
- [ ] Last updated date
- [ ] Added to this README index

## 🤝 Contributing to Docs

Found an error or want to improve the docs?

1. Edit the relevant markdown file
2. Follow the documentation guidelines above
3. Submit a pull request
4. Update this README if adding new docs

## 📞 Need Help?

- 🐛 [Report issues](https://github.com/yourusername/chronicle/issues)
- 💬 [Start a discussion](https://github.com/yourusername/chronicle/discussions)
- 📧 Contact the maintainers

---

**Last Updated**: February 6, 2026
**Documentation Version**: 1.0
