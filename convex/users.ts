import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get or create user profile
export const getUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", q => q.eq("userId", userId))
      .first();

    return {
      user,
      profile
    };
  }
});

// Create or update user profile
export const updateUserProfile = mutation({
  args: {
    role: v.union(v.literal("hosteler"), v.literal("authority"), v.literal("admin")),
    name: v.string(),
    hostelBlock: v.optional(v.string()),
    roomNumber: v.optional(v.string()),
    department: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", q => q.eq("userId", userId))
      .first();

    const profileData = {
      userId,
      role: args.role,
      name: args.name,
      email: user.email || "",
      hostelBlock: args.hostelBlock,
      roomNumber: args.roomNumber,
      department: args.department,
      isActive: true
    };

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, profileData);
      return existingProfile._id;
    } else {
      return await ctx.db.insert("userProfiles", profileData);
    }
  }
});

// Get all authority users
export const getAuthorityUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("userProfiles")
      .withIndex("by_role", q => q.eq("role", "authority"))
      .collect();
  }
});
