import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  issues: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("maintenance"),
      v.literal("safety"),
      v.literal("food"),
      v.literal("cleaning"),
      v.literal("others")
    ),
    priority: v.union(
      v.literal("high"),
      v.literal("medium"),
      v.literal("low")
    ),
    status: v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("resolved")
    ),
    location: v.object({
      block: v.string(),
      floor: v.optional(v.string()),
      room: v.optional(v.string())
    }),
    reporterId: v.optional(v.id("users")),
    reporterName: v.optional(v.string()),
    isAnonymous: v.boolean(),
    assignedTo: v.optional(v.id("users")),
    attachments: v.optional(v.array(v.id("_storage"))),
    aiSummary: v.optional(v.string()),
    aiRecommendations: v.optional(v.array(v.string())),
    sentimentScore: v.optional(v.number()),
    comments: v.optional(v.array(v.object({
      authorId: v.id("users"),
      authorName: v.string(),
      content: v.string(),
      timestamp: v.number()
    }))),
    resolvedAt: v.optional(v.number()),
    resolutionNotes: v.optional(v.string())
  })
    .index("by_status", ["status"])
    .index("by_category", ["category"])
    .index("by_priority", ["priority"])
    .index("by_reporter", ["reporterId"])
    .searchIndex("search_issues", {
      searchField: "description",
      filterFields: ["category", "status", "priority"]
    }),

  userProfiles: defineTable({
    userId: v.id("users"),
    role: v.union(
      v.literal("hosteler"),
      v.literal("authority"),
      v.literal("admin")
    ),
    name: v.string(),
    email: v.string(),
    hostelBlock: v.optional(v.string()),
    roomNumber: v.optional(v.string()),
    department: v.optional(v.string()),
    isActive: v.boolean()
  })
    .index("by_user_id", ["userId"])
    .index("by_role", ["role"])
    .index("by_email", ["email"]),

  analytics: defineTable({
    date: v.string(), // YYYY-MM-DD format
    totalIssues: v.number(),
    resolvedIssues: v.number(),
    avgResolutionTime: v.number(), // in hours
    categoryBreakdown: v.object({
      maintenance: v.number(),
      safety: v.number(),
      food: v.number(),
      cleaning: v.number(),
      others: v.number()
    }),
    priorityBreakdown: v.object({
      high: v.number(),
      medium: v.number(),
      low: v.number()
    }),
    locationHotspots: v.array(v.object({
      block: v.string(),
      count: v.number()
    }))
  })
    .index("by_date", ["date"])
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
