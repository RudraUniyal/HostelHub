import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function IssueReportForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "maintenance" as "maintenance" | "safety" | "food" | "cleaning" | "others",
    location: {
      block: "",
      floor: "",
      room: ""
    },
    isAnonymous: false,
    reporterName: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createIssue = useMutation(api.issues.createIssue);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.block.trim() || !formData.location.floor.trim() || !formData.location.room.trim()) {
      toast.error("Please fill in all required fields including complete location details");
      return;
    }

    if (formData.isAnonymous && !formData.reporterName.trim()) {
      toast.error("Please provide a name for anonymous reporting");
      return;
    }

    setIsSubmitting(true);
    try {
      const issueId = await createIssue({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        location: {
          block: formData.location.block.trim(),
          floor: formData.location.floor.trim() || undefined,
          room: formData.location.room.trim() || undefined
        },
        isAnonymous: formData.isAnonymous,
        reporterName: formData.isAnonymous ? formData.reporterName.trim() : undefined
      });

      toast.success("Issue reported successfully! Our AI has analyzed and prioritized your report.");
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "maintenance",
        location: { block: "", floor: "", room: "" },
        isAnonymous: false,
        reporterName: ""
      });
    } catch (error) {
      toast.error("Failed to report issue");
      console.error(error);
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
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-4">
          Report an Issue
        </h2>
        <p className="text-gray-300">
          Our AI will analyze and prioritize your report for faster resolution
        </p>
      </div>

      <div className="dark-card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Issue Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="dark-input w-full px-4 py-3 rounded-xl"
              placeholder="Brief description of the issue"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { value: "maintenance", label: "Maintenance" },
                { value: "safety", label: "Safety" },
                { value: "food", label: "Food" },
                { value: "cleaning", label: "Cleaning" },
                { value: "others", label: "Others" }
              ].map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: category.value as any })}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.category === category.value
                      ? "border-purple-500 bg-purple-900/30 text-purple-300"
                      : "border-gray-600 bg-gray-800/30 text-gray-300 hover:border-purple-400"
                  }`}
                >
                  <div className="text-2xl mb-2">{getCategoryIcon(category.value)}</div>
                  <div className="text-sm font-medium">{category.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Detailed Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="dark-input w-full px-4 py-3 rounded-xl"
              placeholder="Provide detailed information about the issue..."
              rows={4}
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              💡 Our AI will analyze your description to suggest priority and solutions
            </p>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                value={formData.location.block}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  location: { ...formData.location, block: e.target.value }
                })}
                className="dark-input px-4 py-3 rounded-xl"
                placeholder="Block (e.g., Block A)"
                required
              />
              <input
                type="text"
                value={formData.location.floor}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  location: { ...formData.location, floor: e.target.value }
                })}
                className="dark-input px-4 py-3 rounded-xl"
                placeholder="Floor"
                required
              />
              <input
                type="text"
                value={formData.location.room}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  location: { ...formData.location, room: e.target.value }
                })}
                className="dark-input px-4 py-3 rounded-xl"
                placeholder="Room"
                required
              />
            </div>
          </div>

          {/* Anonymous Reporting */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="anonymous"
              checked={formData.isAnonymous}
              onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
              className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
            />
            <label htmlFor="anonymous" className="text-sm font-medium text-gray-300">
              Report anonymously
            </label>
          </div>

          {/* Anonymous Name */}
          {formData.isAnonymous && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name for Anonymous Report *
              </label>
              <input
                type="text"
                value={formData.reporterName}
                onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                className="dark-input w-full px-4 py-3 rounded-xl"
                placeholder="How should we address you?"
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="dark-button w-full py-4 px-6 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing & Submitting...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span className="mr-2">🚀</span>
                Submit Issue Report
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
