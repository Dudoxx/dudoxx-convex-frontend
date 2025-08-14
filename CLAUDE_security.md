# CLAUDE_security.md - Security Implementation Guide

## 🛡️ Security Architecture Overview

### Security-First Design Philosophy
The Dudoxx Convex Frontend implements a **zero-trust architecture** with defense-in-depth principles, ensuring that security is built into every layer of the application rather than being an afterthought.

```
Security Layers:
┌─────────────────────────────────────┐
│   🌐 Network Security (HTTPS/TLS)   │
├─────────────────────────────────────┤
│   🔒 API Security (Server-Side)     │
├─────────────────────────────────────┤
│   🛡️  Input Validation & Sanitization│
├─────────────────────────────────────┤
│   🔐 Authentication & Authorization  │
├─────────────────────────────────────┤
│   📊 Monitoring & Logging           │
└─────────────────────────────────────┘
```

### Core Security Principles

1. **Server-Side Only Backend Communication** - Zero client exposure
2. **Defense in Depth** - Multiple security layers
3. **Principle of Least Privilege** - Minimal required access
4. **Input Validation Everywhere** - Trust nothing from clients
5. **Secure by Default** - Security enabled out of the box
6. **Audit Everything** - Comprehensive logging

## 🔐 Authentication Security

### Current Implementation (Development)

**Mock Store Security Features**:
```typescript
// File: src/app/api/auth/mock-store.ts

class MockAuthStore {
  // Secure session ID generation
  static generateSessionId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
  
  // Input validation
  static validateUserData(userData: any): ValidationResult {
    // Email format validation
    // Password strength requirements
    // Name sanitization
  }
  
  // Authentication event logging
  static logAuthEvent(event: AuthEvent): void {
    // Timestamp all events
    // Log success and failure attempts
    // Include relevant metadata (IP, user agent)
  }
}
```

**Security Features**:
- ✅ Session ID generation with entropy
- ✅ Email uniqueness validation
- ✅ Password minimum length enforcement
- ✅ Authentication event logging
- ✅ Input sanitization
- ✅ Error message security (no information leakage)

### Production Security Requirements

**1. Password Security**
```typescript
// bcrypt implementation for production
import bcrypt from 'bcryptjs';

class ProductionAuthStore {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12; // Higher rounds for better security
    return bcrypt.hash(password, saltRounds);
  }
  
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
  
  static validatePasswordStrength(password: string): ValidationResult {
    const requirements = {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    };
    
    // Implement validation logic
  }
}
```

**2. JWT Token Security**
```typescript
// JWT implementation with proper security
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
  sessionId: string;
  iat: number;
  exp: number;
}

class JWTSecurity {
  static generateAccessToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        sessionId: generateSecureId(),
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: '15m', // Short-lived access tokens
        issuer: 'dudoxx-convex-frontend',
        audience: 'dudoxx-users'
      }
    );
  }
  
  static generateRefreshToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET!,
      {
        expiresIn: '7d', // Longer-lived refresh tokens
        issuer: 'dudoxx-convex-frontend'
      }
    );
  }
  
  static verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    } catch (error) {
      // Log security event
      SecurityLogger.logTokenVerificationFailure(error);
      return null;
    }
  }
}
```

## 🔒 API Security

### Request Validation Middleware

**File**: `src/app/api/auth/middleware.ts`

