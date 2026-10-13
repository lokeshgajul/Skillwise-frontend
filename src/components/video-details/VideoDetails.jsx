import React from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition,
} from "@headlessui/react";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import { FiCheckCircle, FiCircle } from "react-icons/fi";

const VideoDetails = ({ video, modules = [], isDark = false }) => {
  if (!video) {
    return (
      <div
        className={`rounded-2xl border p-16 text-center ${
          isDark
            ? "bg-zinc-900/60 border-zinc-800 text-zinc-400"
            : "bg-white/80 border-slate-200 text-slate-500"
        }`}
      >
        Loading videos...
      </div>
    );
  }

  const videoId = video.id?.videoId || video.id;
  const videoSrc = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Player & description */}
      <div className="lg:col-span-2 w-full">
        <div className="w-full aspect-video rounded-2xl overflow-hidden border border-blue-600/20 shadow-lg shadow-blue-600/10 bg-black">
          <iframe
            src={videoSrc}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video player"
            className="w-full h-full"
          ></iframe>
        </div>

        <div className="mt-4">
          <h2
            className={`text-base sm:text-lg md:text-xl font-semibold tracking-wide ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {video.snippet?.title}
          </h2>
          <p
            className={`text-xs sm:text-sm md:text-base tracking-wide pt-2 leading-relaxed ${
              isDark ? "text-zinc-400" : "text-slate-600"
            }`}
          >
            {video.snippet?.description}
          </p>
        </div>
      </div>

      {/* Sidebar: Course modules */}
      <div className="w-full lg:col-span-1">
        <p
          className={`text-base font-semibold mb-3 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Course Modules
        </p>
        {hasNoModules(modules) ? (
          <div
            className={`rounded-2xl border p-6 text-sm ${
              isDark
                ? "bg-zinc-900/60 border-zinc-800 text-zinc-500"
                : "bg-white/80 border-slate-200 text-slate-500"
            }`}
          >
            Load a roadmap to see its modules alongside the video.
          </div>
        ) : (
          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {modules.map((item, index) => (
              <Disclosure
                key={item.moduleId || index}
                as="div"
                className={`w-full p-3 rounded-2xl border ${
                  isDark
                    ? "bg-zinc-900/90 border-zinc-800"
                    : "bg-white/90 border-slate-200"
                }`}
              >
                {({ open }) => (
                  <>
                    <div className="flex flex-row justify-between items-center gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                            isDark
                              ? "bg-blue-500/15 text-blue-400"
                              : "bg-blue-600/10 text-blue-600"
                          }`}
                        >
                          M{item.moduleIndex || index + 1}
                        </span>
                        <p
                          className={`text-sm font-medium truncate ${
                            isDark ? "text-zinc-100" : "text-slate-800"
                          }`}
                        >
                          {item.title}
                        </p>
                      </div>
                      <DisclosureButton className="shrink-0 cursor-pointer">
                        {open ? (
                          <FaAngleDown
                            size={16}
                            color={isDark ? "#a1a1aa" : "#475569"}
                          />
                        ) : (
                          <FaAngleUp
                            size={16}
                            color={isDark ? "#a1a1aa" : "#475569"}
                          />
                        )}
                      </DisclosureButton>
                    </div>

                    <Transition
                      show={open}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 -translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 -translate-y-1"
                    >
                      <DisclosurePanel className="pt-3">
                        {(item.topics || []).map((topic) => (
                          <li
                            key={topic.topicId || topic.title}
                            className={`py-1.5 text-xs sm:text-sm flex items-start gap-2 list-none ${
                              isDark ? "text-zinc-300" : "text-slate-600"
                            }`}
                          >
                            {topic.completed ? (
                              <FiCheckCircle
                                className="text-emerald-500 mt-0.5 shrink-0"
                                size={13}
                              />
                            ) : (
                              <FiCircle
                                className={
                                  isDark ? "text-zinc-600 mt-0.5" : "text-slate-300 mt-0.5"
                                }
                                size={13}
                              />
                            )}
                            <span className={topic.completed ? "line-through opacity-70" : ""}>
                              {topic.title}
                            </span>
                          </li>
                        ))}
                        {(!item.topics || item.topics.length === 0) &&
                          (item.milestones || []).map((li) => (
                            <li
                              key={li}
                              className={`py-1 text-xs sm:text-sm list-none ${
                                isDark ? "text-zinc-300" : "text-slate-600"
                              }`}
                            >
                              {li}
                            </li>
                          ))}
                      </DisclosurePanel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const hasNoModules = (modules) => !modules || modules.length === 0;

export default VideoDetails;
