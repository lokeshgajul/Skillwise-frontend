import React, { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { roadmapService } from "../../services/api";
import useVideos from "../../hooks/usevideos";
import VideoDetails from "../../components/video-details/VideoDetails";
import VideoList from "../../components/video-list/VideoList";
import { FiArrowLeft, FiPlay, FiVideo } from "react-icons/fi";

const Video = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [searchParam] = useSearchParams();
  const urlGoal = searchParam.get("goal");
  const roadmapId = searchParam.get("id");

  const [roadmap, setRoadmap] = useState(null);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const loadRoadmap = async () => {
      try {
        let doc = null;
        if (roadmapId) {
          const data = await roadmapService.getRoadmapById(roadmapId);
          doc = data?.roadmap || null;
        } else {
          const data = await roadmapService.getActive();
          doc = data?.activeRoadmap || null;
        }
        setRoadmap(doc);
        setModules(doc?.modules || []);
      } catch (err) {
        console.error("Failed to load roadmap for videos:", err);
        setRoadmap(null);
        setModules([]);
      }
    };
    loadRoadmap();
  }, [roadmapId]);

  const searchGoal = urlGoal || roadmap?.goal || "";
  const [videos] = useVideos(searchGoal);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    if (videos?.length > 0) {
      setSelectedVideo(videos[0]);
    }
  }, [videos]);

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-2 pt-28 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <Link
            to={roadmap ? `/generated-roadmap?id=${roadmap._id}` : "/"}
            className={`inline-flex items-center gap-1.5 text-sm mb-2 transition-colors ${
              isDark ? "text-zinc-400 hover:text-blue-400" : "text-slate-500 hover:text-blue-600"
            }`}
          >
            <FiArrowLeft size={14} /> Back to roadmap
          </Link>
          <h1
            className={`text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            <FiPlay className="text-blue-500" />
            Learning:{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent capitalize">
              {searchGoal || "Explore videos"}
            </span>
          </h1>
          {roadmap?.title && (
            <p className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
              {roadmap.title}
            </p>
          )}
        </div>
      </div>

      <VideoDetails
        video={selectedVideo}
        modules={modules}
        isDark={isDark}
      />

      <div className="mt-10">
        <h3
          className={`text-lg font-semibold tracking-wide flex items-center gap-2 mb-4 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          <FiVideo className="text-indigo-500" /> Related Videos
        </h3>
        {videos.length === 0 ? (
          <div
            className={`rounded-2xl border p-10 text-center ${
              isDark
                ? "bg-zinc-900/60 border-zinc-800 text-zinc-400"
                : "bg-white/80 border-slate-200 text-slate-500"
            }`}
          >
            {searchGoal
              ? "Searching for learning videos..."
              : "Generate a roadmap first so we can curate videos for your goal."}
          </div>
        ) : (
          <VideoList videos={videos} onVideoSelect={setSelectedVideo} isDark={isDark} />
        )}
      </div>
    </div>
  );
};

export default Video;
