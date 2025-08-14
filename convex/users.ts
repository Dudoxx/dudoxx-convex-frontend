import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user by ID (for demo purposes)
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    const profile = await (ctx.db as any)
      .query("profiles")
      .filter((q: any) => q.eq(q.field("userId"), args.userId))
      .first();

    return {
      ...user,
      profile,
    };
  },
});

// Get current user with profile (simplified)
export const getCurrentUser = query({
  handler: async (ctx) => {
    // For demo, return null - we'll use localStorage to track sessions
    return null;
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    displayName: v.optional(v.string()),
    bio: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...profileData } = args;
    
    const profile = await (ctx.db as any)
      .query("profiles")
      .filter((q: any) => q.eq(q.field("userId"), userId))
      .first();

    if (!profile) {
      // Create profile if it doesn't exist
      await ctx.db.insert("profiles", {
        userId: userId,
        ...profileData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } else {
      // Update existing profile
      await ctx.db.patch(profile._id, {
        ...profileData,
        updatedAt: Date.now(),
      });
    }

    // Log the update
    await ctx.db.insert("authLogs", {
      action: "profile_updated",
      userId: userId,
      success: true,
      metadata: profileData,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

// Get auth logs by user ID
export const getMyAuthLogs = query({
  handler: async (ctx) => {
    // For demo, return empty array
    return [];
  },
});