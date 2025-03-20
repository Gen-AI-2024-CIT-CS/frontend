"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RotatingText from '../components/react-bits/RotatingText';

const HomePage = () => {
  const router = useRouter();
  const [currentWord, setCurrentWord] = useState("Automated");
  const [isAnimating, setIsAnimating] = useState(false);

  

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
          <RotatingText
            texts={["Automated", "Real-time", "Streamlined", "Integrated"]}
            mainClassName="px-2 sm:px-2 md:px-3 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg bg-[#990011] text-white"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
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
