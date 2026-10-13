import React, { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { Link } from "react-router-dom";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { FiZap } from "react-icons/fi";

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-md ${
        isDark
          ? "bg-zinc-950/80 border-zinc-800"
          : "bg-white/80 border-slate-200"
      }`}
    >
      <div className="mx-auto max-w-7xl flex justify-between items-center px-4 lg:px-8 py-3">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              S
            </span>
            <span className="text-lg font-bold tracking-tight text-gradient-brand">
              SkillWise
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-sm">
            <a
              href="#features"
              className={`transition-colors ${
                isDark
                  ? "text-zinc-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className={`transition-colors ${
                isDark
                  ? "text-zinc-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              How It Works
            </a>
            <a
              href="#faq"
              className={`transition-colors ${
                isDark
                  ? "text-zinc-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              FAQ
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`p-2 rounded-xl cursor-pointer transition-colors ${
              isDark
                ? "text-zinc-300 hover:bg-zinc-800"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {isDark ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
          </button>
          <Link
            to="/signup"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <FiZap size={14} /> Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
