import React, { useContext, useEffect } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import ReactImg from "../../assets/images/React.png";
import { Link } from "react-router-dom";
import { ContentContext } from "../../context/ContentContext";

const Roadmaps = () => {
  const { theme } = useContext(ThemeContext);
  const { getRoadmaps, prevRoadmaps } = useContext(ContentContext);

  useEffect(() => {
    getRoadmaps();
  }, []);

  return (
    <div className="p-7 lg:px-10">
      <h2 className="text-xl font-semibold tracking-wide mb-4">Your Courses</h2>
      <div className="flex flex-wrap gap-7">
        {prevRoadmaps?.map((roadmap, index) => (
          <div
            key={index}
            className={`${
              theme === "dark" ? "bg-[#3f3f3f]" : "bg-white"
            } mt-3 drop-shadow-lg hover:drop-shadow-xl cursor-pointer rounded-md flex flex-col w-full sm:w-[48%] lg:w-[23%] pb-2 `}
          >
            <div className="w-full h-[150px] overflow-hidden">
              <img
                src={ReactImg}
                alt="React Image"
                className="rounded-t-md object-cover w-full h-full"
              />
            </div>

            <div className="flex flex-col justify-between p-3">
              <h1
                className={` capitalize ${
                  theme === "dark" ? "text-gray-200" : "text-black"
                } text-md font-semibold`}
              >
                {roadmap?.goal}
              </h1>

              <p
                className={`py-3 ${
                  theme === "dark" ? "text-gray-200" : "text-black"
                } text-[15px] `}
              >
                {roadmap?.roadmap.slice(0, 100)}...
              </p>

              <div className="flex justify-end ">
                <Link
                  to={`/generated-roadmap?goal=${encodeURIComponent(
                    roadmap.goal
                  )}&id=${roadmap._id}`}
                  className="text-[#227CE3] text-[16px] tracking-wide font-medium hover:underline"
                >
                  Start Learning
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmaps;
