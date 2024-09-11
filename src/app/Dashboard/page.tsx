"use client";
import React, { useState } from "react";

const Dashboard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(
    "Select Department"
  );

  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSelectDepartment = (department: string) => {
    setSelectedDepartment(department);
    setIsOpen(false);
  };

  const handleSubmit = () => {
    console.log(`Selected Department: ${selectedDepartment}`);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`h-screen w-3/5 md:w-1/5 bg-[#990011] text-white flex flex-col p-4 pt-0 justify-start transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative z-10`}
      >
        {/* Close Button for Mobile View */}
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={toggleSidebar} className="focus:outline-none">
            <div className="text-3xl text-white">
              {/* Use the less-than symbol to indicate closing */}
              &lt;
            </div>
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col justify-start h-full">
          <h2 className="text-xl font-bold mb-4 mt-2">Filters</h2> {/* Reduced top margin */}
          <div className="flex flex-col space-y-2">
            <div className=" p-2 rounded-md relative">
              <button
                className="w-full text-left flex justify-between items-center bg-[#990011] p-2 rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.8)]"
                onClick={toggleDropdown}
              >
                {selectedDepartment}
                <span>{isOpen ? "▲" : "▼"}</span>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? "max-h-60" : "max-h-0"
                }`}
              >
                <ul className="mt-2 space-y-1 bg-[#77000e] p-2 rounded-md">
                  {[
                    "Cyber Security",
                    "CSE",
                    "ECE",
                    "EEE",
                    "AIML",
                    "AIDS",
                  ].map((dept) => (
                    <li key={dept}>
                      <button
                        className="w-full text-left np hover:bg-[#990011] p-2 rounded-md"
                        onClick={() => handleSelectDepartment(dept)}
                      >
                        {dept}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Spacer to push content to the bottom */}
          <div className="flex-grow"></div>

          {/* Links moved to the bottom */}
          <nav className="mt-6 space-y-2 mb-4">
            <a
              href="#"
              className="block px-3 py-2  text-center rounded-md hover:bg-[#660000] "
            >
              Login
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-center rounded-md hover:bg-[#660000] "
            >
              Dashboard
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-center rounded-md hover:bg-[#660000]  "
            >
              Chatbot
            </a>
          </nav>

          {/* File Upload button at the very bottom */}
          <button
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-md mt-6 md:mt-4"
            onClick={handleSubmit}
          >
            File Upload
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-4/5 p-4 md:p-8 ml-0 md:ml-1/5">
        {/* Hamburger Menu for Mobile View */}
        <div className="md:hidden flex justify-start mb-4">
          <button onClick={toggleSidebar} className="focus:outline-none">
            <div className="text-3xl text-black">
              {/* Hamburger Menu Icon */}
              {sidebarOpen ? (
                <span>&#10005;</span> // Cross symbol (X) for closing
              ) : (
                <span>&#9776;</span> // Hamburger menu (☰) for opening
              )}
            </div>
          </button>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 p-4 rounded-md text-black">
          DASHBOARD
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-500 p-4 rounded-md text-center h-32">
            No of students registered for course
          </div>
          <div className="bg-gray-500 p-4 rounded-md text-center h-32">
            No of students registered for exams
          </div>
          <div className="bg-gray-500 p-4 rounded-md text-center h-32">
            Rating
          </div>
          <div className="bg-gray-500 p-4 rounded-md text-center h-32">
            File Upload (For automation-data)
          </div>
          <div className="bg-gray-500 p-4 rounded-md text-center col-span-1 md:col-span-2 lg:col-span-3">
            Graph representation of weekly assignments completed by students
          </div>
          <div className="bg-gray-500 p-4 rounded-md text-center h-64">
            Pie Chart representation of course completed
          </div>
        </div>
        <div className="bg-gray-500 p-4 rounded-md text-center h-32">
          Total Average of students completed their assignments
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
