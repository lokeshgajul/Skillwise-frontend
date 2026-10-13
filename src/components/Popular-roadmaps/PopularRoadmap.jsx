import React, { useContext } from "react";
import { Link } from "react-router-dom";
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
      <h2 className="text-xl font-bold tracking-tight mb-4">Popular Learning Paths:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {POPULAR_PATHS.map((item, index) => (
          <div
            key={index}
            className={`${
              isDark ? "bg-zinc-900 border-zinc-800 text-gray-100" : "bg-white border-slate-200 text-slate-800"
            } border drop-shadow-sm hover:drop-shadow-lg transition-all rounded-xl flex flex-col justify-between overflow-hidden`}
          >
            <div>
              <div className="w-full h-36 overflow-hidden bg-slate-100 dark:bg-zinc-800">
                <img
                  src={ReactImg}
                  alt={item.title}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4 space-y-2">
                <h3 className="text-sm font-bold leading-snug line-clamp-2">
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
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                Assess First
              </Link>
              <Link
                to={`/generated-roadmap?goal=${encodeURIComponent(item.goal)}`}
                className="text-blue-600 font-bold hover:underline"
              >
                Start Learning &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularRoadmaps;
