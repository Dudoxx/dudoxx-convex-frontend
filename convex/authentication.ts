import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Simple login mutation
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // For now, let's create a simple mock authentication
    // In production, you would verify the password against a hash
    
    // Try to find user by email
    const user = await (ctx.db as any)
      .query("users")
      .filter((q: any) => q.eq(q.field("email"), args.email))
      .first();

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // For demo purposes, accept any password
    // In production, you would check bcrypt.compare(args.password, user.passwordHash)
    
    // Log the auth event
    await ctx.db.insert("authLogs", {
      action: "user_login",
      userId: user._id,
      email: user.email,
      success: true,
      timestamp: Date.now(),
    });

    return { success: true, userId: user._id };
  },
});

// Simple register mutation  
export const register = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await (ctx.db as any)
      .query("users")
      .filter((q: any) => q.eq(q.field("email"), args.email))
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // In production, you would hash the password: bcrypt.hash(args.password, 10)
    // For demo purposes, we'll store a mock hash
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      emailVerificationTime: Date.now(), // Mark as verified for demo
    });

    // Create profile
    await ctx.db.insert("profiles", {
      userId: userId,
      displayName: args.name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Log the auth event
    await ctx.db.insert("authLogs", {
      action: "user_registered",
      userId: userId,
      email: args.email,
      success: true,
      timestamp: Date.now(),
    });

    return { success: true, userId };
  },
});

// Get current session (mock)
export const getCurrentSession = query({
  handler: async (ctx) => {
    // For demo purposes, we'll simulate a session
    // In production, you would check JWT tokens or session cookies
    return null; // No session for now
  },
});

// Simple logout
export const logout = mutation({
  handler: async (ctx) => {
    // For demo purposes, just return success
    // In production, you would invalidate the session token
    return { success: true };
  },
});