import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ContentContext } from "../../context/ContentContext";
import { ThemeContext } from "../../context/ThemeContext";
import { FiCompass, FiZap } from "react-icons/fi";

const CreateRoadmap = () => {
  const { theme } = useContext(ThemeContext);
  const { loading, goal, setGoal, generateRoadmap } = useContext(ContentContext);
  const navigate = useNavigate();

  const isDark = theme === "dark";

  const handleClick = async () => {
    if (!goal.trim()) return;
    const success = await generateRoadmap();
    if (success) {
      navigate(`/generated-roadmap?goal=${encodeURIComponent(goal)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && goal.trim()) {
      handleClick();
    }
  };

  return (
    <div className="py-8 px-4 text-center">
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Unlock Your Potential With{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            SkillWise
          </span>
        </h1>

        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Ready to jump straight into learning? Enter your desired skill or career goal, and let AI generate an actionable step-by-step roadmap.
        </p>

        {/* Input & Generate Bar */}
        <div className="pt-2 flex justify-center">
          <div
            className={`w-full max-w-xl p-1.5 rounded-full border shadow-lg flex items-center transition-all ${
              isDark
                ? "bg-zinc-900 border-zinc-700/80 shadow-black/40 focus-within:border-blue-500"
                : "bg-white border-slate-300 shadow-slate-200/60 focus-within:border-blue-500"
            }`}
          >
            <div className="pl-3.5 text-gray-400">
              <FiCompass size={18} />
            </div>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Full Stack Web Developer, Machine Learning, Docker..."
              className="w-full px-3 py-2 text-sm bg-transparent focus:outline-none placeholder-gray-400"
            />
            <button
              disabled={!goal.trim() || loading}
              onClick={handleClick}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm py-2.5 px-5 rounded-full shadow-md shadow-blue-500/25 transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FiZap />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoadmap;
