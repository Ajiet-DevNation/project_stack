"use client"
import React, { useState, useEffect } from 'react';

interface CollapsibleHeaderProps {
  title: string;
  subheading?: string; // Subheading is optional
}

const SCROLL_THRESHOLD = 80;

const CollapsibleHeader: React.FC<CollapsibleHeaderProps> = ({ title, subheading }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const shouldCollapse = window.scrollY > SCROLL_THRESHOLD;
      
      if (shouldCollapse !== isCollapsed) {
        setIsCollapsed(shouldCollapse);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isCollapsed]);

  // Conditional Tailwind Classes
  const headerClasses = isCollapsed
    ? 'h-20 backdrop-blur-xl'
    : 'h-48 bg-transparent'; 

  const largeTitleClasses = isCollapsed
    ? 'opacity-0 translate-y-4 pointer-events-none'
    : 'opacity-100 translate-y-0';                  

  const smallTitleClasses = isCollapsed
    ? 'opacity-100'
    : 'opacity-0';  

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-500 ease-in-out
        ${headerClasses}
      `}
      style={{
        backdropFilter: isCollapsed ? 'blur(20px)' : 'none', 
        WebkitBackdropFilter: isCollapsed ? 'blur(20px)' : 'none',
        borderBottom: 'none', 
      }}
    >
      {/* 2. Large Title & Subheading (Expanded State) */}
      <div
        className={`absolute bottom-8 left-8 transition-all duration-300 ${largeTitleClasses}`}
      >
        <h1 className="text-5xl md:text-7xl font-extrabold leading-none text-gray-900 dark:text-white ">{title}</h1>
        
        {/* FIX: Removed the extraneous curly brace around the conditional check */}
        {subheading && (
          <p className="text-xl font-medium text-gray-500 dark:text-gray-400 mt-2">
            {subheading}
          </p>
        )}
      </div>

      {/* Small Title (Collapsed State) */}
      <div
        className={`flex items-center justify-center h-full text-2xl font-semibold transition-opacity duration-300 ${smallTitleClasses} text-gray-900 dark:text-white`}
      >
        {title}
      </div>
    </header>
  );
};

export default CollapsibleHeader;