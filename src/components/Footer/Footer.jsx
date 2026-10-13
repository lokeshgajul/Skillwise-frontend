import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const Footer = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const year = new Date().getFullYear();

  return (
    <footer
      className={`w-full border-t backdrop-blur-md ${
        isDark
          ? "bg-zinc-950/80 border-zinc-800"
          : "bg-white/80 border-slate-200"
      }`}
    >
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-[11px]">
            S
          </span>
          <span
            className={`text-sm font-semibold tracking-tight ${
              isDark ? "text-zinc-200" : "text-slate-800"
            }`}
          >
            SkillWise
          </span>
        </div>
        <span className={`text-xs ${isDark ? "text-zinc-500" : "text-slate-500"}`}>
          All rights reserved © {year}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
