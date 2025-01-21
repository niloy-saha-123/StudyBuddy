'use client'

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Mic, BookOpen, GraduationCap, Globe, Layers } from 'lucide-react';

const Logo = () => (
  <div className="flex flex-col items-center">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className="w-10 h-10">
      {/* First curved line */}
      <path 
        d="M20 5 
           C30 5, 35 15, 35 20
           C35 25, 30 35, 20 35
           C25 30, 28 25, 28 20
           C28 15, 25 10, 20 5Z" 
        fill="#60A5FA"
      />
      {/* Second curved line */}
      <path 
        d="M20 5
           C10 5, 5 15, 5 20
           C5 25, 10 35, 20 35
           C15 30, 12 25, 12 20
           C12 15, 15 10, 20 5Z" 
        fill="#60A5FA"
      />
    </svg>
  </div>
);

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-[#14171F] fixed top-0 left-0 z-50 border-b border-gray-800">
      <div className="w-full px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <Logo />
            <Link href="/" className="text-3xl font-bold text-blue-300 hover:text-blue-200">
              StudyBuddy
            </Link>
          </div>

          <nav className="flex space-x-8">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                className="text-lg text-gray-300 hover:text-white font-medium flex items-center"
              >
                Features
                <svg
                  className={`w-5 h-5 ml-1 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute left-0 w-64 bg-[#1a1f2e] rounded-lg shadow-lg py-2 
                           mt-2 border border-gray-800 animate-fadeIn"
                >
                  <div className="flex px-6 py-3 items-center text-gray-300 hover:bg-blue-500/10 hover:text-white cursor-pointer">
                    <Mic className="w-6 h-6 mr-3 text-blue-400" />
                    <span className="text-lg">Live Transcription</span>
                  </div>
                  <div className="flex px-6 py-3 items-center text-gray-300 hover:bg-blue-500/10 hover:text-white cursor-pointer">
                    <BookOpen className="w-6 h-6 mr-3 text-blue-400" />
                    <span className="text-lg">Summarization</span>
                  </div>
                  <div className="flex px-6 py-3 items-center text-gray-300 hover:bg-blue-500/10 hover:text-white cursor-pointer">
                    <GraduationCap className="w-6 h-6 mr-3 text-blue-400" />
                    <span className="text-lg">Exam Preparation</span>
                  </div>
                  <div className="flex px-6 py-3 items-center text-gray-300 hover:bg-blue-500/10 hover:text-white cursor-pointer">
                    <Globe className="w-6 h-6 mr-3 text-blue-400" />
                    <span className="text-lg">Multilingual Support</span>
                  </div>
                  <div className="flex px-6 py-3 items-center text-gray-300 hover:bg-blue-500/10 hover:text-white cursor-pointer">
                    <Layers className="w-6 h-6 mr-3 text-blue-400" />
                    <span className="text-lg">Classroom Organisation</span>
                  </div>
                </div>
              )}
            </div>

            <Link href="/about" className="text-lg text-gray-300 hover:text-white font-medium">
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-6">
            <Link
              href="/sign-in"
              className="text-lg px-6 py-2 text-blue-300 hover:text-white 
                         transition-colors duration-300"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="text-lg px-6 py-2 bg-blue-500 text-white 
                         rounded-md hover:bg-blue-400 
                         transition-colors duration-300"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;