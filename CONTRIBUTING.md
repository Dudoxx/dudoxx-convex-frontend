# Contributing to Dudoxx Convex Frontend

We love your input! We want to make contributing to Dudoxx Convex Frontend as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## 🚀 Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/yourusername/dudoxx-convex-frontend.git
cd dudoxx-convex-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Check types
npm run typecheck
```

## 📋 Contribution Guidelines

### Code Style

- **TypeScript**: We use strict TypeScript. No `any` types unless absolutely necessary
- **ESLint**: Follow the ESLint configuration. Run `npm run lint` to check
- **Prettier**: Code is automatically formatted with Prettier
- **Security**: Security-first mindset. All inputs must be validated
- **Testing**: Write tests for new functionality

### Commit Messages

We follow the [Conventional Commits](https://conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

**Examples:**
```
feat(auth): add JWT token refresh mechanism
fix(ui): resolve theme switching issue in dark mode
docs(security): update authentication security guide
```

### Security Requirements

**🚨 Security is our top priority. All contributions must:**

- Never expose backend endpoints to client-side code
- Validate all inputs on the server-side
- Use proper authentication and authorization
- Follow OWASP security guidelines
- Log security events appropriately

### Testing Requirements

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and authentication flows  
- **Security Tests**: Test for common vulnerabilities
- **Accessibility Tests**: Ensure WCAG 2.1 compliance

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run security tests
npm run test:security

# Run accessibility tests
npm run test:a11y
```

## 🐛 Bug Reports

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/dudoxx/dudoxx-convex-frontend/issues/new).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

### Security Issues

**🔒 For security vulnerabilities, please do NOT open a public issue.**

Instead, email us at security@dudoxx.com with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Your contact information

We'll respond within 24 hours and work with you to resolve the issue responsibly.

## 🚀 Feature Requests

We welcome feature requests! Open an issue with:

- **Is your feature request related to a problem?** A clear description of what the problem is
- **Describe the solution you'd like** A clear description of what you want to happen
- **Describe alternatives you've considered** Other solutions you've thought of
- **Additional context** Screenshots, mockups, or any other context

## 📚 Documentation

Documentation improvements are always welcome! We have several types:

- **README.md** - Getting started guide
- **CLAUDE.md** - Comprehensive development guide  
- **CLAUDE_*.md** - Specialized topic guides
- **Code Comments** - Inline documentation
- **API Documentation** - Endpoint specifications

## 🎨 Design Guidelines

### Theme System

When contributing to themes:

- Follow existing color palette patterns
- Ensure WCAG 2.1 color contrast compliance
- Test in both light and dark modes
- Update theme documentation

### UI Components

- Use existing shadcn/ui components when possible
- Follow responsive design principles
- Ensure keyboard navigation works
- Test with screen readers

### Authentication UI

- Never expose sensitive information in error messages
- Use proper loading states
- Implement proper error handling
- Follow security best practices

## 🧪 Testing Your Changes

Before submitting a PR, please run:

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Tests
npm test

# Build
npm run build

# Test authentication flow
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"testpass123"}'

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
```

## 📝 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🤝 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Project maintainers are responsible for clarifying standards and will take appropriate action in response to unacceptable behavior.

## 🌟 Recognition

Contributors will be recognized in:
- README.md acknowledgments section
- Release notes for significant contributions
- Special contributor badge for multiple contributions

## 💬 Questions?

Feel free to:
- Open a discussion on GitHub
- Email us at dev@dudoxx.com
- Join our Discord community

---

**Thank you for contributing to Dudoxx Convex Frontend! 🎉**