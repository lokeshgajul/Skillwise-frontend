import React, { useContext } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { FiCompass, FiUser, FiLogOut, FiLayers, FiZap } from "react-icons/fi";
import { ThemeContext } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { isAuthenticated, user, signOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignout = () => {
    signOut();
    navigate("/signin");
  };

  const isDark = theme === "dark";

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-colors duration-200">
      <div
        className={`px-5 sm:px-8 py-3.5 flex items-center justify-between border-b backdrop-blur-md transition-colors ${
          isDark
            ? "bg-zinc-900/85 border-zinc-800 text-white"
            : "bg-white/85 border-slate-200 text-slate-800"
        }`}
      >
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              S
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              SkillWise
            </span>
          </Link>

          {/* Navigation Links */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname === "/"
                    ? "text-blue-600 font-semibold bg-blue-500/10"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/assessment"
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  location.pathname === "/assessment"
                    ? "text-blue-600 font-semibold bg-blue-500/10"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white"
                }`}
              >
                <FiZap className="text-amber-500" />
                <span>Skill Assessment</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-500">
                  AI
                </span>
              </Link>
              <Link
                to="/profile"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname === "/profile"
                    ? "text-blue-600 font-semibold bg-blue-500/10"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white"
                }`}
              >
                Profile & Growth
              </Link>
            </nav>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-colors ${
              isDark
                ? "border-zinc-700 bg-zinc-800 text-amber-400 hover:bg-zinc-750"
                : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDark ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
          </button>

          {isAuthenticated ? (
            <Popover className="relative">
              <PopoverButton
                className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border text-xs font-semibold focus:outline-none transition-all cursor-pointer ${
                  isDark
                    ? "border-zinc-700 bg-zinc-800 hover:bg-zinc-750 text-white"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800"
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                  {user?.username ? user.username[0] : "U"}
                </div>
                <span className="hidden sm:inline capitalize">{user?.username || "Account"}</span>
              </PopoverButton>

              <PopoverPanel
                transition
                anchor="bottom end"
                className={`w-48 mt-2 p-1.5 rounded-xl border shadow-xl text-xs transition duration-150 ease-out z-50 ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 text-zinc-200"
                    : "bg-white border-slate-200 text-slate-800"
                }`}
              >
                <div className="px-3 py-2 border-b border-gray-100 dark:border-zinc-800 mb-1">
                  <div className="font-bold truncate capitalize">{user?.username || "Learner"}</div>
                  <div className="text-[11px] text-gray-500 truncate">{user?.email || ""}</div>
                </div>

                <Link
                  to="/assessment"
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-blue-500/10 hover:text-blue-500 transition-colors"
                >
                  <FiZap className="text-amber-500" />
                  <span>Skill Assessment</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-blue-500/10 hover:text-blue-500 transition-colors"
                >
                  <FiUser />
                  <span>My Profile</span>
                </Link>

                <button
                  onClick={handleSignout}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
                >
                  <FiLogOut />
                  <span>Log out</span>
                </button>
              </PopoverPanel>
            </Popover>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/signin"
                className="text-xs font-semibold px-3 py-2 rounded-lg hover:text-blue-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
