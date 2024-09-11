"use client";
import React, { useState, useEffect, useRef } from "react";
import { PaperAirplaneIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { chat } from '../../utils/api';

const ChatboxPage: React.FC = () => {
  const [message, setMessage] = useState<string>(""); // Message input
  const [response, setResponse] = useState<string>(""); 
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    try {
      const res = await chat(message);
      console.log(res.data); // Check what data you get
      setResponse(res.data.sql); // Update the response state with data from backend
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F1F5F9] font-sans relative">
      {!isSidebarOpen && (
        <button title="Open"
          className="fixed top-4 left-4 z-50 text-white bg-[#8B0000] p-2 rounded-full md:hidden transition-transform duration-300"
          onClick={openSidebar}
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      )}

      {/* Sidebar - Tightly aligned to the left */}
      <aside
        ref={sidebarRef}
        className={`bg-[#8B0000] text-white shadow-lg h-full md:h-screen fixed top-0 left-0 z-40 md:static md:w-60 lg:w-72 p-4 md:p-6 transition-transform duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-[-100%]"
        } md:translate-x-0 md:transform-none flex flex-col`}
      >
        {/* Centered Filters Heading */}
        <h2 className="font-bold text-lg md:text-xl lg:text-2xl mb-4 md:mb-6 text-center">
          Filters
        </h2>

        {/* Dropdown */}
        <div className="mb-4 md:mb-6">
          <button
            className="flex justify-between items-center w-full py-1 md:py-2 px-2 md:px-3 bg-[#8B0000] text-white rounded-lg shadow-md shadow-black transition-colors duration-200 hover:bg-[#660000]"
            onClick={toggleDropdown}
          >
            Select Department
            <span>{isDropdownOpen ? "▲" : "▼"}</span>
          </button>
          <ul
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isDropdownOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
            } mt-2 bg-[#6D0000] rounded-lg shadow-lg`}
          >
            {["Cyber Security", "CSE", "ECE", "EEE", "AIML", "AIDS"].map((dept, index) => (
              <li
                key={dept}
                className={`p-1 md:p-2 cursor-pointer hover:bg-[#500000] transition-opacity duration-300 ${
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
              className={`block py-1 md:py-2 text-white rounded-lg hover:bg-[#500000] transition-colors duration-200 ${
                index < 2 ? "mb-1 md:mb-2" : ""
              }`}
            >
              {link}
            </a>
          ))}
        </div>
      </aside>

      {/* Main Content - Centering content */}
      <main className="flex-1 p-4 md:p-8 bg-[#F1F5F9] flex flex-col items-center justify-center">
      {/* Header */}
      <header className="mb-6 py-4 px-4 md:px-6 bg-[#8B0000] text-center text-white rounded-full max-w-2xl w-full flex justify-center">
        <h1 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
          Chatbot - Nptel Automation Tool
        </h1>
      </header>

      {/* Spacer */}
      <div className="flex-grow"></div>

      {/* Text Input with Send Icon */}
      <div className="relative max-w-2xl w-full mb-8 flex flex-col items-center">
      <input
        type="text"
        placeholder="Enter Text"
        className="w-full p-4 pr-16 rounded-full bg-white shadow-inner text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition duration-200"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        title="send"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-[#8B0000] text-white rounded-full hover:bg-[#500000] transition-colors duration-200"
        onClick={handleSend}
      >
        <PaperAirplaneIcon className="h-6 w-6" />
      </button>
      {/* Display Bot Response */}
      <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-md text-black">
        <h2 className="text-lg font-semibold">Bot Response:</h2>
        <p>{response}</p>
      </div>
    </div>
    </main>
    </div>
  );
};

export default ChatboxPage;
