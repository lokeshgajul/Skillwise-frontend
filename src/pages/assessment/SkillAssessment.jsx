import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCompass,
  FiTarget,
  FiAward,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiArrowLeft,
  FiClock,
  FiBookOpen,
  FiPlus,
  FiX,
  FiZap,
  FiRefreshCw,
} from "react-icons/fi";
import { ThemeContext } from "../../context/ThemeContext";
import { ContentContext } from "../../context/ContentContext";
import { assessmentService } from "../../services/api";

const PRESET_GOALS = [
  "Full Stack Web Developer",
  "Frontend React Specialist",
  "Backend Node.js & Cloud Engineer",
  "AI & Machine Learning Engineer",
  "Data Scientist & Analyst",
  "Mobile App Developer (React Native)",
  "DevOps & Infrastructure Engineer",
];

const SKILL_SUGGESTIONS = {
  "Full Stack Web Developer": [
    "HTML & CSS",
    "JavaScript (ES6+)",
    "React",
    "Node.js & Express",
    "MongoDB / SQL",
    "RESTful APIs",
    "Git & GitHub",
  ],
  "Frontend React Specialist": [
    "HTML5 / Semantic HTML",
    "Modern CSS & Tailwind",
    "JavaScript Core",
    "React Hooks & State",
    "TypeScript",
    "Redux / Context API",
    "Next.js Basics",
  ],
  "Backend Node.js & Cloud Engineer": [
    "JavaScript / Node.js",
    "Express.js",
    "PostgreSQL / MongoDB",
    "Authentication (JWT)",
    "Docker Basics",
    "AWS / Cloud Fundamentals",
    "API Security",
  ],
  "AI & Machine Learning Engineer": [
    "Python Programming",
    "NumPy & Pandas",
    "Math & Linear Algebra",
    "Scikit-Learn",
    "TensorFlow / PyTorch",
    "Deep Learning Concepts",
    "Data Preprocessing",
  ],
};

