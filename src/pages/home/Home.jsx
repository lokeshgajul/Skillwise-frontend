import React, { useContext } from "react";
import PopularRoadmaps from "../../components/Popular-roadmaps/PopularRoadmap";
import CreateRoadmap from "../../components/Create-roadmaps/CreateRoamdap";
import { ThemeContext } from "../../context/ThemeContext";

const Home = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div>
      <div
        className={` ${
          theme == "light" && " bg-gradient-to-l from-[#f7def7] to-[#c2f1f5]"
        }
 px-3 pt-20 pb-4 lg:pt-28 lg:pb-12`}
      >
        {/* <div
        className="bg-gradient-to-br from-[#c9d6ff] to-[#e2e2e2]

 px-3 pt-20 pb-4 lg:pt-28 lg:pb-12"
      > */}
        {/* <div
        className="bg-gradient-to-l from-[#fae9fa] to-[#cbf1f4]
 px-3 pt-20 pb-4 lg:pt-28 lg:pb-12"
      > */}
        {/* <div
        className="bg-gradient-to-r from-sky-200 via-teal-200 to-emerald-200
 px-3 pt-20 pb-4 lg:pt-28 lg:pb-12"
      > */}
        <CreateRoadmap />

        <PopularRoadmaps />
      </div>
      <div>
        <PopularRoadmaps />
      </div>
    </div>
  );
};

export default Home;
