"use client";
import React, { useState,useRef,useEffect } from "react";
import { useRouter } from 'next/navigation';
import { logout } from '../../utils/api';
import Bargraph from '@/components/Bargraph';
import RegisteredStudents from '@/components/RegisteredStudents';
import ExamRegistered from '@/components/ExamRegisteredStudent';

const Dashboard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(
    "Select Department"
  );
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch user role from localStorage or your state management solution
    const role = localStorage.getItem('user_role'); // Or however you store the user role
    setUserRole(role);
  }, []);

  const handleLogout = async () => {
    try {
      // Call the logout API
      await logout();
      
      // Perform any additional actions such as clearing cookies, localStorage, etc.
      // Redirect to the login page after logout
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };  

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    // Trigger the file input dialog
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Selected file:', file);
      // You can now upload the file to the server or process it
    }
  };

  const handleChatboxAccess = () => {
    if (userRole === 'admin') {
      router.push('/chatbox');
      router.refresh();
    } else {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000); // Hide message after 3 seconds
    }
  };

  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSelectDepartment = (department: string) => {
    setSelectedDepartment(department);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row max-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`h-screen w-3/5 md:w-1/6 bg-[#990011] text-white flex flex-col p-4 pt-0 justify-start transform transition-transform duration-300 ease-in-out ${
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
                className="w-full text-left flex justify-between items-center bg-[#990011] p-2 rounded-md shadow-[1px_2px_4px_rgba(0,0,0,0.5)] transition transform duration-200 hover:scale-95"
                onClick={toggleDropdown}
              >
                {selectedDepartment}
                <span>{isOpen ? "▲" : "▼"}</span>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? "max-h-full" : "max-h-0"
                }`}
              >
                <ul className="mt-2 space-y-1 bg-[#77000e] p-2 rounded-lg">
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
          <div className="flex flex-col items-center justify-center h-full w-full">
          {/* Spacer to push content to the bottom */}
          <div className="flex-grow"></div>

          {/* Links moved to the bottom */}
            {showMessage && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-red-500 text-white p-4 rounded-md shadow-lg">
                  Could not access ChatBot. Please contact admin.
                </div>
              </div>
            )}
          <nav className="mt-6 space-y-2 mb-4 w-full max-w-md">
            <button
              onClick={handleChatboxAccess}
              className="block w-full px-3 py-2 text-center rounded-md hover:bg-[#660000] transition transform duration-200 hover:scale-95"
            >
              ChatBot
            </button>
            <>
            <input
              title="SendFile"
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={handleFileUpload}
              className="block w-full px-3 py-2 text-center rounded-md hover:bg-[#660000] transition transform duration-200 hover:scale-95 border-white border-[1px]"
            >
              Upload File
            </button>
          </>
          </nav>

          {/* File Upload button at the very bottom */}
          <button
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-md mt-6 md:mt-4 w-full max-w-md transition transform duration-200 hover:scale-95"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-4/5 p-4 md:p-8" id="dashboard-container">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 p-4 rounded-md text-black">DASHBOARD</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#dedada] p-4 rounded-md text-center h-32"><RegisteredStudents/></div>
          <div className="bg-[#dedada] p-4 rounded-md text-center h-32"><ExamRegistered/></div>
          <div className="bg-[#dedada] p-4 rounded-md text-center h-32">Rating</div>
          <div className="bg-[#dedada] p-4 rounded-md text-center h-32">File Upload (For automation-data)</div>
          <div className="bg-[#dedada] p-4 rounded-md text-center col-span-1 md:col-span-2 lg:col-span-3"><Bargraph/></div>
          <div className="bg-[#dedada] p-4 rounded-md text-center h-64">Pie Chart representation of course completed</div>
        </div>
        <div className="bg-[#dedada] p-4 rounded-md text-center h-32">Total Average of students completed their assignments</div>
      </div>
    </div>
  );
};

export default Dashboard;
