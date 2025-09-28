import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function ProfileSetup() {
  const [formData, setFormData] = useState({
    role: "hosteler" as "hosteler" | "authority" | "admin",
    name: "",
    hostelBlock: "",
    roomNumber: "",
    department: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateProfile = useMutation(api.users.updateUserProfile);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile({
        role: formData.role,
        name: formData.name.trim(),
        hostelBlock: formData.hostelBlock || undefined,
        roomNumber: formData.roomNumber || undefined,
        department: formData.department || undefined
      });
      toast.success("Profile setup complete!");
    } catch (error) {
      toast.error("Failed to setup profile");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gradient mb-4">
            Complete Your Profile
          </h2>
          <p className="text-gray-300">
            Help us personalize your experience
          </p>
        </div>

        <div className="dark-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="dark-input w-full px-4 py-3 rounded-xl"
              >
                <option value="hosteler">Hosteler (Student)</option>
                <option value="authority">Authority (Staff)</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="dark-input w-full px-4 py-3 rounded-xl"
                placeholder="Enter your full name"
                required
              />
            </div>

            {formData.role === "hosteler" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hostel Block
                  </label>
                  <input
                    type="text"
                    value={formData.hostelBlock}
                    onChange={(e) => setFormData({ ...formData, hostelBlock: e.target.value })}
                    className="dark-input w-full px-4 py-3 rounded-xl"
                    placeholder="e.g., Block A, Block B"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Room Number
                  </label>
                  <input
                    type="text"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="dark-input w-full px-4 py-3 rounded-xl"
                    placeholder="e.g., 205, A-301"
                  />
                </div>
              </>
            )}

            {(formData.role === "authority" || formData.role === "admin") && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="dark-input w-full px-4 py-3 rounded-xl"
                  placeholder="e.g., Maintenance, Security, Administration"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="dark-button w-full py-3 px-6 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Setting up...
                </div>
              ) : (
                "Complete Setup"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
