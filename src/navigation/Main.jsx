import React, { useContext } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import Signin from "../pages/auth/SignIn/Signin";
import Signup from "../pages/auth/SignUp/Signup";
import Home from "../pages/home/Home";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import GeneratedRoadmap from "../pages/generated-roadmaps/GeneratedRoadmap";
import Video from "../pages/videos/Video";
import LandingPage from "../pages/auth/landing-page/LandingPage";
import Profile from "../pages/profile/Profile";
import SkillAssessment from "../pages/assessment/SkillAssessment";

const WrappedApp = () => {
  const { loading, isAuthenticated } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold tracking-wide text-gray-500 dark:text-gray-400">
            Initializing SkillWise...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {isAuthenticated && <Navbar />}

      <main className="flex-1">
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/assessment" element={<SkillAssessment />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/videos/:videoId" element={<Video />} />
              <Route path="/generated-roadmap" element={<GeneratedRoadmap />} />
              <Route path="/signin" element={<Navigate to="/" replace />} />
              <Route path="/signup" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/signin" replace />} />
            </>
          )}
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default function Main() {
  return (
    <Router>
      <WrappedApp />
    </Router>
  );
}
