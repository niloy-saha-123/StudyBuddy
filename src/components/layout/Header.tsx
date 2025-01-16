'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handle clicking outside of dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="w-full bg-[#14171F] fixed top-0 left-0 z-50 border-b border-gray-800">
      {/* Full width container with responsive padding */}
      <div className="w-full px-6 sm:px-8 lg:px-10">
        {/* Flex container for header layout with increased height */}
        <div className="flex justify-between items-center h-20">
          
          {/* Left section: Logo and Brand */}
          <div className="flex items-center space-x-3">
            {/* Logo */}
            <div className="w-10 h-10 bg-white rounded-full"></div>
            {/* Brand name - larger size and matching color */}
            <Link href="/" className="text-3xl font-bold text-blue-300 hover:text-blue-200">
              StudyBuddy
            </Link>
          </div>

          {/* Middle section: Navigation Links */}
          <nav className="flex space-x-8">
            {/* Features Dropdown */}
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

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div 
                  className="absolute left-0 w-48 bg-[#14171F] rounded-md shadow-lg py-1 
                           mt-2 border border-gray-800 animate-fadeIn"
                >
                  <Link href="/feature1" className="block px-4 py-2 text-gray-300 hover:bg-blue-500/10 hover:text-white">
                    Feature 1
                  </Link>
                  <Link href="/feature2" className="block px-4 py-2 text-gray-300 hover:bg-blue-500/10 hover:text-white">
                    Feature 2
                  </Link>
                  <Link href="/feature3" className="block px-4 py-2 text-gray-300 hover:bg-blue-500/10 hover:text-white">
                    Feature 3
                  </Link>
                  <Link href="/feature4" className="block px-4 py-2 text-gray-300 hover:bg-blue-500/10 hover:text-white">
                    Feature 4
                  </Link>
                  <Link href="/feature5" className="block px-4 py-2 text-gray-300 hover:bg-blue-500/10 hover:text-white">
                    Feature 5
                  </Link>
                </div>
              )}
            </div>

            {/* About link */}
            <Link href="/about" 
              className="text-lg text-gray-300 hover:text-white font-medium"
            >
              About
            </Link>
          </nav>

          {/* Right section: Authentication Buttons */}
          <div className="flex items-center space-x-6">
            {/* Login button */}
            <Link 
              href="/sign-in" 
              className="text-lg px-6 py-2 text-blue-300 hover:text-white 
                         transition-colors duration-300"
            >
              Login
            </Link>
            {/* Sign Up button */}
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
  )
}

export default Header