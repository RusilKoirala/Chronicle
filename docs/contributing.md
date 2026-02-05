# Contributing to Chronicle

Thank you for your interest in contributing to Chronicle! This document provides guidelines and information for contributors.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**Good Bug Reports Include:**
- Clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (browser, OS, device)
- Console errors (if any)

### Suggesting Features

We welcome feature suggestions! Please:
- Check existing feature requests first
- Explain the problem you're trying to solve
- Describe your proposed solution
- Consider the scope and complexity
- Think about how it fits Chronicle's philosophy

### Contributing Code

#### Getting Started
1. Fork the repository
2. Clone your fork locally
3. Create a feature branch
4. Make your changes
5. Test thoroughly
6. Submit a pull request

#### Development Setup
```bash
# Clone your fork
git clone https://github.com/yourusername/chronicle.git
cd chronicle

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Making Changes

**Before You Start:**
- Check existing issues and PRs
- Discuss major changes in an issue first
- Keep changes focused and atomic
- Follow existing code patterns

**Code Guidelines:**
- Use TypeScript for all new code
- Follow existing naming conventions
- Keep components small and focused
- Add proper error handling
- Include TypeScript types
- Write clear, self-documenting code

**Testing:**
- Test your changes manually
- Ensure mobile compatibility
- Check both light and dark themes
- Verify accessibility features
- Test data persistence

#### Commit Messages

Use clear, descriptive commit messages:

```
feat: add goal progress tracking
fix: resolve mobile navigation overflow
docs: update API documentation
style: format code with prettier
refactor: simplify storage utilities
test: add unit tests for achievements
chore: update dependencies
```

**Format:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

#### Pull Request Process

1. **Create Pull Request**
   - Use a clear, descriptive title
   - Reference related issues
   - Describe what changes were made
   - Include screenshots for UI changes

2. **PR Description Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Refactoring

   ## Testing
   - [ ] Tested locally
   - [ ] Mobile compatibility checked
   - [ ] Dark mode tested

   ## Screenshots
   (If applicable)

   ## Related Issues
   Closes #123
   ```

3. **Review Process**
   - Maintainers will review your PR
   - Address feedback promptly
   - Keep discussions constructive
   - Be patient with the review process

4. **After Approval**
   - Squash commits if requested
   - Ensure CI passes
   - Maintainer will merge when ready

## Development Guidelines

### Project Philosophy

Chronicle is built with these principles:
- **Simplicity**: Keep features focused and intuitive
- **Privacy**: User data stays with the user
- **Performance**: Fast, responsive experience
- **Accessibility**: Usable by everyone
- **Cross-platform**: Works on web and mobile

### Architecture Decisions

**Technology Choices:**
- Next.js for web framework
- TypeScript for type safety
- Tailwind CSS for styling
- Capacitor for mobile apps
- localStorage for data persistence

**Code Organization:**
- Feature-based folder structure
- Custom hooks for logic
- Reusable UI components
- Type-safe data models

### Adding New Features

1. **Plan the Feature**
   - Create an issue for discussion
   - Consider user experience
   - Think about data models
   - Plan component structure

2. **Implementation Steps**
   - Add TypeScript types
   - Create custom hooks
   - Build UI components
   - Add navigation routes
   - Update documentation

3. **Testing Checklist**
   - [ ] Feature works as expected
   - [ ] Mobile responsive
   - [ ] Dark mode compatible
   - [ ] Accessible (keyboard navigation, screen readers)
   - [ ] Data persists correctly
   - [ ] No console errors

## Documentation

### Writing Documentation

- Use clear, simple language
- Include code examples
- Add screenshots for UI features
- Keep documentation up to date
- Consider different skill levels

### Documentation Types

- **User Guides**: How to use features
- **Developer Docs**: Technical implementation
- **API Reference**: Function and component docs
- **Tutorials**: Step-by-step walkthroughs

## Community

### Getting Help

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and community chat

### Recognition

Contributors are recognized in:
- GitHub contributors list
- Release notes for significant contributions
- Special thanks in documentation

## Release Process

### Version Numbers

We use semantic versioning (semver):
- **Major** (1.0.0): Breaking changes
- **Minor** (0.1.0): New features
- **Patch** (0.0.1): Bug fixes

### Release Schedule

- **Patch releases**: As needed for bug fixes
- **Minor releases**: Monthly for new features
- **Major releases**: Quarterly or for breaking changes

## Questions?

Don't hesitate to ask questions:
- Open a GitHub Discussion
- Comment on relevant issues

We're here to help and appreciate your contributions!

---

Thank you for contributing to Chronicle! 🎉