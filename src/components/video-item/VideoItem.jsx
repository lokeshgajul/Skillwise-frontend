import React from "react";
import { FiPlay } from "react-icons/fi";

const VideoItem = ({ video, onVideoSelect, isDark = false }) => {
  const thumbnail =
    video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.default?.url;

  return (
    <div
      onClick={() => onVideoSelect(video)}
      className={`video-item flex flex-col rounded-2xl border overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg ${
        isDark
          ? "bg-zinc-900/90 border-zinc-800 hover:border-blue-500/40"
          : "bg-white/90 border-slate-200 hover:border-blue-400/50"
      }`}
    >
      <div className="relative">
        <img className="w-full aspect-video object-cover" src={thumbnail} alt={video.snippet?.title} />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-colors">
          <span className="opacity-0 hover:opacity-100 transition-opacity w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <FiPlay size={16} />
          </span>
        </div>
      </div>
      <div className="p-3">
        <h3
          className={`text-sm font-medium tracking-wide line-clamp-2 ${
            isDark ? "text-zinc-100" : "text-slate-800"
          }`}
        >
          {video.snippet?.title}
        </h3>
        <p
          className={`mt-1 text-xs line-clamp-2 ${
            isDark ? "text-zinc-500" : "text-slate-500"
          }`}
        >
          {video.snippet?.description}
        </p>
      </div>
    </div>
  );
};

export default VideoItem;
