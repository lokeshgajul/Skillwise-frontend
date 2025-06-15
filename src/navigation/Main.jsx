import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Signin from "../pages/auth/SignIn/Signin";
import Signup from "../pages/auth/SignUp/Signup";
import Home from "../pages/home/Home";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import GeneratedRoadmap from "../pages/generated-roadmaps/GeneratedRoadmap";
import Video from "../pages/videos/Video";
import LandingPage from "../pages/landing-page/LandingPage";

const Main = () => {
  //   const { isAuthenticated, checkAuth } = useContext(AuthContext);

  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/landing" Component={LandingPage} />
        <Route path="/videos/:videoId" Component={Video} />
        <Route path="/generated-roadmap" Component={GeneratedRoadmap} />
        <Route path="/signin" Component={Signin} />
        <Route path="/signup" Component={Signup} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default Main;
