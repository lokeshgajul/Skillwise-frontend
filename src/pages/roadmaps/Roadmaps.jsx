import React, { useContext, useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import { ThemeContext } from "../../context/ThemeContext";
import ReactImg from "../../assets/images/React.png";
import { Link } from "react-router-dom";
import { ContentContext } from "../../context/ContentContext";

const Roadmaps = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const { getRoadmaps, prevRoadmaps } = useContext(ContentContext);

  useEffect(() => {
    getRoadmaps();
  }, []);

  return (
    <div className="p-7 lg:px-10 max-w-6xl mx-auto">
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-blue-500 bg-blue-500/10 border border-blue-500/20">
          My Learning
        </span>
        <h2 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight">
          Your Courses
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {prevRoadmaps?.map((roadmap, index) => (
          <div
            key={index}
            className={`group rounded-2xl border overflow-hidden flex flex-col transition-all hover:shadow-lg hover:scale-[1.02] ${
              isDark
                ? "bg-zinc-900/90 border-zinc-800 backdrop-blur-md shadow-black/20 text-gray-100 hover:border-blue-500/40"
                : "bg-white/90 border-slate-200 backdrop-blur-md shadow-slate-200/50 text-slate-800 hover:border-blue-400/50"
            }`}
          >
            <div
              className={`relative w-full h-36 overflow-hidden ${
                isDark ? "bg-zinc-800" : "bg-slate-100"
              }`}
            >
              <img
                src={ReactImg}
                alt={roadmap?.goal}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 backdrop-blur-md">
                In Progress
              </span>
            </div>

            <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
              <div>
                <h3 className="text-sm font-bold capitalize leading-snug line-clamp-2 tracking-tight">
                  {roadmap?.goal}
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                  {roadmap?.roadmap.slice(0, 100)}...
                </p>
              </div>

              <Link
                to={`/generated-roadmap?goal=${encodeURIComponent(
                  roadmap.goal
                )}&id=${roadmap._id}`}
                className="mt-auto inline-flex items-center justify-between gap-1.5 w-full px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs font-semibold shadow-md shadow-blue-500/25 hover:opacity-90 active:scale-[0.99] transition-all"
              >
                <span>Start Learning</span>
                <FiArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmaps;
