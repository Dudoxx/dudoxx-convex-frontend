import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

// Check if user exists by email
export const checkUserExists = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    return user ? 1 : 0;
  },
});

// Create a new user
export const createUser = internalMutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(), // In production, this should be hashed
  },
  handler: async (ctx, args) => {
    // Create the user
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      emailVerificationTime: undefined,
    });

    // Create default profile
    await ctx.db.insert("profiles", {
      userId: userId,
      displayName: args.name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Log the registration
    await ctx.db.insert("authLogs", {
      action: "user_registration",
      userId: userId,
      email: args.email,
      success: true,
      timestamp: Date.now(),
    });

    return userId;
  },
});

// Authenticate user by email and password
export const authenticateUser = internalQuery({
  args: {
    email: v.string(),
    password: v.string(), // In production, verify against hashed password
  },
  handler: async (ctx, args) => {
    // For demo purposes, accept any password
    // In production, verify against hashed password
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    return user || null;
  },
});

// Log authentication events
export const logAuthEvent = internalMutation({
  args: {
    action: v.string(),
    userId: v.optional(v.id("users")),
    email: v.optional(v.string()),
    success: v.boolean(),
    error: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("authLogs", {
      action: args.action,
      userId: args.userId,
      email: args.email,
      success: args.success,
      error: args.error,
      metadata: args.metadata,
      timestamp: Date.now(),
    });
  },
});