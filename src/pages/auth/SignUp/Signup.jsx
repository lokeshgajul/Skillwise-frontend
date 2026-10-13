import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { ThemeContext } from "../../../context/ThemeContext";
import Header from "../header/Header";
import { FiAlertCircle, FiEye, FiEyeOff, FiLoader } from "react-icons/fi";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { SignUp } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    try {
      await SignUp(username, email, password);
      navigate("/signin");
    } catch (error) {
      setLocalError(error.message || "Signup failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <form
          onSubmit={handleSignup}
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
              Create your account
            </h1>
            <p
              className={`text-sm mt-1 ${
                isDark ? "text-zinc-400" : "text-slate-500"
              }`}
            >
              Start your AI-powered learning journey today
            </p>
          </div>

          {localError && (
            <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-500">
              <FiAlertCircle className="mt-0.5 shrink-0" size={15} />
              <span>{localError}</span>
            </div>
          )}

          <div>
            <label className="sw-label" htmlFor="signup-username">
              Username
            </label>
            <input
              id="signup-username"
              type="text"
              name="username"
              autoComplete="username"
              className="sw-input autofill-fix"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="sw-label" htmlFor="signup-email">
              Email
            </label>
            <input
              id="signup-email"
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
            <label className="sw-label" htmlFor="signup-password">
              Password
            </label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                minLength={6}
                className="sw-input autofill-fix pr-11"
                placeholder="At least 6 characters"
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
                <FiLoader className="animate-spin" size={15} /> Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <p
            className={`text-sm text-center ${
              isDark ? "text-zinc-400" : "text-slate-500"
            }`}
          >
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-500 hover:text-blue-400 font-medium">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
