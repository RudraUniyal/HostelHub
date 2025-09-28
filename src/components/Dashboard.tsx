import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { IssueCard } from "./IssueCard";
import { AnalyticsCards } from "./AnalyticsCards";
import { TrendChart } from "./TrendChart";
import { useState } from "react";

interface DashboardProps {
  userProfile: any;
}

export function Dashboard({ userProfile }: DashboardProps) {
  const [filter, setFilter] = useState({
    status: undefined as string | undefined,
    category: undefined as string | undefined,
    priority: undefined as string | undefined
  });

  const analytics = useQuery(api.analytics.getDashboardAnalytics);
  const issues = useQuery(api.issues.getIssues, {
    status: filter.status as any,
    category: filter.category as any,
    priority: filter.priority as any,
    limit: 20
  });
  const userIssues = useQuery(api.issues.getUserIssues);
  const trendData = useQuery(api.analytics.getTrendData, { days: 7 });

  const isAuthority = userProfile?.profile?.role === "authority" || userProfile?.profile?.role === "admin";

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gradient mb-2">
          Welcome back, {userProfile?.profile?.name || "User"}!
        </h1>
        <p className="text-gray-300 text-lg">
          {isAuthority ? "Manage and resolve hostel issues" : "Track your reported issues"}
        </p>
      </div>

      {/* Analytics Cards */}
      {analytics && <AnalyticsCards analytics={analytics} isAuthority={isAuthority} />}

      {/* Trend Chart for Authorities */}
      {isAuthority && trendData && (
        <div className="dark-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Issue Trends (Last 7 Days)</h3>
          <TrendChart data={trendData} />
        </div>
      )}

      {/* Filters for Authorities */}
      {isAuthority && (
        <div className="dark-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Filter Issues</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filter.status || ""}
              onChange={(e) => setFilter({ ...filter, status: e.target.value || undefined })}
              className="dark-input"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={filter.category || ""}
              onChange={(e) => setFilter({ ...filter, category: e.target.value || undefined })}
              className="dark-input"
            >
              <option value="">All Categories</option>
              <option value="maintenance">Maintenance</option>
              <option value="safety">Safety</option>
              <option value="food">Food</option>
              <option value="cleaning">Cleaning</option>
              <option value="others">Others</option>
            </select>

            <select
              value={filter.priority || ""}
              onChange={(e) => setFilter({ ...filter, priority: e.target.value || undefined })}
              className="dark-input"
            >
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      )}

      {/* Issues List */}
      <div className="dark-card p-6">
        <h3 className="text-xl font-semibold text-white mb-6">
          {isAuthority ? "All Issues" : "Your Issues"}
        </h3>
        
        <div className="space-y-4">
          {(isAuthority ? issues : userIssues)?.map((issue) => (
            <IssueCard key={issue._id} issue={issue} isAuthority={isAuthority} />
          ))}
          
          {(isAuthority ? issues : userIssues)?.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--color-bg-tertiary)' }}>
                <span className="text-2xl">📋</span>
              </div>
              <p className="text-gray-400 text-lg">
                {isAuthority ? "No issues found" : "You haven't reported any issues yet"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
