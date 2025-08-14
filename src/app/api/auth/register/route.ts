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
    const { name, email, password } = body;
    
    // Server-side validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, password' },
        { status: 400 }
      );
    }
    
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
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
      
      // Check if user already exists
      const existingUser = await MockAuthStore.findUserByEmail(email.toLowerCase().trim());
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }
      
      // Create new user
      const newUser = await MockAuthStore.createUser({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password, // In production, hash this before storing
      });
      
      console.log('User registered successfully:', { email: newUser.email, id: newUser.id });
      
      // Return success response (don't expose internal IDs directly)
      return NextResponse.json({
        success: true,
        message: 'Account created successfully',
        // Create session token or similar instead of exposing userId
        sessionId: newUser.id, // In production, create JWT token here
      }, { status: 201 });
      
    } catch (mockError) {
      console.error('Mock store error:', mockError);
      return NextResponse.json(
        { error: 'Registration service temporarily unavailable' },
        { status: 503 }
      );
    }
    
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}