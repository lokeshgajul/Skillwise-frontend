import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import ReactImg from "../../assets/images/React.png";
import { ThemeContext } from "../../context/ThemeContext";

const POPULAR_PATHS = [
  {
    title: "Full Stack Web Developer",
    desc: "Master modern HTML/CSS, React, Node.js, REST APIs, and database engineering.",
    goal: "Full Stack Web Developer",
  },
  {
    title: "Frontend React Specialist",
    desc: "Deep dive into component patterns, state management, hooks, and performance.",
    goal: "Frontend React Specialist",
  },
  {
    title: "AI & Machine Learning Engineer",
    desc: "From Python fundamentals and data pipelines to PyTorch and generative AI models.",
    goal: "AI & Machine Learning Engineer",
  },
  {
    title: "Cloud & DevOps Infrastructure",
    desc: "Automate CI/CD pipelines, containerize with Docker, and orchestrate with Kubernetes.",
    goal: "DevOps Engineer",
  },
];

const PopularRoadmaps = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <div className="p-7 max-w-6xl mx-auto">
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-blue-500 bg-blue-500/10 border border-blue-500/20">
          Popular
        </span>
        <h2 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight">
          Popular Learning Paths
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {POPULAR_PATHS.map((item, index) => (
          <div
            key={index}
            className={`group rounded-2xl border overflow-hidden flex flex-col justify-between transition-all hover:shadow-lg hover:scale-[1.02] ${
              isDark
                ? "bg-zinc-900/90 border-zinc-800 backdrop-blur-md shadow-black/20 text-gray-100 hover:border-blue-500/40"
                : "bg-white/90 border-slate-200 backdrop-blur-md shadow-slate-200/50 text-slate-800 hover:border-blue-400/50"
            }`}
          >
            <div>
              <div
                className={`relative w-full h-36 overflow-hidden ${
                  isDark ? "bg-zinc-800" : "bg-slate-100"
                }`}
              >
                <img
                  src={ReactImg}
                  alt={item.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-blue-600 text-white shadow-md shadow-blue-500/25">
                  Path {index + 1}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="text-sm font-bold leading-snug line-clamp-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 flex justify-between items-center text-xs">
              <Link
                to={`/assessment`}
                className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 font-medium transition-colors"
              >
                Assess First
              </Link>
              <Link
                to={`/generated-roadmap?goal=${encodeURIComponent(item.goal)}`}
                className="inline-flex items-center gap-1 font-bold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 group-hover:gap-1.5 transition-all"
              >
                Start Learning <FiArrowRight size={13} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularRoadmaps;
