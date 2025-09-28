import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface IssueModalProps {
  issue: any;
  isAuthority: boolean;
  onClose: () => void;
}

export function IssueModal({ issue, isAuthority, onClose }: IssueModalProps) {
  const [comment, setComment] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addComment = useMutation(api.issues.addComment);
  const updateStatus = useMutation(api.issues.updateIssueStatus);

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment({
        issueId: issue._id,
        content: comment.trim()
      });
      setComment("");
      toast.success("Comment added");
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolve = async () => {
    setIsSubmitting(true);
    try {
      await updateStatus({
        issueId: issue._id,
        status: "resolved",
        resolutionNotes: resolutionNotes.trim() || undefined
      });
      toast.success("Issue resolved");
      onClose();
    } catch (error) {
      toast.error("Failed to resolve issue");
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="dark-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{getCategoryIcon(issue.category)}</span>
              <div>
                <h2 className="text-2xl font-bold text-white">{issue.title}</h2>
                <p className="text-gray-300">
                  {issue.location.block} {issue.location.floor && `- Floor ${issue.location.floor}`} {issue.location.room && `- Room ${issue.location.room}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl transition-colors duration-200"
            >
              ×
            </button>
          </div>

          {/* Status and Priority */}
          <div className="flex space-x-4 mb-6">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              issue.priority === "high" ? "bg-red-900/30 text-red-300 border border-red-500/50" :
              issue.priority === "medium" ? "bg-yellow-900/30 text-yellow-300 border border-yellow-500/50" :
              "bg-green-900/30 text-green-300 border border-green-500/50"
            }`}>
              {issue.priority.toUpperCase()} Priority
            </span>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              issue.status === "open" ? "bg-blue-900/30 text-blue-300 border border-blue-500/50" :
              issue.status === "in_progress" ? "bg-orange-900/30 text-orange-300 border border-orange-500/50" :
              "bg-green-900/30 text-green-300 border border-green-500/50"
            }`}>
              {issue.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-white mb-2">Description</h3>
            <p className="text-gray-300 rounded-lg p-4" style={{ background: 'var(--color-bg-tertiary)' }}>
              {issue.description}
            </p>
          </div>

          {/* AI Analysis */}
          {issue.aiSummary && (
            <div className="mb-6">
              <h3 className="font-semibold text-white mb-2">AI Analysis</h3>
              <div className="rounded-lg p-4" style={{ background: 'rgba(138, 43, 226, 0.1)', border: '1px solid rgba(138, 43, 226, 0.3)' }}>
                <p className="text-purple-300 mb-3">{issue.aiSummary}</p>
                {issue.aiRecommendations && issue.aiRecommendations.length > 0 && (
                  <div>
                    <p className="font-medium text-purple-200 mb-2">Recommendations:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {issue.aiRecommendations.map((rec: string, index: number) => (
                        <li key={index} className="text-purple-300 text-sm">{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="mb-6">
            <h3 className="font-semibold text-white mb-4">Comments</h3>
            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
              {issue.comments?.map((comment: any, index: number) => (
                <div key={index} className="rounded-lg p-3" style={{ background: 'var(--color-bg-tertiary)' }}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-white">{comment.authorName}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-300">{comment.content}</p>
                </div>
              ))}
              {(!issue.comments || issue.comments.length === 0) && (
                <p className="text-gray-400 text-center py-4">No comments yet</p>
              )}
            </div>

            {/* Add Comment */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="dark-input flex-1 px-4 py-2 rounded-lg"
                onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                disabled={isSubmitting || !comment.trim()}
                className="px-4 py-2 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
                style={{ background: 'var(--gradient-secondary)' }}
              >
                Add
              </button>
            </div>
          </div>

          {/* Resolution for Authorities */}
          {isAuthority && issue.status !== "resolved" && (
            <div className="border-t pt-6" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="font-semibold text-white mb-4">Resolve Issue</h3>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Add resolution notes (optional)..."
                className="dark-input w-full px-4 py-3 rounded-lg mb-4"
                rows={3}
              />
              <button
                onClick={handleResolve}
                disabled={isSubmitting}
                className="w-full py-3 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50"
                style={{ background: 'linear-gradient(45deg, #4CAF50, #2E7D32)' }}
              >
                {isSubmitting ? "Resolving..." : "Mark as Resolved"}
              </button>
            </div>
          )}

          {/* Resolution Notes (if resolved) */}
          {issue.status === "resolved" && issue.resolutionNotes && (
            <div className="border-t pt-6" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="font-semibold text-white mb-2">Resolution Notes</h3>
              <p className="text-gray-300 rounded-lg p-4" style={{ background: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
                {issue.resolutionNotes}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Resolved on {new Date(issue.resolvedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
