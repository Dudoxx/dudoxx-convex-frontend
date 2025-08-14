import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

// HTTP-based user registration
export const register = httpAction(async (ctx, request) => {
  const { name, email, password } = await request.json();
  
  if (!name || !email || !password) {
    return new Response(
      JSON.stringify({ error: "Missing required fields" }),
      { 
        status: 400, 
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  try {
    // Check if user already exists (direct database call)
    const existingUsers = await ctx.runQuery(api.internal.checkUserExists, { email });
    
    if (existingUsers > 0) {
      return new Response(
        JSON.stringify({ error: "User with this email already exists" }),
        { 
          status: 409, 
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Create user (using internal mutation)
    const userId = await ctx.runMutation(api.internal.createUser, {
      name,
      email,
      password, // In production, hash this on the server
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        userId,
        message: "User created successfully" 
      }),
      { 
        status: 201, 
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" }
      }
    );
  }
});

// HTTP-based user login
export const login = httpAction(async (ctx, request) => {
  const { email, password } = await request.json();
  
  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "Email and password are required" }),
      { 
        status: 400, 
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  try {
    // Authenticate user (using internal query)
    const user = await ctx.runQuery(api.internal.authenticateUser, {
      email,
      password, // In production, verify against hashed password
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { 
          status: 401, 
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Log the login attempt
    await ctx.runMutation(api.internal.logAuthEvent, {
      action: "user_login",
      userId: user._id,
      email: user.email,
      success: true,
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        userId: user._id,
        user: {
          name: user.name,
          email: user.email,
        },
        message: "Login successful" 
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" }
      }
    );
  }
});