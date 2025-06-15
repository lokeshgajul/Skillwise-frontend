import React, { useContext, useState } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition,
} from "@headlessui/react";
import { motion } from "framer-motion";
import { FaAngleUp } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";
import ReactImg from "../../assets/images/React.png";

const LandingPage = () => {
  const { theme } = useContext(ThemeContext);
  const roadmapItems = [
    {
      title: "Web Development Roadmap",
      description:
        "Master the fundamentals of HTML, CSS, JavaScript, and modern frameworks like React and Next.js.",
      img: ReactImg,
    },
    {
      title: "Frontend Engineering Path",
      description:
        "Learn how to build beautiful UIs, use component libraries, and make responsive websites.",
      img: ReactImg,
    },
    {
      title: "Backend Development Guide",
      description:
        "Understand databases, APIs, authentication, and server-side development using Node.js or Python.",
      img: ReactImg,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.1 }}
    >
      <div
        className={` ${
          theme == "light" && " bg-gradient-to-l from-[#f7def7] to-[#c2f1f5]"
        }`}
      >
        <div className="flex flex-row justify-between items-center px-3 lg:px-6 py-4 border-b-[0.5px] border-gray-400">
          <ul>
            <li>
              {" "}
              <span className="text-lg font-serif font-semibold tracking-wide">
                SkillWise
              </span>
            </li>
          </ul>
          <ul className="flex flex-row justify-center items-center space-x-3 p-1 rounded-md font-normal tracking-wide text-[15px]">
            <li className="max-md:hidden">Roadmaps</li>
            <li className="max-md:hidden">Get Started </li>
            <li>
              <button
                className="px-4 py-2 hover:font-medium cursor-pointer rounded-full text-[15px] bg-blue-400 text-white"
                type="button"
              >
                Sign In
              </button>
            </li>
          </ul>
        </div>

        <div className=" flex justify-center items-center flex-col h-96">
          <h1 className="max-lg:text-[30px] lg:text-[40px] text-center capitalize font-bold tracking-normal">
            unlock your potential with skillwise
          </h1>
          <p className="text-center">
            Master new skills with structured roadmaps , tutorial and progress
            tracking start your learning journey today.
          </p>
          <div>
            <button
              className="px-4 py-2 hover:font-medium cursor-pointer mt-3 rounded-full text-[15px] bg-blue-400 text-white"
              type="button"
            >
              Get Started{" "}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#f9f9fb]">
        <div className="flex justify-center flex-col px-8 pt-10 pb-6">
          <h1 className="max-lg:text-[20px] lg:text-[30px] capitalize font-bold tracking-normal ">
            Why Choose Skillwise?
          </h1>
          <p className="my-2">
            Skillwise offers a comprehensive learning designed to help you
            achieve your goals.
          </p>

          <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
            {[1, 2, 3].map((item, index) => {
              return (
                <div
                  key={index}
                  className="md:w-[48%] lg:w-[30%] cursor-pointer "
                >
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="cursor-pointer shadow-md hover:shadow-xl rounded-xl overflow-hidden transition duration-300 ease-in-out mt-4"
                  >
                    <div className="border-[1px] border-gray-300 p-2 rounded-md mt-2 bg-white hover:shadow-lg">
                      <span className="text-[15px] font-serif font-semibold tracking-wide">
                        Personalized Learning Paths
                      </span>
                      <p className="text-sm text-gray-600 pt-1">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Animi corrupti nesciunt labore, repudiandae saepe
                        accusamus perspiciatis vitae.
                      </p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        <div className=" px-8 bg-[#f9f9fb] pb-20 pt-9">
          <div className="text-left">
            <h2 className="text-3xl font-bold font-serif mb-2 text-gray-800">
              🚀 Feature Roadmaps
            </h2>
            <p className="text-gray-600 text-sm">
              Explore expertly curated paths to grow your tech skills.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {roadmapItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="cursor-pointer bg-white shadow-md hover:shadow-xl rounded-xl overflow-hidden transition duration-300 ease-in-out"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold font-serif text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQs  */}
        <div className="px-8 pb-8 bg-[#f9f9fb]">
          <h2 className=" text-xl font-serif font-semibold tracking-normal">
            Frequently Asked Questions{" "}
          </h2>
          <div className="flex flex-col my-1 flex-wrap">
            {[1, 2, 3].map((item, index) => {
              return (
                <div key={index} className="my-2">
                  <Disclosure
                    as="div"
                    className="w-full p-3 rounded-md bg-[#f1efef] border-[1px] border-[#f3f1f1]"
                  >
                    {({ open }) => (
                      <>
                        <div className="flex flex-row justify-between space-x-2">
                          <p>
                            Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Doloremque, eligendi?
                          </p>
                          <DisclosureButton className="text-left">
                            {open ? (
                              <FaAngleDown size={24} color="black" />
                            ) : (
                              <FaAngleUp size={24} color="black" />
                            )}
                          </DisclosureButton>
                        </div>

                        <Transition
                          show={open}
                          enter="transition ease-out duration-300"
                          enterFrom="opacity-0 -translate-y-2"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-200"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 -translate-y-2"
                        >
                          <DisclosurePanel className="pt-3 text-gray-700">
                            Yes! You can purchase a license that you can share
                            with your entire team.
                          </DisclosurePanel>
                        </Transition>
                      </>
                    )}
                  </Disclosure>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
