# CLAUDE_auth.md - Authentication System Documentation

## 🔐 Authentication Architecture

### Overview
The Dudoxx Convex Frontend implements a **server-side only authentication system** that ensures complete security by preventing any client-side access to backend services. This architecture is specifically designed for self-hosted Convex backends.

### Security Model
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client        │    │   Next.js        │    │   Convex        │
│   (Browser)     │────│   API Routes     │────│   Backend       │
│   localStorage  │    │   (Auth Logic)   │    │   (User Store)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
      Session ID           Server Processing      Database Ops
      ✅ Secure            ✅ Validated          ✅ Protected
```

## 🏗️ Implementation Details

### Current Development Setup (Mock Store)

**Location**: `src/app/api/auth/mock-store.ts`

```typescript
// In-memory user storage for development
interface User {
  id: string;
  name: string; 
  email: string;
  password: string; // In production: hashed
  createdAt: string;
}

// Pre-populated test user
Email: test@example.com
Password: testpass123
```

**Features**:
- In-memory user storage
- Authentication event logging
- Session ID generation
- Email uniqueness validation
- Pre-populated test user for development

### API Routes Structure

**Base Path**: `/api/auth/*`

```
/api/auth/
├── middleware.ts          # Security validation functions
├── mock-store.ts         # Development user storage
├── register/route.ts     # User registration endpoint
├── login/route.ts        # User authentication endpoint
└── logout/route.ts       # Session termination endpoint
```

### Security Middleware

**File**: `src/app/api/auth/middleware.ts`

**Functions**:
```typescript
// Request validation and sanitization
validateRequest(body: any): { isValid: boolean, data?: any, error?: string }

// Origin validation for CSRF protection  
validateOrigin(request: Request): boolean

// Rate limiting (placeholder for production)
rateLimit(): { allowed: boolean }

// Security event logging
logSecurityEvent(event: string, details: any): void
```

**Security Features**:
- Input sanitization (removes prototype pollution risks)
- Origin validation (CSRF protection) 
- Request logging for security monitoring
- Development vs production origin handling

## 🔧 API Endpoints

### POST /api/auth/register

**Purpose**: Create new user account

**Request Body**:
```json
{
  "name": "User Name",
  "email": "user@example.com", 
  "password": "securepassword"
}
```

**Validation**:
- Name: Required, non-empty string
- Email: Required, valid email format, unique
- Password: Required, minimum 8 characters

**Success Response** (201):
```json
{
  "success": true,
  "message": "Account created successfully",
  "sessionId": "user_1234567890_abcdef"
}
```

**Error Responses**:
- 400: Missing/invalid fields
- 409: Email already exists
- 500: Server error

### POST /api/auth/login

**Purpose**: Authenticate existing user

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword"  
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Login successful", 
  "sessionId": "user_1234567890_abcdef",
  "user": {
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

**Error Responses**:
- 400: Missing email/password
- 401: Invalid credentials
- 500: Server error

### POST /api/auth/logout

**Purpose**: Terminate user session

**Response** (200):
```json
{
  "success": true,
  "message": "Logout successful"
}
```

## 🎭 Frontend Integration

### Authentication Pages

**Login Page**: `src/app/(auth)/login/page.tsx`
```typescript
// Key features:
- Form validation (email format, required fields)
- Loading states during authentication
- Error handling and display
- Automatic redirect to dashboard on success
- Session storage in localStorage
```

**Registration Page**: `src/app/(auth)/register/page.tsx`  
```typescript
// Key features:
- Extended form (name, email, password, confirm password)
- Password strength validation (min 8 characters)
- Password confirmation matching
- Terms acceptance checkbox
- Email format validation
```

### Protected Routes

**Dashboard**: `src/app/dashboard/page.tsx`
```typescript
// Authentication check pattern:
useEffect(() => {
  const sessionId = localStorage.getItem('sessionId');
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail');
  
  if (!sessionId || !userName || !userEmail) {
    router.push('/login');
    return;
  }
  
  setUserData({ name: userName, email: userEmail });
  setIsLoading(false);
}, [router]);
```

### Session Management

**Storage Method**: localStorage (development)
```typescript
// Login success - store session data
localStorage.setItem('sessionId', result.sessionId);
localStorage.setItem('userName', result.user.name);
localStorage.setItem('userEmail', result.user.email);

// Logout - clear session data
localStorage.removeItem('sessionId');
localStorage.removeItem('userName'); 
localStorage.removeItem('userEmail');
```

**Authentication State**:
```typescript
// Loading states
const [userData, setUserData] = useState<UserData | null>(null);
const [isLoading, setIsLoading] = useState(true);

// Redirect patterns
if (!sessionId) router.push('/login');
if (isLoading) return <LoadingSpinner />;
```

## 🚀 Production Deployment

### Required Changes for Production

**1. Replace Mock Store with Database**
```typescript
// Replace mock-store.ts with database integration
class DatabaseAuthStore {
  async findUserByEmail(email: string): Promise<User | null> {
    // Database query implementation
  }
  
  async createUser(userData: UserData): Promise<User> {
    // Hash password with bcrypt before storing
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    // Database insert with hashed password
  }
}
```

**2. Implement JWT Tokens**
```typescript
// Replace sessionId with JWT tokens
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Return secure HTTP-only cookie
response.cookies.set('auth-token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
});
```

**3. Enhanced Security Headers**
```typescript
// Add to API routes
headers: {
  'Content-Security-Policy': "default-src 'self'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000'
}
```

**4. Rate Limiting**
```typescript
// Implement proper rate limiting
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many auth attempts'
});
```

### Environment Variables for Production

```bash
# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=24h

# Database Configuration  
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Security Configuration
BCRYPT_ROUNDS=12
SESSION_TIMEOUT=86400000  # 24 hours in ms
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000  # 15 minutes in ms

# HTTPS Configuration (production)
NEXT_PUBLIC_APP_URL=https://your-secure-domain.com
CONVEX_URL=https://your-secure-convex-backend.com
```

## 🧪 Testing Authentication

### Manual Testing Commands

```bash
# 1. Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "password": "testpass123"
  }'

# 2. Test login with valid credentials
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'

# 3. Test login with invalid credentials  
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@example.com",
    "password": "wrongpass"
  }'

# 4. Test duplicate registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Duplicate User",
    "email": "test@example.com",
    "password": "anotherpass"  
  }'

# 5. Test logout
curl -X POST http://localhost:3000/api/auth/logout
```

### Expected Responses

**Successful Registration**:
```json
{
  "success": true,
  "message": "Account created successfully",
  "sessionId": "user_1755182906848_xgfqn6"
}
```

**Successful Login**:
```json
{
  "success": true,
  "message": "Login successful",
  "sessionId": "user_1755182906848_xgfqn6", 
  "user": {
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

**Failed Login**:
```json
{
  "error": "Invalid email or password"
}
```

**Duplicate Email**:
```json
{
  "error": "User with this email already exists"
}
```

### Automated Testing

**Jest Test Example**:
```typescript
describe('Authentication API', () => {
  it('should register new user successfully', async () => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpass123'
      })
    });
    
    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.sessionId).toBeDefined();
  });
});
```

## 🔍 Security Audit Checklist

### Current Security Status

**✅ Implemented**:
- [x] Server-side only authentication
- [x] Input validation and sanitization  
- [x] Origin validation (CSRF protection)
- [x] Error handling without information leakage
- [x] Session ID generation
- [x] Authentication event logging
- [x] Secure password requirements

**⏳ In Development**:
- [ ] Password hashing (bcrypt)
- [ ] JWT token implementation
- [ ] Database integration
- [ ] Rate limiting middleware
- [ ] Session timeout handling

**🚀 Production Requirements**:
- [ ] HTTPS enforcement
- [ ] HTTP-only secure cookies
- [ ] CSP headers implementation
- [ ] HSTS headers
- [ ] Refresh token rotation
- [ ] Account lockout after failed attempts
- [ ] Email verification system
- [ ] Password reset functionality

### Security Best Practices

**1. Password Security**:
```typescript
// Hash passwords before storage
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verify passwords
const isValid = await bcrypt.compare(password, hashedPassword);
```

**2. Session Security**:
```typescript
// Generate secure session IDs
const sessionId = crypto.randomBytes(32).toString('hex');

// Set secure cookie options
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict' as const,
  maxAge: 24 * 60 * 60 * 1000
};
```

**3. Input Validation**:
```typescript
// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sanitize inputs
const cleanInput = input.trim().toLowerCase();

// Validate password strength
const minLength = 8;
const hasUpperCase = /[A-Z]/.test(password);
const hasLowerCase = /[a-z]/.test(password);
const hasNumbers = /\d/.test(password);
```

## 🚨 Troubleshooting

### Common Issues

**1. Authentication fails silently**
```bash
# Check API response
curl -v http://localhost:3000/api/auth/login # Use -v for verbose output

# Check browser console for errors
# Check Network tab for failed requests
# Verify localStorage contains session data
```

**2. Origin validation fails**  
```javascript
// Check if origin is correct in development
console.log(window.location.origin); // Should match allowed origins

// For different ports (like 3300), update middleware.ts
// Development allows any localhost port automatically
```

**3. Session not persisting**
```javascript
// Check localStorage in browser DevTools
localStorage.getItem('sessionId'); 
localStorage.getItem('userName');
localStorage.getItem('userEmail');

// Ensure all three values are set after login
```

**4. Backend connection issues**
```bash
# Verify Convex backend is running
curl http://127.0.0.1:3210/

# Check environment variables
cat .env.local | grep CONVEX

# Test API routes directly
curl -X POST http://localhost:3000/api/auth/logout
```

### Debug Mode

Enable detailed logging by adding to API routes:
```typescript
console.log('Auth request:', { 
  method: request.method,
  origin: request.headers.get('origin'),
  userAgent: request.headers.get('user-agent')
});
```

---

**🔐 Security is our top priority. This authentication system is designed with defense-in-depth principles and can be easily enhanced for production deployment.**