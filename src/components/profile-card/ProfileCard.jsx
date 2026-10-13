import React, { useEffect, useState, useContext } from "react";
import { userService } from "../../services/api";
import { ThemeContext } from "../../context/ThemeContext";
import { FiEdit2, FiCheck, FiUser, FiAward, FiClock } from "react-icons/fi";

const ProfileCard = ({ onUserLoaded }) => {
  const { theme } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isDark = theme === "dark";

  const getProfile = async () => {
    try {
      const data = await userService.getProfile();
      if (data?.user) {
        setUser(data.user);
        setBio(data.user.bio || "");
        if (onUserLoaded) onUserLoaded(data.user);
      }
    } catch (error) {
      console.error("Profile load error:", error);
    }
  };

  const handleSaveBio = async () => {
    try {
      setIsSaving(true);
      const res = await userService.updateProfile({ bio });
      if (res?.user) {
        setUser(res.user);
      }
      setIsEditing(false);
    } catch (err) {
      console.error("Save bio error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="pt-24 px-4 max-w-4xl mx-auto">
      <div
        className={`p-6 sm:p-8 rounded-2xl border backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center md:items-start gap-6 transition-all ${
          isDark
            ? "bg-zinc-900/90 border-zinc-800 shadow-black/40"
            : "bg-white/90 border-slate-200 shadow-slate-200/50"
        }`}
      >
        {/* User Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl font-extrabold uppercase shadow-lg shadow-blue-500/30">
            {user?.username ? user.username[0] : "U"}
          </div>
        </div>

        {/* User Info & Bio */}
        <div className="flex-1 text-center md:text-left space-y-3 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-black capitalize tracking-tight">
                {user?.username || "Learner"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {user?.email}
              </p>
            </div>

            {/* Assessment Status Badge */}
            {user?.targetGoal && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20 self-center sm:self-auto">
                <FiAward />
                <span>Target: {user.targetGoal}</span>
              </div>
            )}
          </div>

          {/* Bio Section */}
          <div className="pt-1">
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short bio or what you're working on..."
                  rows={2}
                  className={`w-full p-2.5 text-xs sm:text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    isDark
                      ? "bg-zinc-800 border-zinc-700 text-white"
                      : "bg-slate-50 border-slate-300 text-slate-800"
                  }`}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 text-xs text-gray-400 hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveBio}
                    disabled={isSaving}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm"
                  >
                    <FiCheck /> {isSaving ? "Saving..." : "Save Bio"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 italic">
                  {bio ? `"${bio}"` : "No bio added yet. Tell us about your technical goals!"}
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-gray-500/10"
                  title="Edit bio"
                >
                  <FiEdit2 size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-gray-500 dark:text-gray-400">
            {user?.experienceLevel && user.experienceLevel !== "not_set" && (
              <span className="flex items-center gap-1 capitalize font-medium">
                <FiAward className="text-blue-500" /> Level: {user.experienceLevel}
              </span>
            )}
            {user?.weeklyHours && (
              <span className="flex items-center gap-1 font-medium">
                <FiClock className="text-indigo-500" /> {user.weeklyHours} hrs/week
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
