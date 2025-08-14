# CLAUDE.md - Dudoxx Convex Frontend Development Guide

## 🎯 Purpose
This file provides Claude Code with essential context for developing the Dudoxx Convex Frontend application. This is a Next.js 15 application with secure server-side authentication that integrates with a self-hosted Convex backend.

## 🚀 Quick Start Commands

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Check types
npm run typecheck
```

### Backend Integration
```bash
# Ensure Convex backend is running first
cd ../dudoxx-convex-docker && ./start.sh

# Verify backend connection
curl http://127.0.0.1:3210/

# Test authentication endpoints
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"testpass123"}'
```

## 🏗️ System Architecture

### Service URLs
- **Next.js App**: `http://localhost:3000` (default development port)
- **Convex Backend**: `http://127.0.0.1:3210` (server-side only)
- **Next.js API Routes**: `http://localhost:3000/api/*`

### Security Architecture
```
Client Browser → Next.js API Routes → Convex Backend
     ❌              ✅                   ✅
   No direct       Server-side         Self-hosted
   backend         authentication       backend
   access
```

## 📋 MUST Follow Rules

### 1. Security First
- **NEVER** expose `CONVEX_URL` to client (no `NEXT_PUBLIC_` prefix)
- **ALWAYS** use Next.js API routes for backend communication
- **NEVER** import or use Convex client packages in client components
- **ALWAYS** validate origins in API routes
- **MUST** sanitize all user inputs on server-side

### 2. Authentication Flow
- **MUST** use server-side authentication through `/api/auth/*` endpoints
- **MUST** store session data securely (use JWT tokens in production)
- **MUST** validate sessions on every protected route
- **MUST** log authentication events for security auditing
- **NEVER** expose user credentials or internal IDs to client

### 3. Theme System
- **MUST** support both Ocean and Royal theme palettes
- **MUST** support light/dark mode for each theme
- **ALWAYS** use CSS custom properties for theming
- **NEVER** hardcode colors - use theme variables

### 4. Component Development
- **ALWAYS** follow existing component patterns
- **MUST** use TypeScript with strict typing
- **PREFER** server components when possible
- **USE** "use client" directive only when necessary
- **ALWAYS** handle loading and error states

## 📚 Project Structure

```
dudoxx-convex-frontend/
├── .env.local              # Environment variables (server-side only)
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/        # Authentication pages
│   │   │   ├── login/     # Login page
│   │   │   └── register/  # Registration page
│   │   ├── api/           # API routes (SERVER-SIDE ONLY)
│   │   │   └── auth/      # Authentication endpoints
│   │   ├── dashboard/     # Protected dashboard area
│   │   ├── globals.css    # Global styles + theme definitions
│   │   ├── layout.tsx     # Root layout with providers
│   │   └── page.tsx       # Home page
│   ├── components/        # Reusable components
│   │   ├── auth-provider.tsx    # Secure auth provider (no Convex client)
│   │   ├── theme-provider.tsx   # Theme system provider
│   │   └── theme-switcher.tsx   # Theme/mode switcher component
│   └── lib/
│       └── utils.ts       # Utility functions
├── convex/                # Convex functions (for backend reference only)
└── package.json          # Dependencies and scripts
```

## 🎨 Theme System Architecture

### Color Palettes
```css
/* Ocean Theme */
--ocean-primary: #1e3a8a;      /* Prussian Blue */
--ocean-secondary: #93c5fd;    /* Light Blue */
--ocean-accent: #1d4ed8;       /* Gradient middle */

/* Royal Theme */  
--royal-primary: #1e40af;      /* Royal Blue */
--royal-secondary: #f59e0b;    /* Gold */
--royal-accent: #3730a3;       /* Deep purple */
```

### Usage Patterns
```tsx
// ALWAYS use theme-aware components
<div className="bg-background text-foreground">
  <Button className="bg-primary text-primary-foreground">
    Themed Button
  </Button>
</div>

// NEVER hardcode colors
<div className="bg-blue-500"> ❌ WRONG
<div className="bg-primary">   ✅ CORRECT
```

## 🔧 Development Patterns

### API Route Pattern
```typescript
// ALWAYS use this security pattern for API routes
import { NextRequest, NextResponse } from 'next/server';
import { validateRequest, validateOrigin } from '../middleware';

export async function POST(request: NextRequest) {
  // 1. Security validations
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  }

  // 2. Input validation
  const validation = validateRequest(await request.json());
  if (!validation.isValid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  // 3. Server-side processing
  try {
    // Your logic here
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Authentication Component Pattern
```tsx
// NEVER use Convex hooks in components
import { useState, useEffect } from 'react';

