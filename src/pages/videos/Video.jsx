import React, { useContext, useEffect, useState } from "react";
import { ContentContext } from "../../context/ContentContext";
import useVideos from "../../hooks/usevideos";
import { useParams } from "react-router-dom";
import VideoDetails from "../../components/video-details/VideoDetails";
import VideoList from "../../components/video-list/VideoList";

const Video = () => {
  const { goal } = useContext(ContentContext);

  const [videos] = useVideos(goal || "react tutorial");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { videoId } = useParams();

  useEffect(() => {
    setSelectedVideo(videos[0]);
  }, [videos]);

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-24 mt-28">
      <h1>Watching Video: {videoId}</h1>
      {/* <div className="w-full mt-2">
        <VideoDetails video={selectedVideo} />
      </div> */}

      <h3 className="mt-6 text-lg sm:text-xl font-semibold tracking-wide">
        Related Videos
      </h3>
      {/* <div>
        <VideoList videos={videos} onVideoSelect={setSelectedVideo} />
      </div> */}
    </div>
  );
};

export default Video;
