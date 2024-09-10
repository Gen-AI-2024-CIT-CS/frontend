"use client";
import React, { useState, useEffect, useRef } from "react";
import { PaperAirplaneIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const ChatboxPage: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  // Effect to handle clicks outside the sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Remove event listener on cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F1F5F9] font-sans relative">
      {/* Slider Button - Visible Only on Small Screens */}
      {!isSidebarOpen && ( // Only show button when sidebar is closed
        <button
          className="fixed top-4 left-4 z-50 text-white bg-[#8B0000] p-2 rounded-full md:hidden transition-transform duration-300"
          onClick={openSidebar}
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      )}

      {/* Sidebar - Always Visible on Desktop, Sliding on Mobile */}
      <aside
        ref={sidebarRef} // Reference for detecting clicks outside
        className={`bg-[#8B0000] text-white shadow-lg h-full md:h-screen fixed top-0 left-0 z-40 md:static md:w-44 lg:w-56 p-4 md:p-4 transition-transform duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-[-100%]"
        } md:translate-x-0 md:transform-none flex flex-col`}
      >
        {/* Centered Filters Heading */}
        <h2 className="font-bold text-sm md:text-base lg:text-xl mb-4 md:mb-6 text-center">
          Filters
        </h2>

        {/* Dropdown */}
        <div className="mb-4 md:mb-6">
          <button
            className="flex justify-between items-center w-full py-1 md:py-2 px-2 md:px-3 bg-[#8B0000] text-white rounded-lg shadow-md transition-colors duration-200 hover:bg-[#660000]"
            onClick={toggleDropdown}
          >
            Select Department
            <span>{isDropdownOpen ? "▲" : "▼"}</span>
          </button>
          <ul
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isDropdownOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
            } mt-2 bg-[#8B0000] rounded-lg shadow-lg border border-white`}
          >
            {["Cyber Security", "CSE", "ECE", "EEE", "AIML", "AIDS"].map((dept, index) => (
              <li
                key={dept}
                className={`p-1 md:p-2 border-t border-white cursor-pointer hover:bg-[#660000] transition-opacity duration-300 ${
                  isDropdownOpen ? `animate-float delay-${index * 100}` : ""
                }`}
              >
                {dept}
              </li>
            ))}
          </ul>
        </div>

        {/* Links */}
        <div className="text-center mt-auto">
          {["Login", "Dashboard", "Chatbot"].map((link, index) => (
            <a
              key={link}
              href="#"
              className={`block py-1 md:py-2 text-white rounded-lg hover:bg-[#660000] transition-colors duration-200 ${
                index < 2 ? "mb-1 md:mb-2" : ""
              }`}
            >
              {link}
            </a>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 bg-[#F1F5F9] flex flex-col items-center justify-between md:ml-44 lg:ml-56">
        {/* Header */}
        <header className="mb-6 py-4 px-4 md:px-6 bg-[#8B0000] text-center text-white rounded-full w-full max-w-4xl relative">
          <h1 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
            Chatbot - Nptel Automation Tool
          </h1>
        </header>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Text Input with Send Icon */}
        <div className="relative w-full max-w-4xl mb-8">
          <input
            type="text"
            placeholder="Enter Text"
            className="w-full p-4 pr-16 rounded-full bg-white shadow-inner text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition duration-200"
          />
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-[#8B0000] text-white rounded-full hover:bg-[#660000] transition-colors duration-200">
            <PaperAirplaneIcon className="h-6 w-6" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default ChatboxPage;
