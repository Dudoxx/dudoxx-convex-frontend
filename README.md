# 🚀 Dudoxx Convex Frontend

> **Secure Next.js 15 application with server-side authentication for self-hosted Convex backends**

[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC.svg)](https://tailwindcss.com/)
[![Security](https://img.shields.io/badge/Security-Server--Side_Only-green.svg)](https://github.com/dudoxx/dudoxx-convex-frontend)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 Overview

Dudoxx Convex Frontend is a production-ready Next.js 15 application designed specifically for secure integration with self-hosted Convex backends. Built by [Dudoxx](https://dudoxx.com), this frontend prioritizes security by implementing all backend communications through server-side API routes, ensuring zero client-side exposure to your Convex services.

### ✨ Key Features

- **🔒 Server-Side Authentication** - No client-side backend connections for maximum security
- **🎨 Dual Theme System** - Ocean (Blue gradient) and Royal (Blue & Gold) themes with light/dark modes
- **⚡ Next.js 15 + Turbopack** - Latest Next.js with Turbopack for ultra-fast development
- **🛡️ Security-First Architecture** - Origin validation, input sanitization, and CSRF protection
- **🎭 Beautiful UI Components** - Modern design with shadcn/ui and Lucide icons
- **📱 Responsive Design** - Mobile-first approach with Tailwind CSS v4
- **🔧 Developer Experience** - TypeScript, ESLint, and comprehensive documentation

## 🏗️ Architecture

### Security Model
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client        │    │   Next.js        │    │   Convex        │
│   Browser       │───▶│   API Routes     │───▶│   Backend       │
│                 │    │   (Server-Side)  │    │   (Secure)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
      ❌ No direct           ✅ Secure              ✅ Protected
      backend access         validation            self-hosted
```

### Theme System
```
Ocean Theme                    Royal Theme
├── Light Mode                ├── Light Mode
│   ├── Prussian Blue         │   ├── Royal Blue
│   └── Light Blue            │   └── Gold Accent
└── Dark Mode                 └── Dark Mode
    ├── Deep Blue                 ├── Deep Purple
    └── Cyan Highlights           └── Gold Highlights
```

## 📋 Prerequisites

- **Node.js** v18+ with npm
- **Self-hosted Convex Backend** ([dudoxx-convex-docker](https://github.com/dudoxx/dudoxx-convex-docker))
- **Modern Browser** with JavaScript enabled
- **4GB+ RAM** recommended for development

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/dudoxx/dudoxx-convex-frontend.git
cd dudoxx-convex-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
# Create environment file
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

**Environment Configuration:**
```bash
# Server-side only (NEVER expose to client)
CONVEX_URL=http://127.0.0.1:3210

# Client-side accessible
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Dudoxx Convex Frontend
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Test Authentication
Navigate to `http://localhost:3000` and test with the pre-configured user:
- **Email**: `test@example.com`
- **Password**: `testpass123`

## 🎨 Theme Customization

### Switch Between Themes
The application includes two beautiful theme palettes:

**Ocean Theme (Default)**
```css
--ocean-primary: #1e3a8a;      /* Prussian Blue */
--ocean-secondary: #93c5fd;    /* Light Blue */
--ocean-gradient: linear-gradient(135deg, #1e3a8a 0%, #93c5fd 100%);
```

**Royal Theme**
```css
--royal-primary: #1e40af;      /* Royal Blue */
--royal-secondary: #f59e0b;    /* Gold */
--royal-gradient: linear-gradient(135deg, #1e40af 0%, #f59e0b 100%);
```

### Adding Custom Themes
1. Define CSS custom properties in `src/app/globals.css`
2. Add theme configuration to Tailwind config
3. Update theme switcher component
4. Test in both light and dark modes

## 🛡️ Security Features

### Server-Side Authentication
- All authentication processed on Next.js server
- Zero client-side exposure to Convex backend
- Session management with secure tokens
- Comprehensive input validation and sanitization

### Security Middleware
```typescript
// Built-in security features
- Origin validation (CSRF protection)
- Request sanitization (XSS prevention)  
- Rate limiting (Brute force protection)
- Security event logging
- Secure session handling
```

### Production Security Checklist
- [x] Server-side only authentication
- [x] Input validation and sanitization
- [x] Origin validation for CSRF protection
- [x] Secure session management
- [ ] JWT token implementation (replace mock store)
- [ ] HTTPS configuration
- [ ] Password hashing (bcrypt)
- [ ] Rate limiting middleware
- [ ] Security headers (CSP, HSTS)

## 📚 Documentation

### Core Documentation
- [CLAUDE.md](CLAUDE.md) - Comprehensive development guide
- [CLAUDE_auth.md](CLAUDE_auth.md) - Authentication system details
- [CLAUDE_themes.md](CLAUDE_themes.md) - Theme system documentation
- [CLAUDE_security.md](CLAUDE_security.md) - Security implementation guide

## 🧪 Testing

### Authentication Testing
```bash
# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"testpass123"}'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'

# Test invalid credentials
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"wrong@example.com","password":"wrongpass"}'
```

### Component Testing
```bash
# Run TypeScript checks
npm run typecheck

# Run ESLint
npm run lint

# Build production bundle
npm run build

# Start production server
npm start
```

## 🛠️ Development

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── api/               # API routes (server-side only)
│   │   └── auth/          # Authentication endpoints
│   │       ├── middleware.ts    # Security middleware
│   │       ├── mock-store.ts    # Development auth store
│   │       ├── login/route.ts   # Login endpoint
│   │       ├── register/route.ts # Registration endpoint
│   │       └── logout/route.ts  # Logout endpoint
│   ├── dashboard/         # Protected dashboard area
│   ├── globals.css        # Global styles + theme definitions
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── auth-provider.tsx  # Secure auth provider (no Convex client)
│   ├── theme-provider.tsx # Theme system provider  
│   └── theme-switcher.tsx # Theme/mode switcher component
└── lib/
    └── utils.ts           # Utility functions
```

## 🤝 Integration

### Convex Backend Integration
This frontend is designed to work with the [dudoxx-convex-docker](https://github.com/dudoxx/dudoxx-convex-docker) self-hosted backend:

```bash
# Start backend (in separate terminal)
cd ../dudoxx-convex-docker
./start.sh

# Verify backend is running
curl http://127.0.0.1:3210/

# Start frontend  
cd dudoxx-convex-frontend
npm run dev
```

## 🐛 Troubleshooting

### Common Issues

**Authentication not working?**
```bash
# 1. Check backend connectivity
curl http://127.0.0.1:3210/

# 2. Test API endpoints
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'

# 3. Check browser console and network tab
# 4. Verify environment variables in .env.local
```

**Theme not switching?**
- Check if `next-themes` is working: Open browser dev tools → Application → Local Storage
- Verify CSS custom properties are defined in `globals.css`  
- Test both light/dark modes with different themes

**Build errors?**
```bash
# Check TypeScript
npm run typecheck

# Check linting
npm run lint

# Clean and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Getting Help
- 📖 Read [CLAUDE.md](CLAUDE.md) for detailed development guide
- 🔍 Check [Issues](https://github.com/dudoxx/dudoxx-convex-frontend/issues) for known problems
- 💬 Join our [Discord](https://discord.gg/dudoxx) for community support
- 📧 Email [support@dudoxx.com](mailto:support@dudoxx.com) for enterprise support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Fork the repository
git clone https://github.com/yourusername/dudoxx-convex-frontend.git
cd dudoxx-convex-frontend

# Create feature branch  
git checkout -b feature/your-feature-name

# Make changes and test
npm run typecheck
npm run lint
npm run build

# Submit pull request
```

## 🌟 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Vercel** - For hosting and deployment platform
- **Tailwind CSS** - For the utility-first CSS framework
- **shadcn/ui** - For beautiful UI components
- **Convex** - For the innovative backend platform
- **Our Contributors** - Thank you for making this project better

---

**Built with ❤️ by [Dudoxx](https://dudoxx.com)**

Need help? Check our [documentation](docs/) or contact [support@dudoxx.com](mailto:support@dudoxx.com)
