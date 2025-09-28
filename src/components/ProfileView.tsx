import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { useState } from "react";

interface ProfileViewProps {
  userProfile: any;
}

export function ProfileView({ userProfile }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile?.profile?.name || "",
    hostelBlock: userProfile?.profile?.hostelBlock || "",
    roomNumber: userProfile?.profile?.roomNumber || "",
    department: userProfile?.profile?.department || ""
  });

  const updateProfile = useMutation(api.users.updateUserProfile);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    try {
      await updateProfile({
        role: userProfile?.profile?.role,
        name: formData.name.trim(),
        hostelBlock: formData.hostelBlock || undefined,
        roomNumber: formData.roomNumber || undefined,
        department: formData.department || undefined
      });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "hosteler": return "🎓";
      case "authority": return "👨‍💼";
      case "admin": return "👑";
      default: return "👤";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "hosteler": return "text-blue-300";
      case "authority": return "text-orange-300";
      case "admin": return "text-purple-300";
      default: return "text-gray-300";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="dark-card p-8 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl" style={{ background: 'var(--gradient-primary)' }}>
          {getRoleIcon(userProfile?.profile?.role)}
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          {userProfile?.profile?.name || "User"}
        </h1>
        <p className={`text-lg font-medium ${getRoleColor(userProfile?.profile?.role)}`}>
          {userProfile?.profile?.role === "hosteler" ? "Student" : 
           userProfile?.profile?.role === "authority" ? "Staff Member" : 
           userProfile?.profile?.role === "admin" ? "Administrator" : "User"}
        </p>
      </div>

      {/* Profile Information */}
      <div className="dark-card p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Profile Information</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="dark-button-secondary px-4 py-2 rounded-lg"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="dark-input w-full px-4 py-3 rounded-lg"
                placeholder="Enter your full name"
              />
            ) : (
              <p className="text-white text-lg">{userProfile?.profile?.name || "Not provided"}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Role
            </label>
            <p className={`text-lg font-medium ${getRoleColor(userProfile?.profile?.role)}`}>
              {userProfile?.profile?.role === "hosteler" ? "Student" : 
               userProfile?.profile?.role === "authority" ? "Staff Member" : 
               userProfile?.profile?.role === "admin" ? "Administrator" : "User"}
            </p>
          </div>

          {/* Hostel Block (for students) */}
          {userProfile?.profile?.role === "hosteler" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Hostel Block
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.hostelBlock}
                    onChange={(e) => setFormData({ ...formData, hostelBlock: e.target.value })}
                    className="dark-input w-full px-4 py-3 rounded-lg"
                    placeholder="e.g., Block A, Block B"
                  />
                ) : (
                  <p className="text-white text-lg">{userProfile?.profile?.hostelBlock || "Not provided"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Room Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="dark-input w-full px-4 py-3 rounded-lg"
                    placeholder="e.g., 205, A-301"
                  />
                ) : (
                  <p className="text-white text-lg">{userProfile?.profile?.roomNumber || "Not provided"}</p>
                )}
              </div>
            </>
          )}

          {/* Department (for staff/admin) */}
          {(userProfile?.profile?.role === "authority" || userProfile?.profile?.role === "admin") && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Department
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="dark-input w-full px-4 py-3 rounded-lg"
                  placeholder="e.g., Maintenance, Security, Administration"
                />
              ) : (
                <p className="text-white text-lg">{userProfile?.profile?.department || "Not provided"}</p>
              )}
            </div>
          )}
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              className="dark-button px-6 py-3 rounded-lg"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Account Statistics */}
      <div className="dark-card p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Account Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl" style={{ background: 'var(--gradient-primary)' }}>
              📝
            </div>
            <h3 className="text-xl font-bold text-white">0</h3>
            <p className="text-gray-300">Issues Reported</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl" style={{ background: 'var(--gradient-secondary)' }}>
              ✅
            </div>
            <h3 className="text-xl font-bold text-white">0</h3>
            <p className="text-gray-300">Issues Resolved</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(45deg, #FF9800, #FF5722)' }}>
              ⏳
            </div>
            <h3 className="text-xl font-bold text-white">0</h3>
            <p className="text-gray-300">Pending Issues</p>
          </div>
        </div>
      </div>
    </div>
  );
}
