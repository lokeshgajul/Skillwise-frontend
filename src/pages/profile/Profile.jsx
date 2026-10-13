import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiZap, FiAward, FiCheckCircle, FiAlertCircle, FiArrowRight, FiBookOpen } from "react-icons/fi";
import ProfileCard from "../../components/profile-card/ProfileCard";
import { ThemeContext } from "../../context/ThemeContext";
import { ContentContext } from "../../context/ContentContext";
import { assessmentService } from "../../services/api";

const Profile = () => {
  const { theme } = useContext(ThemeContext);
  const { prevRoadmaps, getRoadmaps } = useContext(ContentContext);
  const [assessment, setAssessment] = useState(null);
  const [loadingAssessment, setLoadingAssessment] = useState(true);

  const isDark = theme === "dark";

  useEffect(() => {
    getRoadmaps();
    const fetchAssessment = async () => {
      try {
        const data = await assessmentService.getLatest();
        if (data?.success && data.assessment) {
          setAssessment(data.assessment);
        }
      } catch (err) {
        console.error("Profile assessment fetch error:", err);
      } finally {
        setLoadingAssessment(false);
      }
    };
    fetchAssessment();
  }, []);

  return (
    <section className="pb-16 min-h-screen">
      <ProfileCard onUserLoaded={() => {}} />

      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-8">
        {/* Real Skill Assessment Card */}
        <div
          className={`p-6 sm:p-8 rounded-2xl border backdrop-blur-md shadow-xl transition-all ${
            isDark
              ? "bg-zinc-900/90 border-zinc-800 shadow-black/40"
              : "bg-white/90 border-slate-200 shadow-slate-200/50"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <FiZap className="text-amber-500" />
                <h2 className="text-xl font-bold tracking-tight">AI Skill & Baseline Profile</h2>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Your assessed technical readiness and prioritized skill gaps.
              </p>
            </div>

            <Link
              to="/assessment"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 transition-all self-start sm:self-auto cursor-pointer"
            >
              {assessment ? "Retake Assessment" : "Take Assessment"}
              <FiArrowRight />
            </Link>
          </div>

          {loadingAssessment ? (
            <div className="py-8 text-center text-xs text-gray-400">Loading skill assessment...</div>
          ) : assessment ? (
            <div className="space-y-6">
              {/* Readiness Progress Bar & Score */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="flex items-center gap-1.5 capitalize">
                    <FiAward className="text-blue-500" /> Goal: {assessment.targetGoal}
                  </span>
                  <span className="text-blue-500 font-bold">{assessment.readinessScore}% Readiness</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000"
                    style={{ width: `${assessment.readinessScore}%` }}
                  />
                </div>
              </div>

              {/* Strengths & Gaps Pills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div
                  className={`p-4 rounded-xl border ${
                    isDark ? "bg-zinc-800/40 border-zinc-800" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5 mb-2">
                    <FiCheckCircle /> Assessed Strengths
                  </span>
                  <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                    {assessment.strengths?.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={`p-4 rounded-xl border ${
                    isDark ? "bg-zinc-800/40 border-zinc-800" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5 mb-2">
                    <FiAlertCircle /> Priority Focus Areas
                  </span>
                  <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                    {assessment.gaps?.map((g, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 border border-dashed rounded-xl border-gray-300 dark:border-zinc-700 p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                You haven't completed a skill assessment yet. Take a 2-minute diagnostic check to discover your readiness and tailored roadmap!
              </p>
              <Link
                to="/assessment"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md shadow-blue-500/25"
              >
                <FiZap /> Start Skill Assessment
              </Link>
            </div>
          )}
        </div>

        {/* Real User Enrolled Roadmaps */}
        <div
          className={`p-6 sm:p-8 rounded-2xl border backdrop-blur-md shadow-xl transition-all ${
            isDark
              ? "bg-zinc-900/90 border-zinc-800 shadow-black/40"
              : "bg-white/90 border-slate-200 shadow-slate-200/50"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <FiBookOpen className="text-blue-500" /> Your Active Learning Roadmaps
            </h2>
            <Link to="/" className="text-xs font-semibold text-blue-500 hover:underline">
              Browse All
            </Link>
          </div>

          {prevRoadmaps && prevRoadmaps.length > 0 ? (
            <div className="space-y-3">
              {prevRoadmaps.map((item, index) => (
                <div
                  key={item._id || index}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isDark ? "bg-zinc-800/40 border-zinc-800" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div>
                    <h3 className="font-bold text-sm capitalize">{item.goal}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                      {item.roadmap ? item.roadmap.slice(0, 90) + "..." : "Structured learning path"}
                    </p>
                  </div>

                  <Link
                    to={`/generated-roadmap?goal=${encodeURIComponent(item.goal)}&id=${item._id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-500 hover:underline self-end sm:self-auto flex-shrink-0"
                  >
                    <span>Continue Learning</span>
                    <FiArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 border border-dashed rounded-xl border-gray-300 dark:border-zinc-700 p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                No active roadmaps generated yet.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md shadow-blue-500/25"
              >
                Generate Your First Roadmap
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Profile;
