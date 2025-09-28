import { query, mutation, action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

// AI-powered issue analysis action
export const analyzeIssue = action({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string()
  },
  handler: async (ctx, args) => {
    // Simulate AI analysis - in production, integrate with OpenAI or similar
    const { title, description, category } = args;
    
    // Priority detection based on keywords
    const highPriorityKeywords = ["fire", "emergency", "urgent", "danger", "leak", "broken", "safety", "security"];
    const mediumPriorityKeywords = ["repair", "fix", "maintenance", "issue", "problem"];
    
    const text = `${title} ${description}`.toLowerCase();
    let priority = "low";
    
    if (highPriorityKeywords.some(keyword => text.includes(keyword))) {
      priority = "high";
    } else if (mediumPriorityKeywords.some(keyword => text.includes(keyword))) {
      priority = "medium";
    }

    // Generate AI summary
    const aiSummary = `Issue in ${category}: ${title.substring(0, 50)}${title.length > 50 ? '...' : ''}`;
    
    // Generate recommendations based on category
    const recommendations = {
      maintenance: ["Check plumbing system", "Inspect electrical connections", "Contact maintenance team"],
      safety: ["Immediate safety assessment required", "Evacuate if necessary", "Contact security"],
      food: ["Inspect kitchen hygiene", "Check food storage", "Review meal preparation"],
      cleaning: ["Schedule deep cleaning", "Check cleaning supplies", "Assign cleaning staff"],
      others: ["General inspection needed", "Assess situation", "Determine appropriate action"]
    };

    // Sentiment analysis (simplified)
    const negativeWords = ["terrible", "awful", "horrible", "disgusting", "unacceptable"];
    const sentimentScore = negativeWords.some(word => text.includes(word)) ? -0.8 : 0.2;

    return {
      priority: priority as "high" | "medium" | "low",
      aiSummary,
      aiRecommendations: recommendations[category as keyof typeof recommendations] || recommendations.others,
      sentimentScore
    };
  }
});

// Create a new issue
export const createIssue = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("maintenance"),
      v.literal("safety"),
      v.literal("food"),
      v.literal("cleaning"),
      v.literal("others")
    ),
    location: v.object({
      block: v.string(),
      floor: v.optional(v.string()),
      room: v.optional(v.string())
    }),
    isAnonymous: v.boolean(),
    reporterName: v.optional(v.string()),
    attachments: v.optional(v.array(v.id("_storage")))
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    
    // Simple AI analysis without calling action
    const text = `${args.title} ${args.description}`.toLowerCase();
    const highPriorityKeywords = ["fire", "emergency", "urgent", "danger", "leak", "broken", "safety", "security"];
    const mediumPriorityKeywords = ["repair", "fix", "maintenance", "issue", "problem"];
    
    let priority: "high" | "medium" | "low" = "low";
    if (highPriorityKeywords.some(keyword => text.includes(keyword))) {
      priority = "high";
    } else if (mediumPriorityKeywords.some(keyword => text.includes(keyword))) {
      priority = "medium";
    }

    const aiSummary = `Issue in ${args.category}: ${args.title.substring(0, 50)}${args.title.length > 50 ? '...' : ''}`;
    
    const recommendations = {
      maintenance: ["Check plumbing system", "Inspect electrical connections", "Contact maintenance team"],
      safety: ["Immediate safety assessment required", "Evacuate if necessary", "Contact security"],
      food: ["Inspect kitchen hygiene", "Check food storage", "Review meal preparation"],
      cleaning: ["Schedule deep cleaning", "Check cleaning supplies", "Assign cleaning staff"],
      others: ["General inspection needed", "Assess situation", "Determine appropriate action"]
    };

    const negativeWords = ["terrible", "awful", "horrible", "disgusting", "unacceptable"];
    const sentimentScore = negativeWords.some(word => text.includes(word)) ? -0.8 : 0.2;

    const issueId = await ctx.db.insert("issues", {
      title: args.title,
      description: args.description,
      category: args.category,
      priority,
      status: "open",
      location: args.location,
      reporterId: args.isAnonymous ? undefined : (userId || undefined),
      reporterName: args.isAnonymous ? args.reporterName : undefined,
      isAnonymous: args.isAnonymous,
      attachments: args.attachments,
      aiSummary,
      aiRecommendations: recommendations[args.category] || recommendations.others,
      sentimentScore,
      comments: []
    });

    // Schedule analytics update
    await ctx.scheduler.runAfter(0, internal.analytics.updateDailyAnalytics, {});

    return issueId;
  }
});

