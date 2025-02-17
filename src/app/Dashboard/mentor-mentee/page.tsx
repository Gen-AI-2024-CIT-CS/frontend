"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../../../utils/api";
import MenteeList from "../../../components/MenteeList";

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUserRole(localStorage.getItem("user_role"));
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
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
              shadow-[1px_2px_4px_rgba(0,0,0,0.5)] transition hover:bg-[#880010]"
            onClick={() => router.push("/dashboard")}
          >
            Dashboard
          </button>

          <div className="flex-grow" />

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
        <MenteeList />
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