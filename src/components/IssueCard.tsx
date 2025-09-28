import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { IssueModal } from "./IssueModal";

interface IssueCardProps {
  issue: any;
  isAuthority: boolean;
}

export function IssueCard({ issue, isAuthority }: IssueCardProps) {
  const [showModal, setShowModal] = useState(false);
  const updateStatus = useMutation(api.issues.updateIssueStatus);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-900/30 text-red-300 border-red-500/50";
      case "medium": return "bg-yellow-900/30 text-yellow-300 border-yellow-500/50";
      case "low": return "bg-green-900/30 text-green-300 border-green-500/50";
      default: return "bg-gray-800/30 text-gray-300 border-gray-500/50";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-900/30 text-blue-300 border-blue-500/50";
      case "in_progress": return "bg-orange-900/30 text-orange-300 border-orange-500/50";
      case "resolved": return "bg-green-900/30 text-green-300 border-green-500/50";
      default: return "bg-gray-800/30 text-gray-300 border-gray-500/50";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "maintenance": return "🔧";
      case "safety": return "🛡️";
      case "food": return "🍽️";
      case "cleaning": return "🧹";
      default: return "📋";
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatus({
        issueId: issue._id,
        status: newStatus as any
      });
      toast.success(`Issue marked as ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <>
      <div 
        className="dark-card p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
        onClick={() => setShowModal(true)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getCategoryIcon(issue.category)}</span>
            <div>
              <h4 className="font-semibold text-white group-hover:text-purple-300 transition-colors duration-200">
                {issue.title}
              </h4>
              <p className="text-sm text-gray-300">
                {issue.location.block} {issue.location.floor && `- Floor ${issue.location.floor}`} {issue.location.room && `- Room ${issue.location.room}`}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(issue.priority)}`}>
              {issue.priority.toUpperCase()}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue.status)}`}>
              {issue.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        <p className="text-gray-300 mb-4 line-clamp-2">
          {issue.description}
        </p>

        {issue.aiSummary && (
          <div className="rounded-lg p-3 mb-4" style={{ background: 'rgba(138, 43, 226, 0.1)', border: '1px solid rgba(138, 43, 226, 0.3)' }}>
            <p className="text-sm text-purple-300">
              <span className="font-medium">AI Summary:</span> {issue.aiSummary}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>
              {new Date(issue._creationTime).toLocaleDateString()}
            </span>
            {issue.sentimentScore !== undefined && (
              <span className={`px-2 py-1 rounded ${issue.sentimentScore < 0 ? 'bg-red-900/30 text-red-300' : 'bg-green-900/30 text-green-300'}`}>
                {issue.sentimentScore < 0 ? '😟' : '😊'}
              </span>
            )}
          </div>

          {isAuthority && issue.status !== "resolved" && (
            <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
              {issue.status === "open" && (
                <button
                  onClick={() => handleStatusChange("in_progress")}
                  className="px-3 py-1 text-white text-xs rounded-lg transition-colors duration-200"
                  style={{ background: 'var(--gradient-secondary)' }}
                >
                  Start Progress
                </button>
              )}
              {issue.status === "in_progress" && (
                <button
                  onClick={() => handleStatusChange("resolved")}
                  className="px-3 py-1 text-white text-xs rounded-lg transition-colors duration-200"
                  style={{ background: 'linear-gradient(45deg, #4CAF50, #2E7D32)' }}
                >
                  Mark Resolved
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <IssueModal
          issue={issue}
          isAuthority={isAuthority}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
