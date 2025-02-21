"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  const [currentWord, setCurrentWord] = useState("Automated");
  const [isAnimating, setIsAnimating] = useState(false);
  const words = ["Automated", "Real-time", "Streamlined", "Integrated"];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWord((prevWord) => {
          const currentIndex = words.indexOf(prevWord);
          return words[(currentIndex + 1) % words.length];
        });
        setIsAnimating(false);
      }, 500); // Smooth transition time
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-black bg-white px-4 relative">
      {/* Top Corner Images */}
      <img 
        src="/CIT Logo.png" 
        alt="Top Left Image" 
        className="absolute top-1 left-1"
        style={{width: "300px", height: "auto"}}
      />
      <img 
        src="/COE AI.png" 
        alt="Top Right Image" 
        className="absolute top-1 right-1"
        style={{width: "300px", height: "auto"}}
      />

      {/* Title Section */}
      <div className="text-center space-y-10">
        <span className="text-5xl md:text-6xl font-bold tracking-tight mb-12 hover:text-[#990011] hover:cursor-pointer transition-colors duration-250 ease-in-out">
          NPTEL 
        </span>
        <span className="text-5xl md:text-6xl font-bold tracking-tight mb-12">
          - Learning Tracker
        </span>

        {/* Fixed Text with Animated Last Word */}
        <div className="text-2xl md:text-2xl font-medium mb-12 flex items-center justify-center">
          <span className="whitespace-nowrap">Transforming NPTEL progress tracking into an&nbsp;</span>
          <span className="relative inline-block min-w-[140px]">
            <span
              className={`
                text-[#990011] 
                inline-block 
                transition-transform duration-[800ms] ease-out 
                ${isAnimating ? "translate-x-[15px] opacity-0" : "translate-x-0 opacity-100"}
              `}
            >
              {currentWord}
            </span>
          </span>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => router.push("/login")}
          className="bg-[#990011] text-white px-6 py-1.5 rounded-md font-medium hover:bg-[#800000] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#990011] focus:ring-offset-2 transition-transform duration-200 ease-in-out"
        >
          Get Started
        </button>
      </div>
    </main>
  );
};

export default HomePage;
