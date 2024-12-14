'use client' 

// Essential imports
import { useState } from 'react'  // For state management if needed later
import Link from 'next/link'      // Next.js link component for navigation

// Header component for the landing page
const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    // Main header container - full width with white background and shadow
    <header className="w-full bg-white shadow-md">
      {/* Container for centering content with responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flex container for logo, navigation, and authentication buttons */}
        <div className="flex justify-between items-center h-16">
          
          {/* Left section: Logo and Brand */}
          <div className="flex items-center space-x-3">
            {/* Temporary circle logo */}
            <div className="w-8 h-8 bg-black rounded-full"></div>
            {/* App name - using plum color */}
            <Link href="/" className="text-xl font-bold text-[#824670] hover:text-[#9a5485]">
              StudyBuddy
            </Link>
          </div>

          {/* Middle section: Navigation Links */}
          <nav className="flex space-x-6">
            {/* Dropdown feature */}
            <div className="relative">
              <button
                className="text-gray-700 hover:text-[#824670] font-medium flex items-center"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                Features
                {/* Dropdown arrow */}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <Link href="/feature1" className="block px-4 py-2 text-gray-700 hover:bg-[#824670] hover:text-white">
                    Feature 1
                  </Link>
                  <Link href="/feature2" className="block px-4 py-2 text-gray-700 hover:bg-[#824670] hover:text-white">
                    Feature 2
                  </Link>
                  <Link href="/feature3" className="block px-4 py-2 text-gray-700 hover:bg-[#824670] hover:text-white">
                    Feature 3
                  </Link>
                  <Link href="/feature4" className="block px-4 py-2 text-gray-700 hover:bg-[#824670] hover:text-white">
                    Feature 4
                  </Link>
                  <Link href="/feature5" className="block px-4 py-2 text-gray-700 hover:bg-[#824670] hover:text-white">
                    Feature 5
                  </Link>
                </div>
              )}
            </div>
            <Link href="/about" 
              className="text-gray-700 hover:text-[#824670] font-medium"
            >
              About
            </Link>
          </nav>

          {/* Right section: Authentication Buttons */}
          <div className="flex items-center space-x-4">
            {/* Login button - outlined style */}
            <Link 
              href="/login" 
              className="px-4 py-2 border-2 border-[#824670] text-[#824670] 
                         rounded-md hover:bg-[#824670] hover:text-white 
                         transition-colors duration-300"
            >
              Login
            </Link>
            {/* Sign Up button - filled style */}
            <Link 
              href="/signup" 
              className="px-4 py-2 bg-[#824670] text-white 
                         rounded-md hover:bg-[#9a5485] 
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