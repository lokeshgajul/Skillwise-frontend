import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { ThemeContext } from "../../../context/ThemeContext";
import Header from "../header/Header";
import { FiAlertCircle, FiEye, FiEyeOff, FiLoader } from "react-icons/fi";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const { SignIn, checkAuth } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSubmitting(true);
    try {
      const result = await SignIn(email, password);
      if (result) {
        await checkAuth();
        navigate("/");
      } else {
        setLocalError("Invalid email or password. Please try again.");
      }
    } catch (error) {
      setLocalError(error.message || "Sign in failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <form
          autoComplete="off"
          onSubmit={handleLogin}
          className={`sw-card w-full max-w-md p-8 space-y-5 ${
            isDark ? "" : "shadow-xl shadow-slate-200/50"
          }`}
        >
          <div className="text-center">
            <span className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg mb-3">
              S
            </span>
            <h1
              className={`text-2xl font-bold tracking-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Welcome back
            </h1>
            <p
              className={`text-sm mt-1 ${
                isDark ? "text-zinc-400" : "text-slate-500"
              }`}
            >
              Sign in to continue your learning journey
            </p>
          </div>

          {localError && (
            <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-500">
              <FiAlertCircle className="mt-0.5 shrink-0" size={15} />
              <span>{localError}</span>
            </div>
          )}

          <div>
            <label className="sw-label" htmlFor="signin-email">
              Email
            </label>
            <input
              id="signin-email"
              type="email"
              name="email"
              autoComplete="email"
              className="sw-input autofill-fix"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="sw-label" htmlFor="signin-password">
              Password
            </label>
            <div className="relative">
              <input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                className="sw-input autofill-fix pr-11"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${
                  isDark ? "text-zinc-500" : "text-slate-400"
                }`}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="sw-btn-primary" disabled={submitting}>
            {submitting ? (
              <>
                <FiLoader className="animate-spin" size={15} /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <p
            className={`text-sm text-center ${
              isDark ? "text-zinc-400" : "text-slate-500"
            }`}
          >
            New to SkillWise?{" "}
            <Link to="/signup" className="text-blue-500 hover:text-blue-400 font-medium">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signin;