const SkillAssessment = () => {
  const { theme } = useContext(ThemeContext);
  const { setGoal } = useContext(ContentContext);
  const navigate = useNavigate();

  // Wizard state: 1 = Goal & Style, 2 = Experience & Skills, 3 = Diagnostic Quiz, 4 = Report
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Goals & Preferences
  const [targetGoal, setTargetGoal] = useState("");
  const [careerTarget, setCareerTarget] = useState("Land First Tech Job");
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [learningStyle, setLearningStyle] = useState("hands_on");

  // Step 2: Experience & Skills Matrix
  const [experienceLevel, setExperienceLevel] = useState("beginner");
  const [skillsMatrix, setSkillsMatrix] = useState([]);
  const [customSkillInput, setCustomSkillInput] = useState("");

  // Step 3: Diagnostic Quiz
  const [diagnosticQuestions, setDiagnosticQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // Step 4: Assessment Result Report
  const [assessmentResult, setAssessmentResult] = useState(null);

  // Initialize or update skill matrix when goal changes
  useEffect(() => {
    if (targetGoal) {
      const suggestions =
        SKILL_SUGGESTIONS[targetGoal] || [
          "Core Syntax",
          "Problem Solving",
          "Project Architecture",
          "Version Control",
          "Debugging Skills",
        ];
      const initialSkills = suggestions.map((name) => ({
        skillName: name,
        claimedLevel: "none",
      }));
      setSkillsMatrix(initialSkills);
    }
  }, [targetGoal]);

  // Load existing latest assessment if user visits page
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const data = await assessmentService.getLatest();
        if (data.success && data.assessment) {
          // If they already have an assessment, we can offer to view it
          setAssessmentResult(data.assessment);
        }
      } catch (err) {
        console.error("Could not fetch latest assessment:", err);
      }
    };
    fetchLatest();
  }, []);

  // Update skill matrix rating
  const handleSkillLevelChange = (skillName, level) => {
    setSkillsMatrix((prev) =>
      prev.map((s) => (s.skillName === skillName ? { ...s, claimedLevel: level } : s))
    );
  };

  // Add custom skill
  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    if (!customSkillInput.trim()) return;
    const exists = skillsMatrix.some(
      (s) => s.skillName.toLowerCase() === customSkillInput.trim().toLowerCase()
    );
    if (!exists) {
      setSkillsMatrix((prev) => [
        ...prev,
        { skillName: customSkillInput.trim(), claimedLevel: "basic" },
      ]);
    }
    setCustomSkillInput("");
  };

  // Remove skill
  const handleRemoveSkill = (skillName) => {
    setSkillsMatrix((prev) => prev.filter((s) => s.skillName !== skillName));
  };

  // Step 2 -> Step 3: Generate diagnostic quiz via Gemini
  const handleProceedToQuiz = async () => {
    if (!targetGoal.trim()) {
      setError("Please select or enter a target learning goal");
      return;
    }
    setError("");
    setQuizLoading(true);
    setCurrentStep(3);

    try {
      const data = await assessmentService.generateQuestions(
        targetGoal,
        experienceLevel,
        skillsMatrix
      );
      if (data.questions && data.questions.length > 0) {
        setDiagnosticQuestions(data.questions);
      }
    } catch (err) {
      console.error("Quiz generation error:", err);
      setError("Could not load AI questions, using baseline questions.");
    } finally {
      setQuizLoading(false);
    }
  };

  // Answer selection in quiz
  const handleSelectAnswer = (qIndex, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIndex]: optionIndex,
    }));
  };

  // Submit assessment and get evaluation report
  const handleSubmitAssessment = async () => {
    setLoading(true);
    setError("");

    try {
      const formattedQuiz = diagnosticQuestions.map((q, idx) => ({
        id: q.id ?? idx + 1,
        selectedAnswer: selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : -1,
      }));

      const payload = {
        targetGoal,
        careerTarget,
        experienceLevel,
        weeklyHours: Number(weeklyHours),
        learningStyle,
        skillsMatrix,
        diagnosticQuiz: formattedQuiz,
      };

      const res = await assessmentService.evaluate(payload);
      if (res.success && res.assessment) {
        setAssessmentResult(res.assessment);
        setCurrentStep(4);
      }
    } catch (err) {
      console.error("Evaluation error:", err);
      setError("Failed to evaluate assessment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Transition to Generate Roadmap directly with context
  const handleGenerateRoadmapFromAssessment = async () => {
    if (assessmentResult?.targetGoal) {
      setGoal(assessmentResult.targetGoal);
      navigate(`/generated-roadmap?goal=${encodeURIComponent(assessmentResult.targetGoal)}`);
    }
  };

  // Retake or restart assessment
  const handleRetake = () => {
    setAssessmentResult(null);
    setCurrentStep(1);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDark ? "bg-[#18181b] text-gray-100" : "bg-slate-50 text-slate-800"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Top Header Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <FiZap className="animate-pulse" /> AI Skill & Experience Profiler
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Assess Your Current Skills & Experience
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Our AI analyzes your background, claimed skills, and technical baseline to pinpoint knowledge gaps and build a truly personalized learning curve.
          </p>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[
              { num: 1, label: "Goal" },
              { num: 2, label: "Skill Matrix" },
              { num: 3, label: "AI Diagnostic" },
              { num: 4, label: "Report" },
            ].map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm ${
                      currentStep === step.num
                        ? "bg-blue-600 text-white ring-4 ring-blue-500/20"
                        : currentStep > step.num
                        ? "bg-emerald-500 text-white"
                        : isDark
                        ? "bg-zinc-800 text-zinc-400 border border-zinc-700"
                        : "bg-slate-200 text-slate-500 border border-slate-300"
                    }`}
                  >
                    {currentStep > step.num ? <FiCheckCircle /> : step.num}
                  </div>
                  <span className="text-xs font-medium mt-1.5 hidden sm:block">
                    {step.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded-full transition-colors duration-300 ${
                      currentStep > step.num
                        ? "bg-emerald-500"
                        : isDark
                        ? "bg-zinc-800"
                        : "bg-slate-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2 text-sm">
            <FiAlertCircle className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Wizard Steps Container */}
        <div
          className={`rounded-2xl p-6 sm:p-8 shadow-xl border backdrop-blur-sm transition-all duration-300 ${
            isDark
              ? "bg-zinc-900/90 border-zinc-800 shadow-black/40"
              : "bg-white/90 border-slate-200 shadow-slate-200/50"
          }`}
        >
          {/* STEP 1: Goal, Career Objective, Time & Learning Style */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FiTarget className="text-blue-500" /> What is your primary learning goal?
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Choose a popular path or type any custom tech domain you wish to master.
                </p>

                {/* Preset Goals Chips */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {PRESET_GOALS.map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setTargetGoal(goal)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                        targetGoal === goal
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                          : isDark
                          ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>

                <div className="mt-3">
                  <input
                    type="text"
                    value={targetGoal}
                    onChange={(e) => setTargetGoal(e.target.value)}
                    placeholder="e.g. Senior Backend Engineer with Go & Microservices"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      isDark
                        ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                    }`}
                  />
                </div>
              </div>

              {/* Career Target */}
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <FiCompass className="text-blue-500" /> What is your career objective?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { title: "Land First Tech Job", desc: "Break into the industry from scratch" },
                    { title: "Career Transition", desc: "Pivot from non-tech or another field" },
                    { title: "Promotion / Level Up", desc: "Advance to Mid/Senior engineering level" },
                    { title: "Build Side Projects / Startup", desc: "Ship independent products & SaaS" },
                  ].map((item) => (
                    <div
                      key={item.title}
                      onClick={() => setCareerTarget(item.title)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        careerTarget === item.title
                          ? "border-blue-500 ring-2 ring-blue-500/20 " +
                            (isDark ? "bg-blue-900/20" : "bg-blue-50")
                          : isDark
                          ? "border-zinc-800 bg-zinc-800/40 hover:border-zinc-700"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className="font-semibold text-sm">{item.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commitment & Learning Style */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                    <FiClock className="text-blue-500" /> Weekly Time Commitment
                  </label>
                  <div className="flex gap-2">
                    {[
                      { hours: 5, label: "5 hrs/wk (Casual)" },
                      { hours: 10, label: "10 hrs/wk (Steady)" },
                      { hours: 20, label: "20+ hrs/wk (Intensive)" },
                    ].map((h) => (
                      <button
                        key={h.hours}
                        type="button"
                        onClick={() => setWeeklyHours(h.hours)}
                        className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                          weeklyHours === h.hours
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : isDark
                            ? "border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-750"
                            : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                    <FiBookOpen className="text-blue-500" /> Preferred Learning Style
                  </label>
                  <select
                    value={learningStyle}
                    onChange={(e) => setLearningStyle(e.target.value)}
                    className={`w-full py-2.5 px-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark
                        ? "bg-zinc-800 border-zinc-700 text-white"
                        : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  >
                    <option value="hands_on">Hands-on Real Projects & Code</option>
                    <option value="visual_video">Video Tutorials & Visual Walkthroughs</option>
                    <option value="interactive_quiz">Interactive Coding & Flash Quizzes</option>
                    <option value="docs_reading">Deep Technical Docs & Case Studies</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!targetGoal.trim()}
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
                >
                  Next: Skill Matrix <FiArrowRight />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Experience Level & Skill Matrix */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FiAward className="text-blue-500" /> What is your overall technical experience?
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Be candid — this helps calibrate your learning pace and skip redundant basics.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  {[
                    { id: "beginner", title: "Complete Beginner", desc: "No prior coding or technical background" },
                    { id: "elementary", title: "Elementary", desc: "Know basic syntax & core concepts" },
                    { id: "intermediate", title: "Intermediate", desc: "Built functional small-to-medium apps" },
                    { id: "advanced", title: "Advanced / Pro", desc: "Production experience, seeking mastery" },
                  ].map((lvl) => (
                    <div
                      key={lvl.id}
                      onClick={() => setExperienceLevel(lvl.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all text-center flex flex-col justify-between ${
                        experienceLevel === lvl.id
                          ? "border-blue-500 ring-2 ring-blue-500/20 " +
                            (isDark ? "bg-blue-900/25" : "bg-blue-50")
                          : isDark
                          ? "border-zinc-800 bg-zinc-800/40 hover:border-zinc-700"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className="font-semibold text-sm">{lvl.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{lvl.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Skill Matrix */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-base font-bold">Rate your comfort with key skills</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Rate individual skills so the AI knows where you need reinforcement.
                    </p>
                  </div>

                  {/* Add Custom Skill Form */}
                  <form onSubmit={handleAddCustomSkill} className="flex gap-2">
                    <input
                      type="text"
                      value={customSkillInput}
                      onChange={(e) => setCustomSkillInput(e.target.value)}
                      placeholder="Add another skill..."
                      className={`px-3 py-1.5 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-slate-50 border-slate-300 text-slate-800"
                      }`}
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <FiPlus /> Add
                    </button>
                  </form>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {skillsMatrix.map((skill) => (
                    <div
                      key={skill.skillName}
                      className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isDark ? "bg-zinc-800/60 border-zinc-700/80" : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{skill.skillName}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill.skillName)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          title="Remove skill"
                        >
                          <FiX size={14} />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[
                          { id: "none", label: "No Knowledge" },
                          { id: "basic", label: "Basics" },
                          { id: "intermediate", label: "Comfortable" },
                          { id: "proficient", label: "Proficient" },
                        ].map((tier) => (
                          <button
                            key={tier.id}
                            type="button"
                            onClick={() => handleSkillLevelChange(skill.skillName, tier.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                              skill.claimedLevel === tier.id
                                ? tier.id === "none"
                                  ? "bg-zinc-500 text-white"
                                  : tier.id === "basic"
                                  ? "bg-amber-500 text-white"
                                  : tier.id === "intermediate"
                                  ? "bg-blue-500 text-white"
                                  : "bg-emerald-500 text-white"
                                : isDark
                                ? "bg-zinc-700/60 text-zinc-300 hover:bg-zinc-700"
                                : "bg-slate-200/70 text-slate-700 hover:bg-slate-200"
                            }`}
                          >
                            {tier.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                    isDark
                      ? "border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-750"
                      : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <FiArrowLeft /> Back
                </button>
                <button
                  type="button"
                  onClick={handleProceedToQuiz}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
                >
                  Start AI Diagnostic <FiArrowRight />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Adaptive AI Diagnostic Quiz */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {quizLoading ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <h3 className="text-lg font-bold">Gemini is Generating Custom Questions...</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                    Calibrating 3 targeted diagnostic questions based on "{targetGoal}" and your selected skill matrix.
                  </p>
                </div>
              ) : diagnosticQuestions.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-500 flex items-center gap-1.5">
                      <FiZap /> AI Diagnostic Question {currentQuestionIndex + 1} of{" "}
                      {diagnosticQuestions.length}
                    </span>
                    <button
                      type="button"
                      onClick={handleSubmitAssessment}
                      className="text-xs text-gray-400 hover:text-blue-500 underline"
                    >
                      Skip & Evaluate Directly
                    </button>
                  </div>

                  {/* Question Card */}
                  <div
                    className={`p-5 sm:p-6 rounded-xl border mb-6 ${
                      isDark ? "bg-zinc-800/50 border-zinc-700/80" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <h3 className="text-base sm:text-lg font-bold mb-4 leading-relaxed">
                      {diagnosticQuestions[currentQuestionIndex].question}
                    </h3>

                    <div className="space-y-3">
                      {diagnosticQuestions[currentQuestionIndex].options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectAnswer(currentQuestionIndex, optIdx)}
                            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                              isSelected
                                ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20"
                                : isDark
                                ? "border-zinc-700 bg-zinc-800/70 hover:border-zinc-600"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                                isSelected
                                  ? "bg-blue-600 text-white"
                                  : isDark
                                  ? "bg-zinc-700 text-zinc-300"
                                  : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="text-sm font-medium leading-relaxed">{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Question Navigation */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border disabled:opacity-40 ${
                        isDark
                          ? "border-zinc-700 bg-zinc-800 text-zinc-300"
                          : "border-slate-300 bg-slate-100 text-slate-700"
                      }`}
                    >
                      <FiArrowLeft /> Previous
                    </button>

                    {currentQuestionIndex < diagnosticQuestions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentQuestionIndex((prev) =>
                            Math.min(diagnosticQuestions.length - 1, prev + 1)
                          )
                        }
                        className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 cursor-pointer"
                      >
                        Next Question <FiArrowRight />
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={loading}
                        onClick={handleSubmitAssessment}
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/25 cursor-pointer"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Evaluating Baseline...
                          </>
                        ) : (
                          <>
                            Generate Skill Profile <FiCheckCircle />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 mb-4">No diagnostic questions available.</p>
                  <button
                    onClick={handleSubmitAssessment}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold"
                  >
                    Proceed with Experience Rating
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 4: Comprehensive AI Diagnostic Profile & Readiness Report */}
          {currentStep === 4 && assessmentResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Top Banner with Readiness Score */}
              <div
                className={`p-6 sm:p-8 rounded-2xl border text-center relative overflow-hidden ${
                  isDark
                    ? "bg-gradient-to-b from-blue-950/40 via-zinc-900 to-zinc-900 border-blue-900/50"
                    : "bg-gradient-to-b from-blue-50 via-white to-white border-blue-200"
                }`}
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 mb-3">
                  <FiCheckCircle /> Assessment Completed & Saved
                </div>

                <h2 className="text-2xl sm:text-3xl font-black capitalize">
                  {assessmentResult.targetGoal}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Target Level:{" "}
                  <span className="font-semibold capitalize text-blue-500">
                    {assessmentResult.experienceLevel}
                  </span>{" "}
                  • Commitment:{" "}
                  <span className="font-semibold text-blue-500">
                    {assessmentResult.weeklyHours} hrs/week
                  </span>
                </p>

                {/* Readiness Circular / Radial Meter */}
                <div className="my-6 flex flex-col items-center justify-center">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        className={`stroke-current ${isDark ? "text-zinc-800" : "text-slate-200"}`}
                        strokeWidth="10"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        className="stroke-current text-blue-500 transition-all duration-1000 ease-out"
                        strokeWidth="10"
                        strokeDasharray={264}
                        strokeDashoffset={264 - (264 * (assessmentResult.readinessScore || 50)) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-extrabold tracking-tight">
                        {assessmentResult.readinessScore}%
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Readiness</span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-500 mt-2">
                    Recommended Starting Point:{" "}
                    <span className="text-emerald-500 font-bold">
                      {assessmentResult.recommendedStartingPhase}
                    </span>
                  </p>
                </div>

                {/* AI Executive Feedback */}
                <div
                  className={`p-4 rounded-xl border text-left max-w-2xl mx-auto text-sm leading-relaxed ${
                    isDark ? "bg-zinc-800/70 border-zinc-700 text-zinc-200" : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-blue-500 mb-1.5">
                    <FiZap /> AI Copilot Evaluation
                  </div>
                  <p>{assessmentResult.aiSummary}</p>
                </div>
              </div>

              {/* Strengths vs Critical Gaps 2-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Confirmed Strengths */}
                <div
                  className={`p-5 rounded-2xl border ${
                    isDark ? "bg-zinc-800/40 border-zinc-800" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-2 mb-3">
                    <FiCheckCircle size={16} /> Confirmed Strengths & Foundations
                  </h3>
                  <ul className="space-y-2.5">
                    {assessmentResult.strengths?.map((strength, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                        <span className="leading-snug">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Critical Knowledge Gaps */}
                <div
                  className={`p-5 rounded-2xl border ${
                    isDark ? "bg-zinc-800/40 border-zinc-800" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2 mb-3">
                    <FiAlertCircle size={16} /> Targeted Knowledge Gaps to Bridge
                  </h3>
                  <ul className="space-y-2.5">
                    {assessmentResult.gaps?.map((gap, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                        <span className="leading-snug">{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleRetake}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border transition-all ${
                    isDark
                      ? "border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-750"
                      : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <FiRefreshCw /> Retake Assessment
                </button>

                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    className={`flex-1 sm:flex-initial px-5 py-3 rounded-xl text-sm font-semibold border transition-all ${
                      isDark
                        ? "border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-750"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    View in Profile
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateRoadmapFromAssessment}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-xl shadow-blue-500/25 cursor-pointer"
                  >
                    Generate Tailored Roadmap <FiArrowRight />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillAssessment;