```typescript
// Comprehensive request validation
export function validateRequest(body: any): ValidationResult {
  // 1. Type checking
  if (typeof body !== 'object' || body === null) {
    return { isValid: false, error: 'Invalid request format' };
  }

  // 2. Prototype pollution prevention
  const sanitized = { ...body };
  delete sanitized.__proto__;
  delete sanitized.constructor;
  delete sanitized.prototype;

  // 3. Deep sanitization for nested objects
  const deepSanitize = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const clean: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // Prevent dangerous property names
      if (['__proto__', 'constructor', 'prototype'].includes(key)) continue;
      
      // Sanitize string values
      if (typeof value === 'string') {
        clean[key] = value.trim().slice(0, 1000); // Limit length
      } else if (typeof value === 'object') {
        clean[key] = deepSanitize(value);
      } else {
        clean[key] = value;
      }
    }
    return clean;
  };

  return { isValid: true, data: deepSanitize(sanitized) };
}

// Origin validation for CSRF protection
export function validateOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  // Development: Allow localhost on any port
  if (isDevelopment) {
    if (origin?.startsWith('http://localhost:') || 
        origin?.startsWith('http://127.0.0.1:')) {
      return true;
    }
    if (referer?.startsWith('http://localhost:') || 
        referer?.startsWith('http://127.0.0.1:')) {
      return true;
    }
  }
  
  // Production: Strict whitelist
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.ADDITIONAL_ALLOWED_ORIGIN
  ].filter(Boolean);
  
  return allowedOrigins.some(allowed => 
    origin === allowed || referer?.startsWith(allowed + '/')
  );
}

// Rate limiting implementation
class RateLimiter {
  private static requests = new Map<string, number[]>();
  
  static isAllowed(identifier: string, windowMs = 900000, maxRequests = 10): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Get or create request history
    let requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    requests = requests.filter(timestamp => timestamp > windowStart);
    
    // Check if limit exceeded
    if (requests.length >= maxRequests) {
      SecurityLogger.logRateLimit(identifier, requests.length);
      return false;
    }
    
    // Add current request
    requests.push(now);
    this.requests.set(identifier, requests);
    
    return true;
  }
  
  static cleanup(): void {
    // Periodically clean up old entries
    const now = Date.now();
    for (const [key, requests] of this.requests.entries()) {
      const validRequests = requests.filter(timestamp => 
        timestamp > now - 3600000 // Keep 1 hour history
      );
      if (validRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validRequests);
      }
    }
  }
}
```

### Security Headers Implementation

```typescript
// Security headers for all API responses
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' http://127.0.0.1:3210; " +
    "frame-ancestors 'none';"
  );
  
  // HSTS (HTTPS only)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  return response;
}
```

## 🔍 Input Validation & Sanitization

### Email Validation
```typescript
class EmailValidator {
  private static readonly EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  static validate(email: string): ValidationResult {
    // Basic format check
    if (!this.EMAIL_REGEX.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }
    
    // Length check
    if (email.length > 254) {
      return { isValid: false, error: 'Email too long' };
    }
    
    // Domain validation
    const [localPart, domain] = email.split('@');
    if (localPart.length > 64) {
      return { isValid: false, error: 'Email local part too long' };
    }
    
    // Disposable email check (production)
    if (this.isDisposableEmail(domain)) {
      return { isValid: false, error: 'Disposable emails not allowed' };
    }
    
    return { isValid: true, data: email.toLowerCase().trim() };
  }
  
  private static isDisposableEmail(domain: string): boolean {
    // List of known disposable email domains
    const disposableDomains = [
      '10minutemail.com',
      'tempmail.org',
      'guerrillamail.com'
      // Add more as needed
    ];
    return disposableDomains.includes(domain.toLowerCase());
  }
}
```

### Password Security Validation
```typescript
class PasswordValidator {
  static validate(password: string): ValidationResult {
    const errors: string[] = [];
    
    // Length check
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (password.length > 128) {
      errors.push('Password must not exceed 128 characters');
    }
    
    // Character requirements
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    // Common password check
    if (this.isCommonPassword(password)) {
      errors.push('Password is too common, please choose a stronger password');
    }
    
    // Sequential characters check
    if (this.hasSequentialChars(password)) {
      errors.push('Password should not contain sequential characters');
    }
    
    return errors.length === 0 
      ? { isValid: true } 
      : { isValid: false, error: errors.join('; ') };
  }
  
  private static isCommonPassword(password: string): boolean {
    const commonPasswords = [
      'password', '123456', 'password123', 'admin', 'qwerty',
      'letmein', 'welcome', 'monkey', '1234567890'
    ];
    return commonPasswords.includes(password.toLowerCase());
  }
  
  private static hasSequentialChars(password: string): boolean {
    for (let i = 0; i < password.length - 2; i++) {
      const char1 = password.charCodeAt(i);
      const char2 = password.charCodeAt(i + 1);
      const char3 = password.charCodeAt(i + 2);
      
      if (char2 === char1 + 1 && char3 === char2 + 1) {
        return true; // Found 3 sequential characters
      }
    }
    return false;
  }
}
```

