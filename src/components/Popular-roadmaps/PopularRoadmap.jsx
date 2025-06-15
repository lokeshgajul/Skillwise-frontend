import React from "react";
import { Link } from "react-router-dom"; // React Router in Vite
import ReactImg from "../../assets/images/React.png"; // Adjust path to Vite public or assets folder
import { useState } from "react";

const PopularRoadmaps = () => {
  const [theme, setTheme] = useState("light");

  return (
    <div className="p-7 ">
      <h2 className="text-xl font-medium lg:ml-4">Popular Roadmaps:</h2>
      <div className="flex flex-row justify-center items-center flex-wrap gap-6 mt-3">
        {[1, 2, 3, 4].map((item, index) => (
          <div
            key={index}
            className={`${
              theme === "dark" ? "bg-[#3C3D37]" : "bg-[#fff]"
            } mt-3 drop-shadow-lg hover:drop-shadow-xl cursor-pointer rounded-md flex flex-col w-full sm:w-[48%] lg:w-[23%] pb-2`}
          >
            <div className="w-full">
              <img
                src={ReactImg}
                alt="React Image"
                className="rounded-t-md object-cover w-full h-auto"
              />
            </div>

            <h1
              className={`mt-1 ${
                theme === "dark" ? "text-white" : "text-black"
              } text-md font-semibold p-2`}
            >
              Learn React - For Complete Beginners Roadmap
            </h1>

            <p
              className={`p-2 ${
                theme === "dark" ? "text-white" : "text-black"
              } text-[15px]`}
            >
              Lorem ipsum dolor sit, amet consectetur adipisicing elit...
            </p>

            <span className="flex justify-end p-2 text-[16px] tracking-wide font-medium hover:underline text-[#227CE3] cursor-pointer">
              <Link to="/progress">Start Learning</Link>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularRoadmaps;
