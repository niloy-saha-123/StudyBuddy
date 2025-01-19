'use client'


import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Mic, BookOpen, GraduationCap, Globe, Layers } from 'lucide-react';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside of dropdown
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
            <div className="w-10 h-10 bg-white rounded-full"></div>
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
                  <Link
                    href="/live-transcription"
                    className="flex px-6 py-3 items-center text-gray-300 hover:bg-blue-500/10 hover:text-white"
                  >
                    <Mic className="w-6 h-6 mr-3 text-blue-400" />
                    <span className="text-lg">Live Transcription</span>
                  </Link>
                  <Link
                    href="/summarization"
                    className="flex px-6 py-3 items-center text-gray-300 hover:bg-blue-500/10 hover:text-white"
                  >
                    <BookOpen className="w-6 h-6 mr-3 text-blue-400" />
                    <span className="text-lg">Summarization</span>
                  </Link>
                  <Link
                    href="/exam-preparation"
                    className="flex px-6 py-3 items-center text-gray-300 hover:bg-blue-500/10 hover:text-white"
                  >
                    <GraduationCap className="w-6 h-6 mr-3 text-blue-400" />
                    <span className="text-lg">Exam Preparation</span>
                  </Link>
                  <Link
                    href="/multilingual-support"
                    className="flex px-6 py-3 items-center text-gray-300 hover:bg-blue-500/10 hover:text-white"
                  >
                    <Globe className="w-6 h-6 mr-3 text-blue-400" />
                    <span className="text-lg">Multilingual Support</span>
                  </Link>
                  <Link
                    href="/classroom-organisation"
                    className="flex px-6 py-3 items-center text-gray-300 hover:bg-blue-500/10 hover:text-white"
                  >
                    <Layers className="w-6 h-6 mr-3 text-blue-400" />
                    <span className="text-lg">Classroom Organisation</span>
                  </Link>
                </div>
              )}
            </div>

            <Link href="/about" className="text-lg text-gray-300 hover:text-white font-medium">
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-6">
            <Link
              href="/login"
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
