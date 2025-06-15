import React from "react";

const VideoDetails = ({ video }) => {
  if (!video) {
    return <div>Loading Videos...</div>;
  }

  const videoSrc = `https://www.youtube.com/embed/${video.id.videoId}`;
  return (
    <div>
      {/* Here you would embed your YouTube player or fetch video details based on videoId */}

      <div className="lg:w-[100%] flex justify-start mx-auto h-[500px] rounded-md overflow-hidden ">
        <iframe
          width="800"
          height="480"
          src={videoSrc}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video player"
        ></iframe>
      </div>

      <div className="video-description px-2 mx-auto">
        <h2 className="text-lg sm:text-xl font-semibold tracking-wide">
          {video.snippet.title}
        </h2>
        <p className="text-sm sm:text-base tracking-wide pt-1 text-gray-700 dark:text-gray-300">
          {video.snippet.description}
        </p>
      </div>
    </div>
  );
};

export default VideoDetails;
