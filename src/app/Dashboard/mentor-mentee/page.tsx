"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/utils/api";
import MenteeList from "@/components/students/MenteeList";

interface Mentor {
  name: string;
}

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const router = useRouter();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setUserRole(localStorage.getItem("user_role"));
    
    // Fetch mentors list
    const fetchMentors = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/mentors", {
          method: "GET",
          credentials: "include"
        });
        
        if (response.ok) {
          const mentorData = await response.json();
          setMentors(mentorData);
        } else {
          console.error("Failed to fetch mentors");
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    };

    fetchMentors();
  }, []);

  // Storage key for chat history - adding user specific info
  const getChatHistoryKey = () => {
  // Use a user identifier if available (e.g., from a user context or session)
    return 'nptel_chat_history';
  };

  const handleLogout = async () => {
    try {
      // Clear chat history from local storage when logging out
      if (typeof window !== 'undefined') {
        localStorage.removeItem(getChatHistoryKey());
      }
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleChatboxAccess = () => {
    if (userRole === "admin") {
      router.push("/chatbox");
    } else {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
  };

  const handleSmallChatboxAccess = () => {
    if (userRole === "admin") {
      router.push("/newchatbot");
    } else {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
  };

  const handleMentorSelect = (mentorName: string) => {
    setSelectedMentor(mentorName);
    setShowFilterDropdown(false);
  };

  // Filter mentors based on search term
  const filteredMentors = searchTerm
    ? mentors.filter(mentor => 
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : mentors;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-64 bg-[#990011] text-white transition-transform duration-300 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 z-20 h-screen`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="md:hidden flex justify-end mb-4">
            <button onClick={() => setSidebarOpen(false)} className="text-3xl">&lt;</button>
          </div>

          <h2 className="text-xl font-bold mb-4">Filters</h2>
          
          <button
            className="w-full text-left bg-[#990011] p-2 rounded-md 
              shadow-[1px_2px_4px_rgba(0,0,0,0.5)] transition hover:bg-[#880010] mb-4"
            onClick={() => router.push("/dashboard")}
          >
            Dashboard
          </button>

          {/* Mentor Filter Dropdown */}
          <div className="relative mb-4">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="w-full text-left flex justify-between items-center bg-[#990011] p-2 rounded-md
                shadow-[1px_2px_4px_rgba(0,0,0,0.5)] transition hover:bg-[#880010]"
            >
              <span>{selectedMentor || "Please select a mentor"}</span>
              <span>{showFilterDropdown ? "🡹" : "🡻"}</span>
            </button>
            
            {showFilterDropdown && (
              <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-30">
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Search mentors..."
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <ul className="max-h-60 overflow-y-auto">
                  {filteredMentors.map(mentor => (
                    <li
                      key={mentor.name}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-black
                        ${selectedMentor === mentor.name ? "bg-blue-100" : ""}`}
                      onClick={() => handleMentorSelect(mentor.name)}
                    >
                      {mentor.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex-grow" />

          <button
            onClick={handleSmallChatboxAccess}
            className="w-full px-3 py-2 rounded-md hover:bg-[#660000] border-[1.5px] 
              hover:border-0 transition"
          >
            Small Chatbot
          </button>

          <button
            onClick={handleChatboxAccess}
            className="w-full px-3 py-2 rounded-md hover:bg-[#660000] border-[1.5px] 
              hover:border-0 transition"
          >
            ChatBot
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 
              rounded-md mt-4 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {selectedMentor ? (
          <MenteeList selectedMentor={selectedMentor} />
        ) : (
          <div className="flex h-full items-center justify-center p-8">
            <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to the Dashboard</h2>
              <p className="text-gray-600 mb-6">Please select a mentor from the sidebar to view their mentees.</p>
            </div>
          </div>
        )}
      </main>

      {/* Mobile menu button */}
      <button
        className={`md:hidden
        ${sidebarOpen ? "hidden" : "block"}
        fixed top-4 right-4 z-30 bg-[#990011] text-white p-3 rounded-full shadow-lg`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-opacity-50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {showMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-red-500 text-white p-4 rounded-md shadow-lg">
            Could not access ChatBot. Please contact admin.
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;