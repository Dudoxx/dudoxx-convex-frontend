import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Simple users table for demo
  users: defineTable({
    name: v.string(),
    email: v.string(),
    emailVerificationTime: v.optional(v.number()),
  }).index("by_email", ["email"]),
  
  // User profile extension
  profiles: defineTable({
    userId: v.id("users"),
    displayName: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),
  
  // Auth logs for tracking
  authLogs: defineTable({
    action: v.string(),
    userId: v.optional(v.id("users")),
    email: v.optional(v.string()),
    success: v.boolean(),
    error: v.optional(v.string()),
    metadata: v.optional(v.any()),
    timestamp: v.number(),
  }).index("by_action", ["action"])
    .index("by_user", ["userId"]),
});