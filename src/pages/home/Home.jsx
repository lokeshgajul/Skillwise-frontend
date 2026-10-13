import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FiZap, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import PopularRoadmaps from "../../components/popular-roadmaps/PopularRoadmap";
import CreateRoadmap from "../../components/create-roadmaps/CreateRoamdap";
import { ThemeContext } from "../../context/ThemeContext";
import Roadmaps from "../roadmaps/Roadmaps";

const Home = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen pt-20 pb-12 transition-colors duration-200 ${
        isDark ? "bg-[#18181b] text-gray-100" : "bg-slate-50 text-slate-800"
      }`}
    >
      {/* Featured AI Assessment Callout Hero Banner */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <div
          className={`p-6 sm:p-7 rounded-2xl border relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg ${
            isDark
              ? "bg-gradient-to-r from-blue-950/40 via-zinc-900 to-indigo-950/40 border-blue-900/40"
              : "bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-blue-200 shadow-blue-100/50"
          }`}
        >
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-blue-500 bg-blue-500/10 border border-blue-500/20">
              <FiZap className="animate-pulse" /> Step 1: Skill Assessment
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Start with an AI Skill & Experience Assessment
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl">
              Don't waste time learning what you already know. Let our AI diagnose your current technical baseline and pinpoint knowledge gaps.
            </p>
          </div>

          <Link
            to="/assessment"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all cursor-pointer"
          >
            <span>Take Skill Assessment</span>
            <FiArrowRight />
          </Link>
        </div>
      </div>

      <CreateRoadmap />
      <Roadmaps />
      <PopularRoadmaps />
    </div>
  );
};

export default Home;
