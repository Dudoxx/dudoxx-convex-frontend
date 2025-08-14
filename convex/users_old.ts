import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

// Get current user with profile
export const getCurrentUser = query({
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;
    
    const user = await ctx.db.get(userId);
    if (!user) return null;

    const profile = await (ctx.db as any)
      .query("profiles")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .first();

    return {
      ...user,
      profile,
    };
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    displayName: v.optional(v.string()),
    bio: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const profile = await (ctx.db as any)
      .query("profiles")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .first();

    if (!profile) {
      // Create profile if it doesn't exist
      await ctx.db.insert("profiles", {
        userId: user._id,
        ...args,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } else {
      // Update existing profile
      await ctx.db.patch(profile._id, {
        ...args,
        updatedAt: Date.now(),
      });
    }

    // Log the update
    await ctx.db.insert("authLogs", {
      action: "profile_updated",
      userId: userId,
      email: user.email,
      success: true,
      metadata: args,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

// Get user by ID (for admin or public profiles)
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    const profile = await (ctx.db as any)
      .query("profiles")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .first();

    // Only return public information
    return {
      _id: user._id,
      name: user.name,
      profile: profile ? {
        displayName: profile.displayName,
        bio: profile.bio,
        city: profile.city,
        country: profile.country,
      } : null,
    };
  },
});

// Delete user account (with confirmation)
export const deleteAccount = mutation({
  args: {
    confirmation: v.string(), // User must type "DELETE" to confirm
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    if (args.confirmation !== "DELETE") {
      throw new Error("Invalid confirmation");
    }

    // Delete profile
    const profile = await (ctx.db as any)
      .query("profiles")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .first();
    
    if (profile) {
      await ctx.db.delete(profile._id);
    }

    // Log the deletion
    await ctx.db.insert("authLogs", {
      action: "account_deleted",
      userId: userId,
      email: user.email,
      success: true,
      timestamp: Date.now(),
    });

    // Note: The actual user deletion should be handled by the auth system
    // This is just for cleaning up related data

    return { success: true };
  },
});

// Get auth logs for current user
export const getMyAuthLogs = query({
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const logs = await (ctx.db as any)
      .query("authLogs")
      .withIndex("by_user", (q: any) => q.eq("userId", userId))
      .order("desc")
      .take(50);

    return logs;
  },
});