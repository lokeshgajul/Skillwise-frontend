import React, { useContext, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link, useSearchParams } from "react-router-dom";
import { ContentContext } from "../../context/ContentContext";
import useVideos from "../../hooks/usevideos";
// import { ThemeContext } from "../context/ThemeContext";

const GeneratedRoadmap = () => {
  const { goal, roadmap, loading } = useContext(ContentContext);

  const [theme, setTheme] = useState("light");
  const [searchParam] = useSearchParams();

  const params = searchParam.get("goal");
  console.log("params", params);

  const [videos, search] = useVideos(goal || params);

  return (
    <div className="container px-6 lg:px-10 mt-4">
      <div>
        <span>Roadmaps / {goal}</span>
        <p className="mt-2">
          AI-generated roadmap for your goal{" "}
          <strong className="capitalize"> {goal}</strong>, focusing on key
          skills and resources.
        </p>
      </div>

      {loading ? (
        <Skeleton height={300} count={5} />
      ) : (
        roadmap && (
          <div
            className={`mt-6 p-4 rounded-md whitespace-pre-line ${
              theme === "dark"
                ? "bg-[#3C3D37] text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            <div>{roadmap}</div>
            <div className="text-right">
              <Link to="/progress" className="text-blue-800 hover:underline">
                Start Learning
              </Link>
            </div>
          </div>
        )
      )}

      <div>
        <h1>Learning Resources </h1>
      </div>
      <div>
        <span>YouTube</span>
        {/* <div className="video-description">
          {videos?.map((video, index) => {
            return (
              <div key={index} className="py-4">
                <h2 className="header py-0.5 font-medium">
                  {video.snippet?.title}
                </h2>
                <p className="pb-2 text-gray-600 text-[14px]">
                  {video.snippet?.description}
                </p>
                <button className="py-2 bg-blue-100 rounded-full text-sm px-3 hover:font-semibold">
                  <Link
                    to={{
                      pathname: `/videos/:${video.id.videoId}`,
                    }}
                  >
                    Watch
                  </Link>
                </button>
              </div>
            );
          })}
        </div> */}
      </div>
    </div>
  );
};

export default GeneratedRoadmap;
