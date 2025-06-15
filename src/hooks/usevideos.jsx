import { useEffect, useState } from "react";
import axios from "axios";

const useVideos = (defaultSearchTerm) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    search(defaultSearchTerm);
  }, [defaultSearchTerm]);

  const search = async (term) => {
    try {
      const result = await axios.get("http://localhost:3000/youtube/search", {
        params: {
          query: term,
        },
      });

      setVideos(result.data);
    } catch (error) {
      console.error("Failed to fetch videos", error.message);
    }
  };
  return [videos, search];
};

export default useVideos;
