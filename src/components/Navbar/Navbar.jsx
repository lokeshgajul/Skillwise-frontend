import React, { useContext } from "react";
import { useState } from "react";
import { CiUser } from "react-icons/ci";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Link } from "react-router-dom";
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";
import { ThemeContext } from "../../context/ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="fixed top-0 left-0 w-full z-50 ">
      <div
        className={` flex justify-between flex-row items-center px-5 py-5 ${
          theme == "light"
            ? " bg-gradient-to-l from-[#f7def7] to-[#c2f1f5]"
            : "bg-[#1E201E] "
        }`}
      >
        <span className="text-lg font-serif font-semibold tracking-wide">
          SkillWise
        </span>

        {/* <ul className="flex flex-row">
          <li className="hover:text-blue-600 font-semibold p-2 rounded-full cursor-pointer">
            <div className="flex gap-8">
              <Popover>
                <PopoverButton
                  className={`block text-sm/6 font-semibold ${
                    theme === "dark" ? "bg-[#3C3D37]" : "bg-[#e1f6f7]"
                  } shadow-lg rounded-full p-2 focus:outline-none`}
                >
                  <CiUser
                    size={22}
                    color={theme === "dark" ? "#fff" : "#000"}
                  />
                </PopoverButton>
                <PopoverPanel
                  transition
                  anchor="bottom"
                  className={`absolute right-0 mt-1 translate-x-[-20px] w-fit max-w-md ${
                    theme === "dark" ? "bg-[#3C3D37]" : "bg-white"
                  } rounded-xl shadow-lg text-sm transition duration-200 ease-in-out z-50`}
                >
                  <div
                    className={`${
                      theme === "dark" ? "text-white" : "text-black"
                    } lg:w-[100px] p-3`}
                  >
                    <p className="font-semibold cursor-pointer tracking-wider">
                      <Link href="/login">Logout</Link>
                    </p>

                    <p
                      className="font-semibold mt-2 cursor-pointer tracking-wider"
                      onClick={toggleTheme}
                    >
                      Theme
                    </p>
                  </div>
                </PopoverPanel>
              </Popover>
            </div>
          </li>
        </ul> */}

        <ul className="flex space-x-4 flex-row">
          <li className=" bg-transparent border-[1px] border-gray-400 px-2 py-1 hover:shadow-2xl hover:bg-[#fae9fa] hover:text-black rounded-md text-[14px]">
            <Link to="/signup">Sign Up</Link>
          </li>
          <li className="hover:text-blue-600  p-1 rounded-md text-[14px]">
            <Link to="/signin">Sign In</Link>
          </li>
          <li
            onClick={toggleTheme}
            className="hover:text-blue-600  p-1 cursor-pointer rounded-md text-[14px]"
          >
            {theme === "dark" ? (
              <MdLightMode size={25} color="white" />
            ) : (
              <MdDarkMode size={25} color="black" />
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
