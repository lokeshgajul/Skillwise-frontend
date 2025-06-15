import React from "react";
import VideoItem from "../video-item/VideoItem";

const VideoList = ({ onVideoSelect, videos }) => {
  const renderList = videos.map((video) => {
    return (
      <VideoItem
        key={video.id.videoId}
        onVideoSelect={onVideoSelect}
        video={video}
      />
    );
  });

  return (
    <div>
      <div className="video-previews-list flex flex-row flex-wrap justify-start items-start gap-4">
        {renderList}
      </div>
    </div>
  );
};

export default VideoList;
