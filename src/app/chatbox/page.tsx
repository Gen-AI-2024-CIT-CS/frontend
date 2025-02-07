"use client"
import React, { useState, useEffect, useRef } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { chat } from '../../utils/api';
import { useRouter } from 'next/navigation';
import { logout } from '../../utils/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface ChatMessage {
  type: 'user' | 'bot';
  content: string | User[];
}

const ChatboxPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const [selectedDepartment, setSelectedDepartment] = useState("Select Department");

  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSelectDepartment = (department: string) => {
    setSelectedDepartment(department);
    setIsOpen(false);
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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
  
    setChatHistory(prev => [...prev, { type: 'user', content: message }]);
  
    try {
      const res = await chat(message);
      // Handle different response types
      if (res.data.response === 'No student found with this name. Please try again.') {
        // Handle "no student found" case
        setChatHistory(prev => [...prev, { 
          type: 'bot', 
          content: 'No student found with this name. Please try again.' 
        }]);
      } else if (res.data.email && res.data.id && res.data.name && res.data.role) {
        // Handle user data response
        setChatHistory(prev => [...prev, { 
          type: 'bot', 
          content: [{
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
            role: res.data.role
          }]
        }]);
      } else {
        // Handle any other response type
        setChatHistory(prev => [...prev, { 
          type: 'bot', 
          content: 'Sorry, I could not process that request.' 
        }]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setChatHistory(prev => [...prev, { 
        type: 'bot', 
        content: 'Sorry, an error occurred.' 
      }]);
    }
  
    setMessage('');
  };

  const handleLogout = async () => {
    try {
      // Call the logout API
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };  

  const renderMessage = (msg: ChatMessage) => {
    return (
      <div className={`p-3 mb-2 rounded-lg ${
        msg.type === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100 mr-auto'
      } max-w-3/4`}>
        <strong>{msg.type === 'user' ? 'You: ' : 'Bot: '}</strong>
        {typeof msg.content === 'string' ? (
          <p>{msg.content}</p>
        ) : (
          Array.isArray(msg.content) && msg.content.length > 0 ? (
            <ul>
              {msg.content.map((user: User) => (
                <li key={user.id} className="mt-2">
                  <p><strong>ID:</strong> {user.id}</p>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No user data available.</p>
          )
        )}
      </div>
    );
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
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
                  isOpen ? "max-h-screen" : "max-h-0"
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
          <button 
            onClick={() => router.push('/mentor-mentee')}
            className="w-full text-left bg-[#990011] hover:bg-[#77000e] p-2 rounded-md shadow-[1px_2px_4px_rgba(0,0,0,0.5)] transition transform duration-200 hover:scale-95 mt-4"
            >
            Mentor-Mentee List
          </button>
          {/* Spacer to push content to the bottom */}
          <div className="flex flex-col items-center justify-center h-full w-full">
          {/* Spacer to push content to the bottom */}
          <div className="flex-grow"></div>

          {/* Links moved to the bottom */}
          <nav className="mt-6 space-y-2 mb-4 w-full max-w-md">
            <button
              onClick={()=>{router.push('/dashboard')}}
              className="block w-full px-3 py-2 text-center rounded-md hover:bg-[#660000] transition transform duration-200 hover:scale-95"
            >
              Dashboard
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
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Hamburger Menu for Mobile View */}
        <div className="md:hidden flex justify-start mb-4">
          <button onClick={toggleSidebar} className="focus:outline-none">
            <div className="text-3xl p-1 border b-2 border-black px-3 rounded-xl text-black">
              {/* Hamburger Menu Icon */}
              {sidebarOpen ? (
                <span>&#10005;</span> // Cross symbol (X) for closing
              ) : (
                <span>&#9776;</span> // Hamburger menu (☰) for opening
              )}
            </div>
          </button>
        </div>
        {/* Header */}
        <header className="bg-[#990011] text-white p-4">
          <h1 className="text-lg font-semibold text-center">Chatbot - Nptel Automation Tool</h1>
        </header>

        {/* Chat Container (Scrollable) */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 bg-gray-100 text-black">
          {chatHistory.map((msg, index) => renderMessage(msg))}
        </div>

        {/* Input Area (Fixed at bottom) */}
        <div className="p-4 bg-transparent text-black">
          <form onSubmit={handleSend} className="flex items-center">
            <input
              type="text"
              placeholder="Enter Text"
              className="flex-grow p-1.5 rounded-l-xl border border-gray-300 transition transform duration-200 focus:outline-none hover:ring-1 hover:ring-[#990011]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              title="send"
              type="submit"
              className="p-2 bg-[#990011] text-white rounded-r-full hover:bg-[#660000] transition transform duration-200 hover:scale-95"
            >
              <PaperAirplaneIcon className="h-6 w-6 transition transform duration-200 hover:scale-95" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatboxPage;