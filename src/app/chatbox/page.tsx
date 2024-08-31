"use client";
import React, { useState } from "react";
import { PaperAirplaneIcon, Bars3Icon } from "@heroicons/react/24/solid";

const ChatboxPage: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // State to control sidebar visibility

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-[#F1F5F9] font-sans">
      {/* Sidebar with Toggle Visibility */}
      <aside
        className={`fixed top-0 left-0 z-40 w-32 md:w-48 lg:w-64 bg-[#8B0000] p-4 md:p-6 text-white shadow-lg transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 h-full`}
      >
        {/* Close Button for Sidebar */}
        <button
          className="absolute top-4 right-4 md:hidden text-white"
          onClick={toggleSidebar}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        {/* Centered Filters Heading */}
        <h2 className="font-bold text-xs md:text-sm lg:text-lg mb-4 md:mb-6 text-center">Filters</h2>

        {/* Dropdown */}
        <div className="mb-4 md:mb-6">
          <button
            className="flex justify-between items-center w-full py-1 md:py-2 px-2 md:px-4 bg-[#8B0000] text-white rounded-lg shadow-md transition-colors duration-200 hover:bg-[#660000]"
            onClick={toggleDropdown}
          >
            Select Department
            <span>{isDropdownOpen ? "▲" : "▼"}</span>
          </button>
          <ul
            className={`overflow-hidden transition-all duration-500 ease-in-out transform ${
              isDropdownOpen ? "max-h-60 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"
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
        <div className="text-center">
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
      <main className="flex-1 p-4 md:p-8 bg-[#F1F5F9] flex flex-col items-center justify-between">
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

      {/* Hamburger Menu Icon */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden text-white"
        onClick={toggleSidebar}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default ChatboxPage;