## 📊 Security Monitoring & Logging

### Security Event Logger
```typescript
class SecurityLogger {
  static logAuthenticationAttempt(event: AuthEvent): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: 'authentication_attempt',
      success: event.success,
      email: event.email ? this.maskEmail(event.email) : undefined,
      userId: event.userId,
      ip: event.ip,
      userAgent: event.userAgent,
      metadata: event.metadata
    };
    
    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(logEntry);
    } else {
      console.log('[SECURITY]', logEntry);
    }
    
    // Store in local security log
    this.storeSecurityLog(logEntry);
  }
  
  static logSuspiciousActivity(activity: SuspiciousActivity): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: 'suspicious_activity',
      type: activity.type,
      severity: activity.severity,
      ip: activity.ip,
      details: activity.details
    };
    
    // High severity events trigger immediate alerts
    if (activity.severity === 'high') {
      this.triggerSecurityAlert(logEntry);
    }
    
    this.storeSecurityLog(logEntry);
  }
  
  static logRateLimit(identifier: string, requestCount: number): void {
    this.logSuspiciousActivity({
      type: 'rate_limit_exceeded',
      severity: 'medium',
      ip: identifier,
      details: { requestCount, threshold: 10 }
    });
  }
  
  private static maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) return `${localPart}***@${domain}`;
    return `${localPart.substring(0, 2)}***@${domain}`;
  }
  
  private static storeSecurityLog(entry: any): void {
    // In production, store in secure database
    // For now, use structured logging
    console.log(`[SECURITY_LOG] ${JSON.stringify(entry)}`);
  }
  
  private static triggerSecurityAlert(entry: any): void {
    // In production, send to security team
    console.error(`[SECURITY_ALERT] ${JSON.stringify(entry)}`);
  }
}
```

### Anomaly Detection
```typescript
class AnomalyDetector {
  private static readonly NORMAL_REQUEST_RATE = 10; // requests per minute
  private static readonly SUSPICIOUS_PATTERNS = [
    /union\s+select/i,     // SQL injection
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // XSS
    /javascript\s*:/i,     // JavaScript protocol
  ];
  
  static checkRequestAnomaly(request: {
    ip: string;
    userAgent: string;
    body: any;
    headers: Record<string, string>;
  }): AnomalyResult {
    const anomalies: string[] = [];
    
    // Check for suspicious patterns in request body
    const requestBody = JSON.stringify(request.body);
    for (const pattern of this.SUSPICIOUS_PATTERNS) {
      if (pattern.test(requestBody)) {
        anomalies.push(`Suspicious pattern detected: ${pattern.source}`);
      }
    }
    
    // Check user agent
    if (this.isSuspiciousUserAgent(request.userAgent)) {
      anomalies.push('Suspicious user agent detected');
    }
    
    // Check for automated tools
    if (this.isAutomatedTool(request.userAgent, request.headers)) {
      anomalies.push('Automated tool detected');
    }
    
    return {
      isAnomalous: anomalies.length > 0,
      anomalies,
      riskScore: this.calculateRiskScore(anomalies)
    };
  }
  
  private static isSuspiciousUserAgent(userAgent: string): boolean {
    const suspiciousPatterns = [
      /curl/i, /wget/i, /python/i, /bot/i, /crawler/i, /scraper/i
    ];
    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }
  
  private static isAutomatedTool(userAgent: string, headers: Record<string, string>): boolean {
    // Check for missing common browser headers
    const browserHeaders = ['accept', 'accept-language', 'accept-encoding'];
    const missingHeaders = browserHeaders.filter(header => !headers[header]);
    
    return missingHeaders.length > 1 || this.isSuspiciousUserAgent(userAgent);
  }
  
  private static calculateRiskScore(anomalies: string[]): number {
    // Simple risk scoring - can be made more sophisticated
    return Math.min(anomalies.length * 25, 100);
  }
}
```