// Get all issues with filters
export const getIssues = query({
  args: {
    status: v.optional(v.union(v.literal("open"), v.literal("in_progress"), v.literal("resolved"))),
    category: v.optional(v.union(
      v.literal("maintenance"),
      v.literal("safety"),
      v.literal("food"),
      v.literal("cleaning"),
      v.literal("others")
    )),
    priority: v.optional(v.union(v.literal("high"), v.literal("medium"), v.literal("low"))),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    let issues;

    if (args.status) {
      issues = await ctx.db
        .query("issues")
        .withIndex("by_status", q => q.eq("status", args.status!))
        .order("desc")
        .take(args.limit || 50);
    } else if (args.category) {
      issues = await ctx.db
        .query("issues")
        .withIndex("by_category", q => q.eq("category", args.category!))
        .order("desc")
        .take(args.limit || 50);
    } else if (args.priority) {
      issues = await ctx.db
        .query("issues")
        .withIndex("by_priority", q => q.eq("priority", args.priority!))
        .order("desc")
        .take(args.limit || 50);
    } else {
      issues = await ctx.db
        .query("issues")
        .order("desc")
        .take(args.limit || 50);
    }

    return issues;
  }
});

// Get user's issues
export const getUserIssues = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("issues")
      .withIndex("by_reporter", q => q.eq("reporterId", userId))
      .order("desc")
      .collect();
  }
});

// Update issue status
export const updateIssueStatus = mutation({
  args: {
    issueId: v.id("issues"),
    status: v.union(v.literal("open"), v.literal("in_progress"), v.literal("resolved")),
    resolutionNotes: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const updates: any = {
      status: args.status
    };

    if (args.status === "resolved") {
      updates.resolvedAt = Date.now();
      if (args.resolutionNotes) {
        updates.resolutionNotes = args.resolutionNotes;
      }
    }

    await ctx.db.patch(args.issueId, updates);

    // Update analytics
    await ctx.scheduler.runAfter(0, internal.analytics.updateDailyAnalytics, {});
  }
});

// Add comment to issue
export const addComment = mutation({
  args: {
    issueId: v.id("issues"),
    content: v.string()
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const issue = await ctx.db.get(args.issueId);
    if (!issue) throw new Error("Issue not found");

    const newComment = {
      authorId: userId,
      authorName: user.name || user.email || "Unknown",
      content: args.content,
      timestamp: Date.now()
    };

    const updatedComments = [...(issue.comments || []), newComment];

    await ctx.db.patch(args.issueId, {
      comments: updatedComments
    });
  }
});

// Search issues
export const searchIssues = query({
  args: {
    searchTerm: v.string(),
    category: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    let searchQuery = ctx.db
      .query("issues")
      .withSearchIndex("search_issues", q => q.search("description", args.searchTerm));

    if (args.category) {
      searchQuery = searchQuery.filter(q => q.eq(q.field("category"), args.category));
    }
    if (args.status) {
      searchQuery = searchQuery.filter(q => q.eq(q.field("status"), args.status));
    }
    if (args.priority) {
      searchQuery = searchQuery.filter(q => q.eq(q.field("priority"), args.priority));
    }

    return await searchQuery.take(20);
  }
});

// Get issue by ID
export const getIssueById = query({
  args: { issueId: v.id("issues") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.issueId);
  }
});
