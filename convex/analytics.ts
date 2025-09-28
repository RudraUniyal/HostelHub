import { query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Get dashboard analytics
export const getDashboardAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split('T')[0];
    const issues = await ctx.db.query("issues").collect();
    
    // Calculate metrics
    const totalIssues = issues.length;
    const openIssues = issues.filter(i => i.status === "open").length;
    const inProgressIssues = issues.filter(i => i.status === "in_progress").length;
    const resolvedIssues = issues.filter(i => i.status === "resolved").length;
    
    // Category breakdown
    const categoryBreakdown = {
      maintenance: issues.filter(i => i.category === "maintenance").length,
      safety: issues.filter(i => i.category === "safety").length,
      food: issues.filter(i => i.category === "food").length,
      cleaning: issues.filter(i => i.category === "cleaning").length,
      others: issues.filter(i => i.category === "others").length
    };
    
    // Priority breakdown
    const priorityBreakdown = {
      high: issues.filter(i => i.priority === "high").length,
      medium: issues.filter(i => i.priority === "medium").length,
      low: issues.filter(i => i.priority === "low").length
    };
    
    // Location hotspots
    const locationMap = new Map<string, number>();
    issues.forEach(issue => {
      const block = issue.location.block;
      locationMap.set(block, (locationMap.get(block) || 0) + 1);
    });
    
    const locationHotspots = Array.from(locationMap.entries())
      .map(([block, count]) => ({ block, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Average resolution time
    const resolvedWithTime = issues.filter(i => i.status === "resolved" && i.resolvedAt);
    const avgResolutionTime = resolvedWithTime.length > 0
      ? resolvedWithTime.reduce((sum, issue) => {
          const resolutionTime = (issue.resolvedAt! - issue._creationTime) / (1000 * 60 * 60); // hours
          return sum + resolutionTime;
        }, 0) / resolvedWithTime.length
      : 0;
    
    // Recent issues (last 7 days)
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentIssues = issues.filter(i => i._creationTime > sevenDaysAgo);
    
    return {
      totalIssues,
      openIssues,
      inProgressIssues,
      resolvedIssues,
      categoryBreakdown,
      priorityBreakdown,
      locationHotspots,
      avgResolutionTime: Math.round(avgResolutionTime * 100) / 100,
      recentIssuesCount: recentIssues.length,
      resolutionRate: totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0
    };
  }
});

// Get trend data for charts
export const getTrendData = query({
  args: {
    days: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const days = args.days || 30;
    const issues = await ctx.db.query("issues").collect();
    
    // Group issues by date
    const dateMap = new Map<string, { created: number; resolved: number }>();
    
    // Initialize last N days
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dateMap.set(dateStr, { created: 0, resolved: 0 });
    }
    
    // Count created issues
    issues.forEach(issue => {
      const createdDate = new Date(issue._creationTime).toISOString().split('T')[0];
      if (dateMap.has(createdDate)) {
        const data = dateMap.get(createdDate)!;
        data.created++;
      }
      
      // Count resolved issues
      if (issue.resolvedAt) {
        const resolvedDate = new Date(issue.resolvedAt).toISOString().split('T')[0];
        if (dateMap.has(resolvedDate)) {
          const data = dateMap.get(resolvedDate)!;
          data.resolved++;
        }
      }
    });
    
    return Array.from(dateMap.entries()).map(([date, data]) => ({
      date,
      created: data.created,
      resolved: data.resolved
    }));
  }
});

// Internal function to update daily analytics
export const updateDailyAnalytics = internalMutation({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split('T')[0];
    const issues = await ctx.db.query("issues").collect();
    
    // Calculate today's metrics
    const totalIssues = issues.length;
    const resolvedIssues = issues.filter(i => i.status === "resolved").length;
    
    const categoryBreakdown = {
      maintenance: issues.filter(i => i.category === "maintenance").length,
      safety: issues.filter(i => i.category === "safety").length,
      food: issues.filter(i => i.category === "food").length,
      cleaning: issues.filter(i => i.category === "cleaning").length,
      others: issues.filter(i => i.category === "others").length
    };
    
    const priorityBreakdown = {
      high: issues.filter(i => i.priority === "high").length,
      medium: issues.filter(i => i.priority === "medium").length,
      low: issues.filter(i => i.priority === "low").length
    };
    
    const locationMap = new Map<string, number>();
    issues.forEach(issue => {
      const block = issue.location.block;
      locationMap.set(block, (locationMap.get(block) || 0) + 1);
    });
    
    const locationHotspots = Array.from(locationMap.entries())
      .map(([block, count]) => ({ block, count }))
      .sort((a, b) => b.count - a.count);
    
    const resolvedWithTime = issues.filter(i => i.status === "resolved" && i.resolvedAt);
    const avgResolutionTime = resolvedWithTime.length > 0
      ? resolvedWithTime.reduce((sum, issue) => {
          const resolutionTime = (issue.resolvedAt! - issue._creationTime) / (1000 * 60 * 60);
          return sum + resolutionTime;
        }, 0) / resolvedWithTime.length
      : 0;
    
    // Check if today's analytics already exist
    const existingAnalytics = await ctx.db
      .query("analytics")
      .withIndex("by_date", q => q.eq("date", today))
      .first();
    
    const analyticsData = {
      date: today,
      totalIssues,
      resolvedIssues,
      avgResolutionTime,
      categoryBreakdown,
      priorityBreakdown,
      locationHotspots
    };
    
    if (existingAnalytics) {
      await ctx.db.patch(existingAnalytics._id, analyticsData);
    } else {
      await ctx.db.insert("analytics", analyticsData);
    }
  }
});
