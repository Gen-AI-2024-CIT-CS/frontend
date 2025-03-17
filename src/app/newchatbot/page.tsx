"use client";

import { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useRouter } from 'next/navigation';
import { logout, newChat } from '../../utils/api';

interface SqlResponse {
  query: string;
  sql: string;
  data: any[];
}

export default function SqlChatInterface() {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState<SqlResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Storage key for chat history - adding user specific info
  const getChatHistoryKey = () => {
        // Use a user identifier if available (e.g., from a user context or session)
        return 'nptel_chat_history';
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);
    
    // Add the user's message to the responses
    setResponses(prev => [...prev, { 
      query: message,
      sql: "",
      data: []
    }]);

    try {
      const response = await newChat(message);
      console.log(response);
      setResponses(prev => [...prev.slice(0, -1), response.data]);
      setMessage('');
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load chat history from local storage on component mount
    useEffect(() => {
      // Only run this on the client side
      if (typeof window !== 'undefined') {
        const savedChatHistory = localStorage.getItem(getChatHistoryKey());
        if (savedChatHistory) {
          try {
            const parsedHistory = JSON.parse(savedChatHistory);
            if (Array.isArray(parsedHistory)) {
                setResponses(parsedHistory);
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
        if (initialized && typeof window !== 'undefined') {
          localStorage.setItem(getChatHistoryKey(), JSON.stringify(responses));
        }
      }, [responses, initialized]);  
    
    useEffect(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, [responses]);

  const renderMessage = (response: SqlResponse, index: number, isUserMessage = false) => {
    if (isUserMessage) {
      return (
        <div
          className="p-4 mb-3 rounded-lg bg-blue-100 ml-auto border-2 border-blue-200 max-w-3/4 shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <strong className="text-blue-700">You: </strong>
          <p className="mt-1">{response.query}</p>
        </div>
      );
    }

    return (
      <div className="p-4 mb-3 rounded-lg bg-indigo-50 mr-auto max-w-full border-2 border-indigo-200 shadow-md overflow-auto">
        <div className="flex items-center mb-2">
          <div className="bg-indigo-500 p-2 rounded-full mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
            </svg>
          </div>
          <strong className="text-indigo-700 text-lg">SQL Result</strong>
        </div>
        
        <div className="mb-3">
            <span className="font-semibold text-blue-600">User Query:</span>
            <pre className="bg-white p-3 rounded mt-1 text-sm overflow-x-auto border border-gray-300 shadow-inner">
                {response.query || "No query received!"}
            </pre>
            </div>

            <div className="mb-3">
            <span className="font-semibold text-green-600">Generated SQL:</span>
            <pre className="bg-white p-3 rounded mt-1 text-sm overflow-x-auto border border-indigo-200 shadow-inner">
                {response.sql 
                ? response.sql 
                : "🤖 No SQL found! Maybe try a clearer query? (P.S. It's my first time translating natural text to SQL, handle with care!)"}
            </pre>
        </div>

        {response.data ? (
          <div className="overflow-x-auto mt-4 rounded-lg border border-indigo-200 bg-white shadow-inner">
            <div className="max-h-80 overflow-y-auto">
              <table className="min-w-full table-auto border-collapse">
              <thead className="bg-indigo-100 sticky top-0">
                <tr>
                    {response.data && response.data.length > 0 ? (
                    Object.keys(response.data[0]).map((key, idx) => (
                        <th key={idx} className="px-4 py-3 text-left text-sm font-semibold text-indigo-800 border-b border-indigo-200">
                        {key}
                        </th>
                    ))
                    ) : (
                    <th className="px-4 py-3 text-left text-sm font-semibold text-red-600">
                        No Data Found! <br /><br />🤖 No SQL found! Maybe try a clearer query? (P.S. It's my first time translating natural text to SQL, handle with care!)
                    </th>
                    )}
                </tr>
                </thead>
                <tbody>
                  {response.data.map((row, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-indigo-50 hover:bg-indigo-100 transition-colors duration-150'}>
                      {Object.values(row).map((cell: any, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-2 border-b border-indigo-100 text-gray-700">
                          {cell === null ? 'NULL' : 
                           typeof cell === 'object' ? JSON.stringify(cell) : 
                           String(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-white rounded-lg border border-indigo-200 text-gray-600">
            No results available.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
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
              className="w-full text-left bg-[#990011] hover:bg-[#77000e] p-2 rounded-md shadow-[1px_2px_4px_rgba(0,0,0,0.5)] transition transform duration-200 hover:scale-95 mt-4"
              onClick={() => { router.push('/dashboard') }}
            >
              Dashboard
            </button>
            <button
              className="w-full text-left bg-[#990011] hover:bg-[#77000e] p-2 rounded-md shadow-[1px_2px_4px_rgba(0,0,0,0.5)] transition transform duration-200 hover:scale-95 mt-4"
              onClick={() => router.push('/dashboard/mentor-mentee')}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden flex justify-start mb-4">
          <button onClick={toggleSidebar} className="focus:outline-none">
            <div className="text-3xl p-1 border b-2 border-black px-3 rounded-xl text-black">
              {sidebarOpen ? <span>&#10005;</span> : <span>&#9776;</span>}
            </div>
          </button>
        </div>

        {/* Header */}
        <header className="bg-[#990011] text-white p-4">
          <h1 className="text-lg font-semibold text-center">SQL Query Assistant</h1>
        </header>

        {/* Chat Display */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100 text-black">
          {responses.length === 0 ? (
            <div className="text-center text-gray-500 h-full flex items-center justify-center">
              <p>Start by asking a question about your data</p>
            </div>
          ) : (
            <div ref={chatContainerRef} className="space-y-2">
              {responses.map((response, index) => (
                <div key={index}>
                  {response.sql === "" ? (
                    renderMessage(response, index, true)
                  ) : (
                    renderMessage(response, index, false)
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 text-red-700 bg-red-100 rounded-lg mx-4">
            {error}
          </div>
        )}

        {/* Input Form */}
        <div className="p-4 bg-transparent text-black">
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              type="text"
              placeholder={isLoading ? "Processing..." : "Ask a question about your data..."}
              className="flex-grow p-1.5 rounded-l-xl border border-gray-300 transition transform duration-200 focus:outline-none hover:ring-1 hover:ring-[#990011]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
            />
            <button
              title="send"
              type="submit"
              className={`p-2 ${isLoading ? 'bg-gray-400' : 'bg-[#990011] hover:bg-[#660000]'} text-white rounded-r-full transition transform duration-200 ${!isLoading && 'hover:scale-95'}`}
              disabled={isLoading || !message.trim()}
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
}