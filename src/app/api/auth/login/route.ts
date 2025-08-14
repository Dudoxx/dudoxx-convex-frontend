import { NextRequest, NextResponse } from 'next/server';
import { validateRequest, rateLimit, logSecurityEvent, validateOrigin } from '../middleware';

const CONVEX_BASE_URL = process.env.CONVEX_URL || 'http://127.0.0.1:3210';

export async function POST(request: NextRequest) {
  try {
    // Security validations
    if (!validateOrigin(request)) {
      logSecurityEvent('INVALID_ORIGIN', { 
        origin: request.headers.get('origin'),
        referer: request.headers.get('referer')
      });
      return NextResponse.json(
        { error: 'Invalid origin' },
        { status: 403 }
      );
    }

    if (!rateLimit().allowed) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', { ip: request.ip });
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const rawBody = await request.json();
    const validation = validateRequest(rawBody);
    
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }
    
    const body = validation.data;
    const { email, password } = body;
    
    // Server-side validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Use mock store until Convex backend is fixed
    try {
      const { MockAuthStore } = await import('../mock-store');
      
      // Authenticate user
      const user = await MockAuthStore.authenticateUser(
        email.toLowerCase().trim(),
        password
      );
      
      if (!user) {
        console.log(`Failed login attempt for email: ${email.substring(0, 3)}***`);
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }
      
      console.log('User logged in successfully:', { email: user.email, id: user.id });
      
      // Return success response with session info
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        sessionId: user.id, // In production, create JWT token here
        user: {
          name: user.name,
          email: user.email,
        },
      }, { status: 200 });
      
    } catch (mockError) {
      console.error('Mock store error:', mockError);
      return NextResponse.json(
        { error: 'Authentication service temporarily unavailable' },
        { status: 503 }
      );
    }
    
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}