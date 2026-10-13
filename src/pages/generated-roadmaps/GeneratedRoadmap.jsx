import React, { useContext, useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckCircle,
  FiCircle,
  FiPlay,
  FiClock,
  FiBookOpen,
  FiAward,
  FiArrowRight,
  FiRefreshCw,
  FiLock,
  FiUnlock,
  FiCheck,
  FiX,
  FiExternalLink,
  FiChevronDown,
  FiChevronUp,
  FiZap,
} from "react-icons/fi";
import { ContentContext } from "../../context/ContentContext";
import { ThemeContext } from "../../context/ThemeContext";
import { roadmapService, youtubeService } from "../../services/api";

const GeneratedRoadmap = () => {
  const { theme } = useContext(ThemeContext);
  const {
    getRoadmapById,
    selectedRoadmap,
    setSelectedRoadmap,
    loading,
    generateRoadmap,
  } = useContext(ContentContext);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryGoal = searchParams.get("goal");
  const queryId = searchParams.get("id");

  // Local interaction state
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  // Fetch real YouTube videos for the topic and open the player modal
  const handleWatchVideo = async (resource, topic) => {
    const roadmapGoal = selectedRoadmap?.goal || queryGoal || "";
    const query = `${roadmapGoal} ${topic?.title || ""}`.trim();
    setActiveVideoModal({
      title: resource.title,
      query,
      videoId: null,
      videos: [],
      loading: true,
      error: null,
    });
    try {
      const items = await youtubeService.search(query);
      const videos = (items || [])
        .filter((item) => item.id?.videoId)
        .map((item) => ({
          videoId: item.id.videoId,
          title: item.snippet?.title || "",
          thumbnail: item.snippet?.thumbnails?.default?.url || "",
        }));
      if (videos.length === 0) {
        setActiveVideoModal((prev) => ({
          ...prev,
          loading: false,
          error: "No videos found for this topic. Try again in a moment.",
        }));
        return;
      }
      setActiveVideoModal((prev) => ({
        ...prev,
        loading: false,
        videoId: videos[0].videoId,
        videos: videos.slice(0, 6),
      }));
    } catch {
      setActiveVideoModal((prev) => ({
        ...prev,
        loading: false,
        error: "Could not load videos right now. Please try again.",
      }));
    }
  };

  // Assessment flow state
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [assessmentData, setAssessmentData] = useState(null);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [assessmentAnswers, setAssessmentAnswers] = useState({});
  const [assessmentResult, setAssessmentResult] = useState(null);

  const isDark = theme === "dark";

  // Close the video modal with the Escape key
  useEffect(() => {
    if (!activeVideoModal) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setActiveVideoModal(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeVideoModal]);

  // Load Roadmap by ID or Goal
  useEffect(() => {
    const loadData = async () => {
      if (queryId) {
        await getRoadmapById(queryId);
      } else if (queryGoal) {
        // Find existing roadmap with same goal or generate one
        const data = await roadmapService.getRoadmaps();
        const existing = data?.roadmaps?.find(
          (r) => r.goal.toLowerCase() === queryGoal.toLowerCase()
        );
        if (existing) {
          setSelectedRoadmap(existing);
        } else {
          // Generate new
          await generateRoadmap(queryGoal);
        }
      }
    };
    loadData();
  }, [queryId, queryGoal]);

  // Set initial selected topic when roadmap loads
  useEffect(() => {
    if (selectedRoadmap?.modules && selectedRoadmap.modules.length > 0) {
      // Find first uncompleted topic as default, or first topic
      let foundFirst = null;
      let firstModId = selectedRoadmap.modules[0].moduleId;

      for (const mod of selectedRoadmap.modules) {
        for (const top of mod.topics) {
          if (!top.completed && !foundFirst) {
            foundFirst = { ...top, moduleId: mod.moduleId, moduleTitle: mod.title };
            firstModId = mod.moduleId;
            break;
          }
        }
        if (foundFirst) break;
      }

      if (!foundFirst && selectedRoadmap.modules[0].topics.length > 0) {
        foundFirst = {
          ...selectedRoadmap.modules[0].topics[0],
          moduleId: selectedRoadmap.modules[0].moduleId,
          moduleTitle: selectedRoadmap.modules[0].title,
        };
      }

      setSelectedTopic(foundFirst);
      setSelectedModuleId(firstModId);

      // Expand all modules by default
      const expMap = {};
      selectedRoadmap.modules.forEach((m) => {
        expMap[m.moduleId] = true;
      });
      setExpandedModules(expMap);

      // If already has assessment results, load them
      if (selectedRoadmap.assessmentResult?.score !== undefined) {
        setAssessmentResult(selectedRoadmap.assessmentResult);
      }
    }
  }, [selectedRoadmap]);

  // Determine current active topic across the entire roadmap
  const currentActiveTopicId = useMemo(() => {
    if (!selectedRoadmap?.modules) return null;
    for (const mod of selectedRoadmap.modules) {
      for (const top of mod.topics) {
        if (!top.completed) {
          return top.topicId;
        }
      }
    }
    return null;
  }, [selectedRoadmap]);

  // Toggle module accordion
  const toggleModule = (modId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  // Select a topic for viewing in workspace
  const handleSelectTopic = (top, mod) => {
    setSelectedTopic({
      ...top,
      moduleId: mod.moduleId,
      moduleTitle: mod.title,
    });
    setSelectedModuleId(mod.moduleId);
  };

  // Mark topic completed
  const handleCompleteTopic = async (topicId) => {
    if (!selectedRoadmap?._id || !topicId) return;
    setActionLoading(true);
    try {
      const data = await roadmapService.completeTopic(selectedRoadmap._id, topicId);
      if (data?.roadmap) {
        setSelectedRoadmap(data.roadmap);
        // If there is a next topic, auto-select it
        if (data.nextTopic) {
          setSelectedTopic(data.nextTopic);
          setSelectedModuleId(data.nextTopic.moduleId);
        } else {
          // Refresh selected topic state from updated roadmap
          const updatedTop = data.roadmap.modules
            .flatMap((m) => m.topics)
            .find((t) => t.topicId === topicId);
          if (updatedTop) setSelectedTopic(updatedTop);
        }
      }
    } catch (err) {
      console.error("Error completing topic:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Mark topic incomplete
  const handleUncompleteTopic = async (topicId) => {
    if (!selectedRoadmap?._id || !topicId) return;
    setActionLoading(true);
    try {
      const data = await roadmapService.uncompleteTopic(selectedRoadmap._id, topicId);
      if (data?.roadmap) {
        setSelectedRoadmap(data.roadmap);
        const updatedTop = data.roadmap.modules
          .flatMap((m) => m.topics)
          .find((t) => t.topicId === topicId);
        if (updatedTop) setSelectedTopic(updatedTop);
      }
    } catch (err) {
      console.error("Error uncompleting topic:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Complete specific resource
  const handleToggleResource = async (topicId, resourceId) => {
    if (!selectedRoadmap?._id) return;
    try {
      await roadmapService.completeResource(selectedRoadmap._id, topicId, resourceId);
      // Reload roadmap
      await getRoadmapById(selectedRoadmap._id);
    } catch (err) {
      console.error("Error completing resource:", err);
    }
  };

  // Jump to Current Topic
  const handleJumpToCurrent = () => {
    if (!selectedRoadmap?.modules) return;
    for (const mod of selectedRoadmap.modules) {
      for (const top of mod.topics) {
        if (!top.completed) {
          handleSelectTopic(top, mod);
          setExpandedModules((prev) => ({ ...prev, [mod.moduleId]: true }));
          return;
        }
      }
    }
  };

  // Regenerate Roadmap
  const handleRegenerate = async () => {
    const confirmed = window.confirm(
      "Regenerating will create an updated AI learning roadmap for this goal while preserving your account history. Continue?"
    );
    if (!confirmed) return;
    const goalTitle = selectedRoadmap?.goal || queryGoal;
    const newDoc = await generateRoadmap(goalTitle);
    if (newDoc?._id) {
      navigate(`/generated-roadmap?id=${newDoc._id}&goal=${encodeURIComponent(goalTitle)}`);
    }
  };

  // Start Assessment Flow
  const handleStartAssessment = async () => {
    if (!selectedRoadmap?._id) return;
    setAssessmentLoading(true);
    setIsAssessmentOpen(true);
    try {
      const data = await roadmapService.getAssessment(selectedRoadmap._id);
      if (data?.questions) {
        setAssessmentData(data);
        setCurrentQIndex(0);
        setAssessmentAnswers({});
      }
    } catch (err) {
      console.error("Error fetching assessment:", err);
    } finally {
      setAssessmentLoading(false);
    }
  };

  // Submit Assessment
  const handleSubmitAssessment = async () => {
    if (!selectedRoadmap?._id || !assessmentData?.questions) return;
    setAssessmentLoading(true);
    try {
      const formattedAnswers = assessmentData.questions.map((q, idx) => ({
        id: q.id ?? idx + 1,
        selectedAnswer: assessmentAnswers[idx] !== undefined ? assessmentAnswers[idx] : -1,
      }));

      const res = await roadmapService.submitAssessment(
        selectedRoadmap._id,
        formattedAnswers
      );
      if (res?.assessmentResult) {
        setAssessmentResult(res.assessmentResult);
        // Refresh roadmap document
        getRoadmapById(selectedRoadmap._id);
      }
    } catch (err) {
      console.error("Error submitting assessment:", err);
    } finally {
      setAssessmentLoading(false);
    }
  };

  if (loading || !selectedRoadmap) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-lg font-bold">Creating your learning roadmap...</h2>
        <div className="mt-4 space-y-1.5 text-xs text-gray-400 text-left max-w-xs">
          <p className="text-emerald-500 flex items-center gap-1.5">
            <FiCheckCircle /> Understanding your goal
          </p>
          <p className="text-blue-500 flex items-center gap-1.5">
            <FiCheckCircle /> Planning learning modules
          </p>
          <p className="text-amber-500 flex items-center gap-1.5 animate-pulse">
            <FiZap /> Curating topics & resources
          </p>
          <p className="text-gray-400 flex items-center gap-1.5">
            <FiCircle /> Preparing your learning path
          </p>
        </div>
      </div>
    );
  }

  const {
    goal,
    title,
    level,
    estimatedWeeks,
    totalTopics = 0,
    completedTopics = 0,
    progressPercentage = 0,
    modules = [],
  } = selectedRoadmap;

  const isAllCompleted = totalTopics > 0 && completedTopics === totalTopics;

  // Next topic for teaser
  const nextTopicTeaser = (() => {
    if (!selectedTopic) return null;
    let foundCurrent = false;
    for (const mod of modules) {
      for (const top of mod.topics) {
        if (foundCurrent && !top.completed) {
          return { ...top, moduleTitle: mod.title };
        }
        if (top.topicId === selectedTopic.topicId) {
          foundCurrent = true;
        }
      }
    }
    return null;
  })();

  return (
    <div
      className={`min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-200 ${
        isDark ? "bg-[#141416] text-slate-100" : "bg-[#f8fafc] text-slate-800"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ========================================================= */}
        {/* 1. PAGE HEADER                                           */}
        {/* ========================================================= */}
        <div
          className={`p-6 sm:p-7 rounded-2xl border backdrop-blur-md shadow-sm transition-all ${
            isDark
              ? "bg-zinc-900/90 border-zinc-800/80 shadow-black/20"
              : "bg-white border-slate-200/90 shadow-slate-200/40"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-blue-500 flex items-center gap-1.5 mb-1">
                <FiBookOpen /> Your Personalized Learning Journey
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight capitalize">
                {title || goal}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
                AI-generated learning path tailored to your goal, organizing production concepts into progressive modules.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleJumpToCurrent}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FiPlay size={14} /> Continue Learning
              </button>

              <button
                onClick={handleRegenerate}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isDark
                    ? "border-zinc-700 bg-zinc-800/70 text-zinc-300 hover:bg-zinc-750"
                    : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                title="Regenerate this roadmap with AI"
              >
                <FiRefreshCw size={13} /> Regenerate Roadmap
              </button>
            </div>
          </div>

          {/* Compact SaaS Metadata Row */}
          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-zinc-800/80 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-gray-500 dark:text-gray-400 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Level: <strong className="text-slate-800 dark:text-slate-200 capitalize">{level}</strong>
            </span>
            <span>•</span>
            <span>
              Modules: <strong className="text-slate-800 dark:text-slate-200">{modules.length} Modules</strong>
            </span>
            <span>•</span>
            <span>
              Topics: <strong className="text-slate-800 dark:text-slate-200">{totalTopics} Topics</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <FiClock size={13} />
              Estimated: <strong className="text-slate-800 dark:text-slate-200">{estimatedWeeks} weeks</strong>
            </span>
            <span>•</span>
            <span>
              Status:{" "}
              <span
                className={`font-semibold capitalize px-2 py-0.5 rounded-full text-[11px] ${
                  isAllCompleted
                    ? "bg-emerald-500/15 text-emerald-500"
                    : completedTopics > 0
                    ? "bg-amber-500/15 text-amber-500"
                    : "bg-zinc-500/15 text-zinc-400"
                }`}
              >
                {isAllCompleted ? "Completed" : completedTopics > 0 ? "In Progress" : "Not Started"}
              </span>
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. OVERALL PROGRESS BAR                                  */}
        {/* ========================================================= */}
        <div
          className={`p-5 rounded-2xl border backdrop-blur-md shadow-sm transition-all ${
            isDark
              ? "bg-zinc-900/90 border-zinc-800/80"
              : "bg-white border-slate-200/90"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Overall Progress
              </span>
              <div className="text-sm font-extrabold">
                <span className="text-blue-500">{completedTopics}</span> / {totalTopics} topics completed
              </div>
            </div>

            <div className="text-right">
              <span className="text-xl font-black text-blue-600">{progressPercentage}%</span>
            </div>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full"
            />
          </div>

          <p className="mt-2.5 text-xs text-gray-500 dark:text-gray-400 italic">
            {completedTopics === 0
              ? "Start your learning journey by completing your first topic."
              : isAllCompleted
              ? "🎉 You've completed 100% of your roadmap! Your final assessment is unlocked."
              : progressPercentage >= 50
              ? "You're more than halfway through your roadmap. Excellent momentum!"
              : "Great start! Consistent daily study turns ambitious skills into second nature."}
          </p>
        </div>

        {/* ========================================================= */}
        {/* 3. ROADMAP COMPLETION / ASSESSMENT UNLOCK BANNER         */}
        {/* ========================================================= */}
        {isAllCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 sm:p-7 rounded-2xl border relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl ${
              isDark
                ? "bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-blue-950/40 border-emerald-500/40"
                : "bg-gradient-to-r from-emerald-50 via-white to-blue-50 border-emerald-300 shadow-emerald-100"
            }`}
          >
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">
                <FiUnlock /> Assessment Unlocked
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                🎉 Roadmap Completed! ({totalTopics}/{totalTopics} Topics)
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xl">
                You've completed every topic in the {goal} roadmap. Test what you've learned with an AI-generated final certification assessment.
              </p>
            </div>

            <button
              onClick={handleStartAssessment}
              className="flex-shrink-0 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <FiAward size={18} /> Take Assessment &rarr;
            </button>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* 4. MAIN WORKSPACE: TIMELINE (LEFT) + TOPIC DETAILS (RIGHT)*/}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Vertical Structured Learning Timeline */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <FiBookOpen /> Learning Curriculum ({modules.length} Modules)
              </h2>
              <button
                onClick={() => {
                  const allOpen = Object.values(expandedModules).every(Boolean);
                  const nextState = {};
                  modules.forEach((m) => (nextState[m.moduleId] = !allOpen));
                  setExpandedModules(nextState);
                }}
                className="text-xs text-blue-500 hover:underline"
              >
                Toggle All
              </button>
            </div>

            <div className="space-y-3">
              {modules.map((mod, modIdx) => {
                const isExpanded = !!expandedModules[mod.moduleId];
                const modCompletedCount = mod.topics.filter((t) => t.completed).length;
                const isModDone = mod.topics.length > 0 && modCompletedCount === mod.topics.length;

                return (
                  <div
                    key={mod.moduleId || modIdx}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isDark
                        ? "bg-zinc-900/80 border-zinc-800/90"
                        : "bg-white border-slate-200/90 shadow-sm"
                    }`}
                  >
                    {/* Module Header Accordion */}
                    <div
                      onClick={() => toggleModule(mod.moduleId)}
                      className={`p-4 flex items-center justify-between cursor-pointer select-none transition-colors ${
                        isDark ? "hover:bg-zinc-800/50" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isModDone
                              ? "bg-emerald-500 text-white"
                              : isDark
                              ? "bg-zinc-800 text-zinc-300 border border-zinc-700"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {isModDone ? <FiCheck /> : String(modIdx + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h3 className="font-bold text-sm tracking-tight">{mod.title}</h3>
                          <span className="text-[11px] text-gray-400">
                            {modCompletedCount} / {mod.topics.length} completed
                          </span>
                        </div>
                      </div>

                      <div className="text-gray-400">
                        {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                      </div>
                    </div>

                    {/* Topics List within Module */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-gray-100 dark:border-zinc-800/80 divide-y divide-gray-100 dark:divide-zinc-800/50"
                        >
                          {mod.topics.map((top, topIdx) => {
                            const isSelected = selectedTopic?.topicId === top.topicId;
                            const isCurrent = currentActiveTopicId === top.topicId;

                            return (
                              <div
                                key={top.topicId || topIdx}
                                onClick={() => handleSelectTopic(top, mod)}
                                className={`p-3.5 pl-6 sm:pl-8 flex items-center justify-between cursor-pointer transition-all relative ${
                                  isSelected
                                    ? isDark
                                      ? "bg-blue-950/30 text-white border-l-4 border-l-blue-500"
                                      : "bg-blue-50/70 text-blue-900 border-l-4 border-l-blue-500"
                                    : isDark
                                    ? "hover:bg-zinc-800/40 text-zinc-300"
                                    : "hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  {/* Status Icon */}
                                  {top.completed ? (
                                    <span className="text-emerald-500 text-base" title="Completed">
                                      <FiCheckCircle />
                                    </span>
                                  ) : isCurrent ? (
                                    <span className="text-blue-500 relative flex items-center justify-center">
                                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                      <span className="absolute w-4 h-4 rounded-full bg-blue-500/30 animate-ping" />
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 text-sm">
                                      <FiCircle />
                                    </span>
                                  )}

                                  <div>
                                    <div className="text-xs sm:text-sm font-semibold tracking-tight">
                                      {top.title}
                                    </div>
                                    <div className="text-[10px] text-gray-400">
                                      {top.completed
                                        ? "Completed"
                                        : isCurrent
                                        ? "Current • Continue learning"
                                        : "Upcoming"}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {top.completed && (
                                    <span className="text-[10px] uppercase font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                      Done
                                    </span>
                                  )}
                                  {isCurrent && !top.completed && (
                                    <span className="text-[10px] uppercase font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">
                                      Active
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Assessment Lock Info Card */}
            {!isAllCompleted && (
              <div
                className={`p-4 rounded-2xl border text-xs text-gray-500 flex items-center justify-between gap-3 ${
                  isDark ? "bg-zinc-900/50 border-zinc-800" : "bg-slate-100/70 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FiLock className="text-amber-500 flex-shrink-0" size={16} />
                  <span>
                    Final Assessment unlocks upon completing all {totalTopics} topics ({totalTopics - completedTopics} left).
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Interactive Topic Workspace */}
          <div className="lg:col-span-7 space-y-6">
            {selectedTopic ? (
              <motion.div
                key={selectedTopic.topicId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 sm:p-8 rounded-2xl border shadow-md transition-all ${
                  isDark
                    ? "bg-zinc-900/90 border-zinc-800/90 shadow-black/30"
                    : "bg-white border-slate-200/90 shadow-slate-200/50"
                }`}
              >
                {/* Topic Breadcrumb & Header */}
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-xs uppercase font-bold text-blue-500 tracking-wider">
                    {selectedTopic.moduleTitle || "Current Module"} &rarr; Topic Details
                  </span>
                  {selectedTopic.completed ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                      <FiCheckCircle /> Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                      ● In Progress
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-extrabold tracking-tight mb-2">
                  {selectedTopic.title}
                </h2>

                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  {selectedTopic.description}
                </p>

                {/* Topic Metadata & Actions */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-5 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <FiClock className="text-blue-500" /> ~{selectedTopic.estimatedHours || 2} hours estimated
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <FiBookOpen className="text-indigo-500" />{" "}
                      {selectedTopic.resources?.length || 1} video guides
                    </span>
                  </div>

                  {/* Primary Completion Button */}
                  <div>
                    {selectedTopic.completed ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-emerald-500 font-semibold">
                          ✓ Completed {selectedTopic.completedAt ? "recently" : ""}
                        </span>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleUncompleteTopic(selectedTopic.topicId)}
                          className="text-xs text-gray-400 hover:text-red-500 underline ml-2"
                        >
                          Mark Incomplete
                        </button>
                      </div>
                    ) : (
                      <button
                        disabled={actionLoading}
                        onClick={() => handleCompleteTopic(selectedTopic.topicId)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                      >
                        {actionLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <FiCheckCircle /> Mark Topic as Complete
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Next Topic Recommendation Teaser */}
                {selectedTopic.completed && nextTopicTeaser && (
                  <div
                    className={`p-4 rounded-xl border mb-8 flex items-center justify-between gap-3 ${
                      isDark ? "bg-blue-950/20 border-blue-900/40" : "bg-blue-50/80 border-blue-200"
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
                        Up Next
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold">{nextTopicTeaser.title}</h4>
                    </div>

                    <button
                      onClick={() => handleSelectTopic(nextTopicTeaser, { moduleId: selectedModuleId, title: nextTopicTeaser.moduleTitle })}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-zinc-700 shadow-sm cursor-pointer"
                    >
                      Continue &rarr;
                    </button>
                  </div>
                )}

                {/* Connected Learning Resources Section */}
                <div>
                  <h3 className="text-base font-bold tracking-tight mb-1 flex items-center gap-2">
                    <FiPlay className="text-red-500" /> Learning Resources for {selectedTopic.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Targeted video masterclasses, tutorials, and deep-dives for this specific topic.
                  </p>

                  <div className="space-y-3">
                    {(selectedTopic.resources && selectedTopic.resources.length > 0
                      ? selectedTopic.resources
                      : [
                          {
                            resourceId: `res-gen-${selectedTopic.topicId}`,
                            title: `${selectedTopic.title} In-Depth Video Guide`,
                            duration: "35 min",
                            difficulty: level || "Beginner",
                            completed: false,
                          },
                        ]
                    ).map((res, rIdx) => (
                      <div
                        key={res.resourceId || rIdx}
                        className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                          isDark
                            ? "bg-zinc-800/40 border-zinc-800 hover:border-zinc-700"
                            : "bg-slate-50 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-red-600/10 text-red-600 flex items-center justify-center text-xs">
                              <FiPlay size={10} />
                            </span>
                            <h4 className="text-sm font-bold">{res.title}</h4>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 pl-7 flex items-center gap-3">
                            <span>YouTube</span>
                            <span>•</span>
                            <span>{res.duration || "25 min"}</span>
                            <span>•</span>
                            <span>{res.difficulty || "Beginner"}</span>
                            {res.completed && (
                              <span className="text-emerald-500 font-semibold flex items-center gap-1">
                                <FiCheck size={12} /> Watched
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto pl-7 sm:pl-0">
                          {/* Watch Button */}
                          <button
                            onClick={() => handleWatchVideo(res, selectedTopic)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm cursor-pointer"
                          >
                            <FiPlay size={12} /> Watch
                          </button>

                          {/* Complete resource button */}
                          <button
                            onClick={() => handleToggleResource(selectedTopic.topicId, res.resourceId)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                              res.completed
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                                : isDark
                                ? "border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            {res.completed ? "✓ Watched" : "Mark as completed"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div
                className={`p-12 text-center rounded-2xl border ${
                  isDark ? "bg-zinc-900/50 border-zinc-800 text-gray-400" : "bg-white border-slate-200 text-gray-500"
                }`}
              >
                <FiBookOpen size={32} className="mx-auto mb-3 opacity-50" />
                <h3 className="text-base font-bold">Select a topic from the curriculum</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Click on any topic on the left to view detailed learning objectives and curated tutorials.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. INLINE / MODAL VIDEO PLAYER                            */}
      {/* ========================================================= */}
      {activeVideoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setActiveVideoModal(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Video player"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-3xl my-auto rounded-2xl overflow-hidden shadow-2xl border flex flex-col max-h-[calc(100dvh-1.5rem)] ${
              isDark ? "bg-zinc-900 border-zinc-700" : "bg-white border-slate-300"
            }`}
          >
            <div className="shrink-0 px-4 py-3 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between gap-3">
              <h3 className="font-bold text-sm truncate">{activeVideoModal.title}</h3>
              <button
                onClick={() => setActiveVideoModal(null)}
                aria-label="Close video"
                className={`shrink-0 p-1.5 rounded-lg cursor-pointer transition-colors ${
                  isDark
                    ? "text-zinc-400 hover:text-white hover:bg-zinc-700"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <FiX size={18} />
              </button>
            </div>

            {/* 16:9 player that never exceeds available screen height */}
            <div
              className="relative w-full bg-black shrink"
              style={{
                aspectRatio: "16 / 9",
                maxHeight: "min(56.25vw, calc(100dvh - 10rem))",
              }}
            >
              {activeVideoModal.loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
                  <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-zinc-400">
                    Finding the best video for this topic...
                  </p>
                </div>
              ) : activeVideoModal.error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                  <p className="text-sm text-zinc-400">{activeVideoModal.error}</p>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                      activeVideoModal.query
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
                  >
                    <FiExternalLink size={12} /> Search on YouTube
                  </a>
                </div>
              ) : (
                <iframe
                  key={activeVideoModal.videoId}
                  src={`https://www.youtube.com/embed/${activeVideoModal.videoId}?autoplay=1&rel=0`}
                  title={activeVideoModal.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              )}
            </div>

            {/* Alternative videos from the same search */}
            {!activeVideoModal.loading &&
              !activeVideoModal.error &&
              activeVideoModal.videos?.length > 1 && (
                <div
                  className={`shrink-0 px-4 py-3 border-t overflow-x-auto ${
                    isDark ? "border-zinc-800" : "border-slate-100"
                  }`}
                >
                  <p
                    className={`text-[10px] font-semibold uppercase tracking-wide mb-2 ${
                      isDark ? "text-zinc-500" : "text-slate-400"
                    }`}
                  >
                    More videos for this topic
                  </p>
                  <div className="flex gap-2">
                    {activeVideoModal.videos.map((v) => (
                      <button
                        key={v.videoId}
                        onClick={() =>
                          setActiveVideoModal((prev) => ({ ...prev, videoId: v.videoId }))
                        }
                        className={`shrink-0 flex items-center gap-2 max-w-[200px] px-2 py-1.5 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                          v.videoId === activeVideoModal.videoId
                            ? isDark
                              ? "bg-red-500/15 text-red-400"
                              : "bg-red-50 text-red-600"
                            : isDark
                            ? "text-zinc-400 hover:bg-zinc-800"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {v.thumbnail && (
                          <img
                            src={v.thumbnail}
                            alt=""
                            className="w-12 h-9 rounded object-cover shrink-0"
                          />
                        )}
                        <span className="line-clamp-2">{v.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            <div className="shrink-0 px-4 py-3 flex justify-between items-center gap-3 text-xs border-t border-gray-100 dark:border-zinc-800">
              <span className="truncate text-gray-400">
                Playing: <strong>{activeVideoModal.query}</strong>
              </span>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl cursor-pointer transition-colors"
              >
                Done Watching
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. ASSESSMENT MODAL / WORKSPACE                           */}
      {/* ========================================================= */}
      {isAssessmentOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-2xl my-8 rounded-2xl border shadow-2xl overflow-hidden ${
              isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            {assessmentLoading ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <h3 className="text-lg font-bold">Generating Roadmap Final Assessment...</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Gemini is building 10 targeted assessment questions scoped specifically to the topics you completed in {goal}.
                </p>
              </div>
            ) : assessmentResult ? (
              /* Assessment Results View */
              <div className="p-6 sm:p-8 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-3xl mx-auto mb-2 border border-emerald-500/20">
                    <FiAward />
                  </div>
                  <span className="text-xs uppercase font-bold text-emerald-500 tracking-wider">
                    Assessment Complete
                  </span>
                  <h2 className="text-3xl font-black">{assessmentResult.score}%</h2>
                  <p className="text-xs text-gray-500">
                    {assessmentResult.passed
                      ? "Great work! You demonstrated strong understanding of the core concepts."
                      : "Good effort! Review the recommended topics below to reinforce your knowledge."}
                  </p>
                  <p className="text-xs font-semibold text-gray-400">
                    {assessmentResult.correctAnswers} of {assessmentResult.totalQuestions} questions correct
                  </p>
                </div>

                {/* Skill Breakdown */}
                {assessmentResult.skillBreakdown && assessmentResult.skillBreakdown.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Skill Mastery Breakdown
                    </h4>
                    <div className="space-y-2">
                      {assessmentResult.skillBreakdown.map((sb, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                            isDark ? "bg-zinc-800/50 border-zinc-800" : "bg-slate-50 border-slate-200"
                          }`}
                        >
                          <span className="font-semibold">{sb.skill}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-bold">{sb.scorePercentage}%</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                sb.status === "Strong"
                                  ? "bg-emerald-500/15 text-emerald-500"
                                  : sb.status === "Good"
                                  ? "bg-blue-500/15 text-blue-500"
                                  : "bg-amber-500/15 text-amber-500"
                              }`}
                            >
                              {sb.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Revision */}
                {assessmentResult.recommendations && assessmentResult.recommendations.length > 0 && (
                  <div
                    className={`p-4 rounded-xl border ${
                      isDark ? "bg-amber-950/20 border-amber-900/30 text-amber-200" : "bg-amber-50 border-amber-200 text-amber-800"
                    }`}
                  >
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <FiZap /> Recommended Revision
                    </h4>
                    <ul className="space-y-1 text-xs">
                      {assessmentResult.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span>•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setIsAssessmentOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Return to Roadmap
                  </button>
                  <Link
                    to="/profile"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold border border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 flex items-center gap-1"
                  >
                    View in Profile &rarr;
                  </Link>
                </div>
              </div>
            ) : assessmentData?.questions ? (
              /* Questions Stepper */
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
                      {assessmentData.goal} Final Assessment
                    </span>
                    <h3 className="font-extrabold text-sm">
                      Question {currentQIndex + 1} of {assessmentData.questions.length}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsAssessmentOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <FiX size={18} />
                  </button>
                </div>

                {/* Question Text */}
                <div className="space-y-4">
                  <h4 className="text-base font-bold leading-relaxed">
                    {assessmentData.questions[currentQIndex].question}
                  </h4>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {assessmentData.questions[currentQIndex].options.map((opt, optIdx) => {
                      const isSelected = assessmentAnswers[currentQIndex] === optIdx;
                      return (
                        <div
                          key={optIdx}
                          onClick={() =>
                            setAssessmentAnswers((prev) => ({
                              ...prev,
                              [currentQIndex]: optIdx,
                            }))
                          }
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                            isSelected
                              ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20"
                              : isDark
                              ? "border-zinc-800 bg-zinc-800/40 hover:border-zinc-700"
                              : "border-slate-200 bg-slate-50 hover:border-slate-300"
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : isDark
                                ? "bg-zinc-700 text-zinc-300"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="text-xs sm:text-sm font-medium leading-relaxed">{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Stepper Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-zinc-800">
                  <button
                    disabled={currentQIndex === 0}
                    onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border disabled:opacity-30"
                  >
                    Previous
                  </button>

                  {currentQIndex < assessmentData.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQIndex((prev) => prev + 1)}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Next &rarr;
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitAssessment}
                      className="px-6 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
                    >
                      Submit Assessment <FiCheckCircle />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-400 mb-4">Could not load assessment questions.</p>
                <button
                  onClick={() => setIsAssessmentOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GeneratedRoadmap;
