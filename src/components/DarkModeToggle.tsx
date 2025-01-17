import { useEffect, useState } from 'react';
import { useAppState } from '@/context/AppStateContext';

export function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toggleDarkMode } = useAppState();

  useEffect(() => {
    // Load the initial dark mode state from localStorage
    const storedMode = localStorage.getItem('darkMode');
    setIsDarkMode(storedMode === 'true');
  }, []);

  useEffect(() => {
    // Apply dark mode class to the document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    toggleDarkMode();
  };

  return (
    <div className="fixed top-4 right-16 z-50 flex items-center">
      <button
        onClick={handleToggle}
        className={`p-2 rounded-full transition-colors mr-4 ${
          isDarkMode
            ? 'bg-[#1a1f2e] hover:bg-[#2c2c2c] text-[#4da6ff]'
            : 'bg-[#4da6ff]/10 hover:bg-[#4da6ff]/20 text-[#4da6ff]'
        }`}
        aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
}

export function DarkModeStyles() {
    return (
      <style jsx global>{`
        /* Dark mode base styles */
        .dark {
          background-color: #14171F;
          color: #ffffff;
        }
  
        .dark h1,
        .dark h2,
        .dark h3,
        .dark h4,
        .dark h5,
        .dark h6 {
          color: #ffffff;
        }
  
        .dark a {
          color: #4da6ff;
        }
  
        .dark a:hover {
          color: #76b7ff;
        }
  
        .dark input,
        .dark textarea,
        .dark select {
          background-color: #1a1f2e;
          color: #ffffff;
          border-color: #2c3444;
        }
  
        .dark button {
          background-color: #1a1f2e;
          color: #ffffff;
          border-color: #2c3444;
        }
  
        .dark button:hover {
          background-color: #2c3444;
        }
  
        .dark .bg-white {
          background-color: #1a1f2e !important;
        }
  
        .dark .text-black {
          color: #ffffff !important;
        }
  
        .dark .border-gray-300 {
          border-color: #2c3444 !important;
        }
  
        .dark .bg-gray-100 {
          background-color: #1a1f2e !important;
        }
  
        .dark .text-gray-800 {
          color: #e0e0e0 !important;
        }
  
        .dark .bg-gray-50 {
          background-color: #14171F !important;
        }
      `}</style>
    );
  }