export function ProtectedComponent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session from localStorage/cookies
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      // Validate session through API route
      validateSession(sessionId).then(setUser);
    }
    setLoading(false);
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!user) return <LoginPrompt />;
  return <AuthenticatedContent />;
}
```

### Form Handling Pattern
```tsx
// ALWAYS use this pattern for auth forms
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    
    if (result.success) {
      localStorage.setItem('sessionId', result.sessionId);
      router.push('/dashboard');
    } else {
      setError(result.error);
    }
  } catch (err) {
    setError('Network error. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
```

## 🔐 Security Implementation

### Current Mock Store (Development)
- In-memory user storage with pre-populated test user
- Email: `test@example.com`, Password: `testpass123`
- Auth event logging and session management
- **WARNING**: Data lost on server restart (development only)

### Production Security Checklist
- [ ] Replace mock store with encrypted database
- [ ] Implement JWT token authentication  
- [ ] Add refresh token rotation
- [ ] Set up HTTPS with valid certificates
- [ ] Configure CSP headers
- [ ] Add rate limiting middleware
- [ ] Implement password hashing (bcrypt)
- [ ] Set up session timeout
- [ ] Add brute force protection
- [ ] Configure secure cookie settings

### Environment Variables
```bash
# Server-side only (NEVER expose to client)
CONVEX_URL=http://127.0.0.1:3210

# Client-side accessible
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Dudoxx Convex Frontend
```

## 🧪 Testing Patterns

### API Route Testing
```bash
# Registration test
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"testpass123"}'

# Login test  
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'

# Invalid credentials test
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"wrong@example.com","password":"wrongpass"}'
```

### Component Testing Pattern
```tsx
// ALWAYS test authentication flows
describe('LoginPage', () => {
  it('should handle successful login', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true, sessionId: 'test123' })
    });
    global.fetch = mockFetch;

    // Test implementation
  });

  it('should handle login errors', async () => {
    // Error case testing
  });
});
```

## 🎬 Common Tasks

### Add New Protected Route
1. Create page in appropriate directory
2. Add authentication check in layout or page
3. Handle loading and unauthenticated states
4. Test authentication flow

### Add New API Endpoint
1. Create route.ts in `/src/app/api/`
2. Import security middleware
3. Implement validation and error handling
4. Test with curl commands
5. Update documentation

### Modify Theme
1. Update CSS custom properties in `globals.css`
2. Test both light and dark modes
3. Verify all components use theme variables
4. Test theme switching functionality

### Debug Authentication Issues
1. Check browser network tab for API calls
2. Verify server logs for authentication attempts
3. Check localStorage for session data
4. Test API endpoints directly with curl
5. Verify backend connectivity

## 🚦 Deployment Guidelines

### Development Deployment
```bash
# Ensure backend is running
curl http://127.0.0.1:3210/

# Start Next.js development
npm run dev

# Verify authentication works
# Navigate to http://localhost:3000/register
```

### Production Deployment
```bash
# Build application
npm run build

# Start production server
npm start

# Health check
curl http://your-domain.com/api/auth/logout -X POST
```

### Environment Setup
1. **Development**: Use mock store, localhost URLs
2. **Staging**: Use test database, staging URLs
3. **Production**: Use encrypted database, HTTPS, JWT tokens

## 🔗 Integration Points

### Convex Backend Integration
- Server-side API routes communicate with Convex backend
- No client-side Convex dependencies
- Secure proxy pattern for all backend operations
- Admin key authentication for management operations

### External Services (Future)
- Email service for verification (implement in API routes)
- File upload service (server-side processing)
- Analytics service (privacy-compliant)
- Monitoring service (error tracking)

## 🚨 Troubleshooting

### Common Issues

**Authentication not working?**
1. Check if backend is running: `curl http://127.0.0.1:3210/`
2. Verify API routes respond: `curl http://localhost:3000/api/auth/login -X POST`
3. Check browser console for errors
4. Verify localStorage has session data

**Theme not switching?**
1. Check if `next-themes` is properly configured
2. Verify CSS custom properties are defined
3. Test theme persistence across page reloads
4. Check if components use theme variables

**Build failures?**
1. Run `npm run typecheck` for TypeScript errors
2. Run `npm run lint` for linting issues
3. Check Next.js compatibility with dependencies
4. Verify all imports are correct

**Backend connection issues?**
1. Ensure Docker backend is running
2. Check firewall settings for port 3210
3. Verify environment variables are set
4. Test direct backend connection

## 📝 Contributing Guidelines

### Before Making Changes
1. Read this entire CLAUDE.md file
2. Understand the security architecture
3. Test authentication flow locally
4. Check that themes work in both modes

### Code Quality Standards
- **TypeScript**: Strict mode, no `any` types
- **ESLint**: Fix all warnings and errors  
- **Security**: Validate all inputs, sanitize outputs
- **Performance**: Use React best practices
- **Accessibility**: WCAG 2.1 compliance

### Pull Request Checklist
- [ ] Authentication flow tested
- [ ] Both themes tested (light/dark modes)
- [ ] TypeScript compilation successful
- [ ] ESLint passes without warnings
- [ ] Security review completed
- [ ] Documentation updated

---

**Remember**: This is a secure, production-ready authentication system. Always prioritize security over convenience. When in doubt, validate server-side and never trust client data.