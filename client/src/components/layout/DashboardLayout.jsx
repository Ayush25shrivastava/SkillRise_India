import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

const IconGradient = () => (
  <svg width="0" height="0" className="absolute hidden">
    <linearGradient id="primary-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop stopColor="#a786ff" offset="0%" />
      <stop stopColor="#60a5fa" offset="100%" />
    </linearGradient>
    <linearGradient id="hover-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop stopColor="#d8b4fe" offset="0%" />
      <stop stopColor="#a786ff" offset="100%" />
    </linearGradient>
  </svg>
);

const DashboardLayout = ({ children, noSidebar }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize mouse to a range between -1 and 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="flex h-screen bg-[#080005] text-white overflow-hidden font-sans relative">
      <IconGradient />

      <div className="z-10 flex w-full h-full relative">
        {!noSidebar && <Sidebar />}
        
        <main className="flex-1 relative overflow-y-auto overflow-x-hidden scrollbar-hide">
          {/* Page Container */}
          <div className="w-full h-full flex flex-col pt-6 px-10 lg:px-24">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
