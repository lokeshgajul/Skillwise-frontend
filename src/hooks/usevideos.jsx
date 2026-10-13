import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../services/api";

const useVideos = (defaultSearchTerm) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (defaultSearchTerm) {
      search(defaultSearchTerm);
    }
  }, [defaultSearchTerm]);

  const search = async (term) => {
    if (!term) return;
    try {
      const result = await axios.get(
        `${API_BASE_URL}/api/youtube/search`,
        {
          params: {
            query: term,
          },
        }
      );

      setVideos(result.data);
    } catch (error) {
      console.error("Failed to fetch videos", error.message);
    }
  };
  return [videos, search];
};

export default useVideos;
