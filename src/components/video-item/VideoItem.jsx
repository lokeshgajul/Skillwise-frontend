import React from "react";

const VideoItem = ({ video, onVideoSelect }) => {
  return (
    <>
      <div
        onClick={() => onVideoSelect(video)}
        className="video-item item lg:w-[260px] lg:h-[300px] flex flex-col justify-start items-start mt-3 cursor-pointer px-2"
      >
        <img
          className="image rounded-md w-full"
          src={video.snippet.thumbnails.medium.url}
          alt={video.snippet.title}
        />
        <div className="content ">
          <h3 className="header mt-2 mb-2 w-fit text-[15.5px]  font-medium tracking-wider">
            {video.snippet.title}
          </h3>
          <h3 className="header mb-2 text-[14px] w-fit font-normal text-black tracking-wider">
            {video.snippet.description}
          </h3>
        </div>
      </div>
    </>
  );
};

export default VideoItem;
