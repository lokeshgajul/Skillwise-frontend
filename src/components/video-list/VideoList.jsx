import React from "react";
import VideoItem from "../video-item/VideoItem";

const VideoList = ({ onVideoSelect, videos = [], isDark = false }) => {
  return (
    <div className="video-previews-list grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {videos.map((video) => (
        <VideoItem
          key={video.id?.videoId || video.id}
          onVideoSelect={onVideoSelect}
          video={video}
          isDark={isDark}
        />
      ))}
    </div>
  );
};

export default VideoList;
