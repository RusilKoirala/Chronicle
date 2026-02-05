# Security Policy

## Supported Versions

We actively support the following versions of Chronicle:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in Chronicle, please report it responsibly.

### How to Report

1. **GitHub**: Use our private vulnerability reporting feature
2. **Do NOT** create public issues for security vulnerabilities

### What to Include

Please include the following information:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Suggested fix (if you have one)
- Your contact information

### Response Timeline

- **Initial Response**: Within 24 hours
- **Status Update**: Within 72 hours
- **Fix Timeline**: Depends on severity
  - Critical: 1-7 days
  - High: 1-2 weeks
  - Medium: 2-4 weeks
  - Low: Next release cycle

### Security Measures

Chronicle implements several security measures:

#### Data Protection
- Local storage by default (data stays on device)
- No tracking or analytics by default
- Optional cloud sync with encryption
- User data is never shared with third parties

#### Application Security
- Input validation and sanitization
- XSS protection
- CSRF protection
- Secure headers implementation
- Regular dependency updates

#### Mobile Security
- App signing for integrity
- Secure storage on mobile devices
- Permission-based access
- No unnecessary permissions requested

### Responsible Disclosure

We follow responsible disclosure practices:
1. We acknowledge receipt of your report
2. We investigate and validate the issue
3. We develop and test a fix
4. We release the fix
5. We publicly acknowledge your contribution (if desired)

### Bug Bounty

Currently, we do not offer a formal bug bounty program, but we greatly appreciate security researchers who help make Chronicle safer for everyone.

### Security Best Practices for Users

- Keep your app updated to the latest version
- Use strong, unique passwords if using cloud features
- Regularly export your data as backup
- Be cautious when importing data from unknown sources
- Report suspicious behavior immediately

## Contact

For security-related questions or concerns:
- GitHub: Use private vulnerability reporting
- GitHub Issues: For general security questions (non-sensitive)

Thank you for helping keep Chronicle secure!