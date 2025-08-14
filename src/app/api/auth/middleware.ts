// Security middleware for API routes
export function validateRequest(body: any) {
  // Basic input sanitization
  if (typeof body !== 'object' || body === null) {
    return { isValid: false, error: 'Invalid request format' };
  }

  // Remove any potentially dangerous fields
  const sanitized = { ...body };
  delete sanitized.__proto__;
  delete sanitized.constructor;
  delete sanitized.prototype;

  return { isValid: true, data: sanitized };
}

export function rateLimit() {
  // In production, implement proper rate limiting
  // For now, just return success
  return { allowed: true };
}

export function logSecurityEvent(event: string, details: any) {
  // In production, log to proper security monitoring
  console.log(`[SECURITY] ${event}:`, details);
}

export function validateOrigin(request: Request) {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  
  // In development, allow localhost on any port
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  if (isDevelopment) {
    // Allow any localhost port in development
    if (origin && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'))) {
      return true;
    }
    if (referer && (referer.startsWith('http://localhost:') || referer.startsWith('http://127.0.0.1:'))) {
      return true;
    }
  } else {
    // In production, validate against specific allowed origins
    const allowedOrigins = [process.env.NEXT_PUBLIC_APP_URL, 'http://localhost:3000'];
    
    if (origin && allowedOrigins.includes(origin)) {
      return true;
    }
    
    if (referer && allowedOrigins.some(allowed => referer.startsWith(allowed || ''))) {
      return true;
    }
  }
  
  // Allow same-origin requests (no origin header)
  return !origin;
}