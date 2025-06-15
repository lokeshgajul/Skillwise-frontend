import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContentContext } from "../../context/ContentContext";

const CreateRoadmap = () => {
  const [theme, setTheme] = useState("light");

  const { roadmap, loading, goal, setGoal, generateRoadmap } =
    useContext(ContentContext);
  const navigate = useNavigate();

  const handleClick = async () => {
    const success = await generateRoadmap();
    if (success) {
      navigate(`/generated-roadmap?goal=${encodeURIComponent(goal)}`);
    }
  };

  return (
    <div className="pb-4 py-8">
      <h1 className="max-lg:text-[30px] lg:text-[40px] text-center capitalize font-bold tracking-normal">
        unlock your potential with skillwise
      </h1>

      <div className="max-w-screen-lg mx-auto lg:p-2">
        <p className="text-center text-[16px] lg:text-[20px] tracking-wide">
          Want to make project planning easier? Our AI Roadmap Generator helps
          you create a custom roadmap in just a few steps. Simply enter your
          project details, and let AI guide you toward your goals.
        </p>
        <div className="flex justify-center items-center flex-row m-8">
          <div className="border-[1px] border-gray-600 p-1 lg:p-2 rounded-full shadow-md flex items-center">
            <input
              type="text"
              name="text"
              id="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Generate your roadmap with AI..."
              className={`px-2 rounded-md max-sm:w-[180px] md:w-[300px] lg:w-[400px] mr-2 focus:outline-none placeholder:text-gray-600 ${
                theme === "dark"
                  ? "bg-[#1E201E] focus:bg-[#1E201E]"
                  : "bg-transparent focus:bg-transparent"
              }`}
            />

            <button
              disabled={!goal.trim()}
              onClick={handleClick}
              className="bg-[#4298fa] py-2.5 px-5 rounded-full text-[15px] font-medium hover:text-white disabled:text-white"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoadmap;
