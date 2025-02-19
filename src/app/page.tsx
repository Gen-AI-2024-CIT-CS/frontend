"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const UserList = dynamic(() => import('../components/UserList'), { ssr: false });
const Login = dynamic(() => import('../components/Login'), { ssr: false });

const HomePage = () => {
  const router = useRouter();
  const [currentWord, setCurrentWord] = useState('Automated');
  const [isAnimating, setIsAnimating] = useState(false);
  const words = ['Automated', 'Real-time', 'Streamlined', 'Integrated'];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWord(prevWord => {
          const currentIndex = words.indexOf(prevWord);
          return words[(currentIndex + 1) % words.length];
        });
        setIsAnimating(false);
      }, 500); // Half of the animation duration
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-black bg-white px-4">
      {/* Title Section */}
      <div className="text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-12">
          NPTEL - Learning Tracker
        </h1>
        
        {/* Animated Text Section */}
        <div className="text-2xl md:text-2xl font-medium mb-12 overflow-hidden">
          <span>Transform your NPTEL progress tracking into an </span>
          <span className="inline-block relative">
            <span 
              className={`
                text-[#990011]
                inline-block 
                min-w-[120px] 
                transform
                transition-all
                duration-1000
                ${isAnimating ? 'translate-x-[-20px] opacity-0' : 'translate-x-0 opacity-100'}
              `}
              style={{
                transformOrigin: 'left center',
              }}
            >
              {currentWord}
            </span>
          </span>
        </div>
        
        {/* CTA Button */}
        <button
          onClick={() => router.push('/login')}
          className="bg-[#990011] text-white px-6 py-1.5 rounded-md font-medium hover:bg-[#800000] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#990011] focus:ring-offset-2 transition-transform duration-200 ease-in-out"
        >
          Get Started
        </button>
      </div>
      
      {/* Hidden components */}
      <div className="hidden">
        <Login />
        <UserList />
      </div>
    </main>
  );
};

export default HomePage;