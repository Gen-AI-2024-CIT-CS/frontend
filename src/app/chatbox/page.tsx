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
  roll_no: string;
  role: string;
  [key: string]: string | number;
}

interface TableContent {
  columns: string[];
  rows: string[][];
  explanation: string;
}

interface YesNoContent {
  answer: string;
  explanation: string;
}

interface DataTypeContent {
  information: string;
  explanation: string;
}

interface GeneralContent {
  answer: string;
  explanation: string;
}

type MessageContent = 
  | string 
  | User[] 
  | TableContent 
  | YesNoContent 
  | DataTypeContent 
  | GeneralContent;

interface ChatMessage {
  type: 'user' | 'bot';
  contentType?: 'text' | 'table' | 'yes_no' | 'data_type' | 'general';
  content: MessageContent;
}

// Storage key for chat history - adding user specific info
const getChatHistoryKey = () => {
  // Use a user identifier if available (e.g., from a user context or session)
  return 'nptel_chat_history';
};

const ChatboxPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const [selectedDepartment, setSelectedDepartment] = useState("Select Department");
  const [initialized, setInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Load chat history from local storage on component mount
  useEffect(() => {
    // Only run this on the client side
    if (typeof window !== 'undefined') {
      const savedChatHistory = localStorage.getItem(getChatHistoryKey());
      if (savedChatHistory) {
        try {
          const parsedHistory = JSON.parse(savedChatHistory);
          if (Array.isArray(parsedHistory)) {
            setChatHistory(parsedHistory);
          }
        } catch (error) {
          console.error('Error parsing saved chat history:', error);
          // If there's an error parsing, clear the potentially corrupted data
          localStorage.removeItem(getChatHistoryKey());
        }
      }
      setInitialized(true);
    }
  }, []);

  // Save chat history to local storage whenever it changes
  useEffect(() => {
    // Only save after initial load and when changes occur
    if (initialized && typeof window !== 'undefined') {
      localStorage.setItem(getChatHistoryKey(), JSON.stringify(chatHistory));
    }
  }, [chatHistory, initialized]);

  const handleSelectDepartment = (department: string) => {
    setSelectedDepartment(department);
    setIsOpen(false);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Selected file:', file);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    setIsLoading(true);
    setChatHistory(prev => [...prev, { type: 'user', contentType: 'text', content: message }]);
  
    try {
      const res = await chat(message);
      
      if (res.data.error) {
        setChatHistory(prev => [...prev, { 
          type: 'bot', 
          contentType: 'text', 
          content: `Error: ${res.data.error}` 
        }]);
      } else if (res.data.type === 'table' && res.data.columns && res.data.rows) {
        setChatHistory(prev => [...prev, { 
          type: 'bot', 
          contentType: 'table',
          content: {
            columns: res.data.columns,
            rows: res.data.rows,
            explanation: res.data.explanation || 'Here is the table data you requested.'
          }
        }]);
      } else if (res.data.type === 'yes_no') {
        setChatHistory(prev => [...prev, { 
          type: 'bot', 
          contentType: 'yes_no',
          content: {
            answer: res.data.answer,
            explanation: res.data.explanation || 'Based on the data analysis.'
          }
        }]);
      } else if (res.data.type === 'data_type') {
        setChatHistory(prev => [...prev, { 
          type: 'bot', 
          contentType: 'data_type',
          content: {
            information: res.data.information,
            explanation: res.data.explanation || 'Data type information.'
          }
        }]);
      } else if (res.data.type === 'general') {
        setChatHistory(prev => [...prev, { 
          type: 'bot', 
          contentType: 'general',
          content: {
            answer: res.data.answer,
            explanation: res.data.explanation || ''
          }
        }]);
      } else {
        setChatHistory(prev => [...prev, { 
          type: 'bot', 
          contentType: 'text',
          content: 'Sorry, I could not process that request.'
        }]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setChatHistory(prev => [...prev, { 
        type: 'bot', 
        contentType: 'text',
        content: 'Sorry, an error occurred.' 
      }]);
    }
    finally{
      setIsLoading(false);
      setMessage('');
    }
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

  const renderMessage = (msg: ChatMessage) => {
    if (msg.type === 'user' || msg.contentType === 'text' || typeof msg.content === 'string') {
      return (
        <div
          className={`p-4 mb-3 rounded-lg ${
            msg.type === "user" 
              ? "bg-blue-100 ml-auto border-2 border-blue-200" 
              : "bg-gray-100 mr-auto border-2 border-gray-200"
          } max-w-3/4 shadow-sm transition-all duration-200 hover:shadow-md`}
        >
          <strong className={msg.type === "user" ? "text-blue-700" : "text-gray-700"}>
            {msg.type === "user" ? "You: " : "Bot: "}
          </strong>
          <p className="mt-1">{typeof msg.content === 'string' ? msg.content : 'Unknown message format'}</p>
        </div>
      );
    }
  
    if (msg.contentType === 'table' && 'columns' in msg.content) {
      const { columns, rows, explanation } = msg.content as TableContent;
    
      // Add error handling for table data
      const hasValidRows = Array.isArray(rows) && rows.length > 0;
      
      return (
        <div className="p-4 mb-3 rounded-lg bg-indigo-50 mr-auto max-w-[100%] border-2 border-indigo-200 shadow-md overflow-auto">
          <div className="flex items-center mb-2">
            <div className="bg-indigo-500 p-2 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
              </svg>
            </div>
            <strong className="text-indigo-700 text-lg">Table Result</strong>
          </div>
          <p className="mb-3 text-gray-700">{explanation}</p>
          
          {hasValidRows ? (
            <div className="overflow-x-auto mt-4 rounded-lg border border-indigo-200 bg-white shadow-inner">
              <div className="max-h-80 overflow-y-auto">
                <table className="min-w-full table-auto border-collapse">
                  <thead className="bg-indigo-100 sticky top-0">
                    <tr>
                      {columns.map((col, idx) => (
                        <th key={idx} className="px-4 py-3 text-left text-sm font-semibold text-indigo-800 border-b border-indigo-200">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-indigo-50 hover:bg-indigo-100 transition-colors duration-150'}>
                        {Array.isArray(row) ? row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-2 border-b border-indigo-100 text-gray-700">
                            {cell ?? "N/A"}
                          </td>
                        )) : (
                          <td colSpan={columns.length} className="px-4 py-2 border-b border-indigo-100 text-gray-700">
                            Invalid row data
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-white rounded-lg border border-red-200 text-red-600">
              No data available or received invalid table format.
            </div>
          )}
        </div>
      );
    }
  
    if (msg.contentType === 'yes_no' && 'answer' in msg.content) {
      const { answer, explanation } = msg.content as YesNoContent;
      const isYes = answer.toLowerCase() === 'yes';
      const isNo = answer.toLowerCase() === 'no';
      
      return (
        <div className={`p-4 mb-3 rounded-lg mr-auto max-w-3/4 shadow-md border-2
          ${isYes ? 'bg-green-50 border-green-200' : 
            isNo ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="flex items-center mb-3">
            <div className={`p-2 rounded-full mr-2
              ${isYes ? 'bg-green-500' : 
                isNo ? 'bg-red-500' : 'bg-yellow-500'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                {isYes ? (
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                ) : isNo ? (
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                )}
              </svg>
            </div>
            <strong className={`font-bold text-lg
              ${isYes ? 'text-green-700' : 
                isNo ? 'text-red-700' : 'text-yellow-700'}`}>
              {answer.toUpperCase()}
            </strong>
          </div>
          <p className="text-gray-700 ml-9">{explanation}</p>
        </div>
      );
    }
  
    if (msg.contentType === 'data_type' && 'information' in msg.content) {
      const { information, explanation } = msg.content as DataTypeContent;
      
      return (
        <div className="p-4 mb-3 rounded-lg bg-blue-50 mr-auto max-w-3/4 border-2 border-blue-200 shadow-md">
          <div className="flex items-start mb-2">
            <div className="bg-blue-500 p-2 rounded-full mr-2 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-700">Data Type Information:</h3>
              <div className="bg-white p-3 rounded border border-blue-200 mt-2 shadow-inner text-gray-800">
                {information}
              </div>
            </div>
          </div>
          {explanation && <p className="mt-3 text-gray-700 ml-9">{explanation}</p>}
        </div>
      );
    }
  
    if (msg.contentType === 'general' && 'answer' in msg.content) {
      const { answer, explanation } = msg.content as GeneralContent;
      
      return (
        <div className="p-4 mb-3 rounded-lg bg-purple-50 mr-auto max-w-3/4 border-2 border-purple-200 shadow-md">
          <div className="flex items-center mb-2">
            <div className="bg-purple-500 p-2 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <strong className="text-purple-700">Response</strong>
          </div>
          <div className="ml-9">
            <p className="text-gray-800">{answer}</p>
            {explanation && (
              <div className="mt-3 text-sm text-gray-600 border-t border-purple-200 pt-2">
                <p>{explanation}</p>
              </div>
            )}
          </div>
        </div>
      );
    }
  
    return null;
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <div
        className={`h-screen w-3/5 md:w-1/6 bg-[#990011] text-white flex flex-col p-4 pt-0 justify-start transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative z-10`}
      >
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={toggleSidebar} className="focus:outline-none">
            <div className="text-3xl text-white">
              &lt;
            </div>
          </button>
        </div>

        <div className="flex flex-col justify-start h-full">
          <h2 className="text-xl font-bold mb-4 mt-2">Filters</h2>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => { router.push('/dashboard') }}
              className="w-full text-left bg-[#990011] hover:bg-[#77000e] p-2 rounded-md shadow-[1px_2px_4px_rgba(0,0,0,0.5)] transition transform duration-200 hover:scale-95 mt-4"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push('/dashboard/mentor-mentee')}
              className="w-full text-left bg-[#990011] hover:bg-[#77000e] p-2 rounded-md shadow-[1px_2px_4px_rgba(0,0,0,0.5)] transition transform duration-200 hover:scale-95 mt-4"
            >
              Mentor-Mentee List
            </button>
          </div>

          <div className="flex-grow"></div>

          <button
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-md mt-6 md:mt-4 w-full max-w-md transition transform duration-200 hover:scale-95"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="md:hidden flex justify-start mb-4">
          <button onClick={toggleSidebar} className="focus:outline-none">
            <div className="text-3xl p-1 border b-2 border-black px-3 rounded-xl text-black">
              {sidebarOpen ? <span>&#10005;</span> : <span>&#9776;</span>}
            </div>
          </button>
        </div>

        <header className="bg-[#990011] text-white p-4">
          <h1 className="text-lg font-semibold text-center">Chatbot - Nptel Automation Tool</h1>
        </header>

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 bg-gray-100 text-black">
          {chatHistory.map((msg, index) => (
            <div key={index}>
              {renderMessage(msg)}
            </div>
          ))}
        </div>

        <div className="p-4 bg-transparent text-black">
        <form onSubmit={handleSend} className="flex items-center">
          <input
            type="text"
            placeholder={isLoading ? "Processing..." : "Enter Text"}
            className="flex-grow p-1.5 rounded-l-xl border border-gray-300 transition transform duration-200 focus:outline-none hover:ring-1 hover:ring-[#990011]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
          />
          <button
            title="send"
            type="submit"
            className={`p-2 ${isLoading ? 'bg-gray-400' : 'bg-[#990011] hover:bg-[#660000]'} text-white rounded-r-full transition transform duration-200 ${!isLoading && 'hover:scale-95'}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-white"></div>
            ) : (
              <PaperAirplaneIcon className="h-6 w-6 transition transform duration-200 hover:scale-95" />
            )}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default ChatboxPage;