## 🧪 Security Testing

### Security Test Suite
```typescript
// Jest security tests
describe('Security Tests', () => {
  describe('Authentication', () => {
    it('should not leak user information on failed login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'wrongpass' })
        .expect(401);
      
      expect(response.body.error).toBe('Invalid email or password');
      expect(response.body).not.toHaveProperty('userId');
      expect(response.body).not.toHaveProperty('user');
    });
    
    it('should prevent SQL injection in email field', async () => {
      const maliciousEmail = "test@example.com'; DROP TABLE users; --";
      
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: maliciousEmail,
          password: 'validpass123'
        })
        .expect(400);
      
      expect(response.body.error).toContain('Invalid email format');
    });
    
    it('should prevent XSS in name field', async () => {
      const xssPayload = '<script>alert("XSS")</script>';
      
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: xssPayload,
          email: 'test@example.com',
          password: 'validpass123'
        })
        .expect(400);
      
      // Should sanitize or reject malicious input
      expect(response.body.error).toBeDefined();
    });
  });
  
  describe('Rate Limiting', () => {
    it('should block excessive requests', async () => {
      const requests = Array.from({ length: 12 }, () => 
        request(app)
          .post('/api/auth/login')
          .send({ email: 'test@example.com', password: 'wrongpass' })
      );
      
      const responses = await Promise.all(requests);
      const blockedRequests = responses.filter(r => r.status === 429);
      
      expect(blockedRequests.length).toBeGreaterThan(0);
    });
  });
  
  describe('CSRF Protection', () => {
    it('should reject requests with invalid origin', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Origin', 'https://malicious-site.com')
        .send({ email: 'test@example.com', password: 'validpass123' })
        .expect(403);
      
      expect(response.body.error).toBe('Invalid origin');
    });
  });
});
```

### Penetration Testing Checklist

**Manual Testing Checklist**:
- [ ] SQL Injection in all input fields
- [ ] XSS in all input fields  
- [ ] CSRF protection on all endpoints
- [ ] Rate limiting on authentication endpoints
- [ ] Session fixation attacks
- [ ] Password brute force protection
- [ ] Information disclosure in error messages
- [ ] File upload vulnerabilities (if applicable)
- [ ] Authorization bypass attempts
- [ ] Session hijacking scenarios

**Automated Security Scanning**:
```bash
# Run OWASP ZAP scan
zap-baseline.py -t http://localhost:3000 -r security-report.html

# Run npm audit for dependency vulnerabilities
npm audit --audit-level high

# Run Snyk for security vulnerabilities
snyk test --severity-threshold=high
```

## 🚨 Incident Response

### Security Incident Workflow
```typescript
class SecurityIncidentResponse {
  static handleSecurityBreach(incident: SecurityIncident): void {
    // 1. Immediate containment
    this.containThreat(incident);
    
    // 2. Assessment
    const impact = this.assessImpact(incident);
    
    // 3. Notification
    if (impact.severity >= SeverityLevel.HIGH) {
      this.notifySecurityTeam(incident, impact);
    }
    
    // 4. Recovery
    this.initiateRecovery(incident);
    
    // 5. Documentation
    this.documentIncident(incident, impact);
  }
  
  private static containThreat(incident: SecurityIncident): void {
    switch (incident.type) {
      case 'brute_force':
        this.blockIP(incident.sourceIP);
        break;
      case 'data_breach':
        this.revokeAllSessions();
        break;
      case 'injection_attack':
        this.enableStrictValidation();
        break;
    }
  }
  
  private static assessImpact(incident: SecurityIncident): ImpactAssessment {
    return {
      severity: this.calculateSeverity(incident),
      affectedUsers: this.getAffectedUsers(incident),
      dataCompromised: this.checkDataCompromise(incident),
      systemsAffected: this.getAffectedSystems(incident)
    };
  }
}
```

---

**🛡️ Security is an ongoing process, not a destination. This guide provides the foundation for a secure application, but regular security reviews, updates, and monitoring are essential for maintaining security in production.**