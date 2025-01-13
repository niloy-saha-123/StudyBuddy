'use client'

import Link from 'next/link'
import { auth } from '@clerk/nextjs/server';


const Header = () => {

  

  return (
    // Main header container - dark background, fixed position, and bottom border
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
            {/* Features Dropdown - Using group hover */}
            <div className="relative group">
              {/* Container to extend hover area */}
              <div className="flex items-center">
                <button
                  className="text-lg text-gray-300 hover:text-white font-medium flex items-center"
                >
                  Features
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Dropdown menu */}
              <div 
                className="absolute left-0 w-48 bg-[#14171F] rounded-md shadow-lg py-1 
                           opacity-0 invisible group-hover:opacity-100 group-hover:visible
                           transition-all duration-300 mt-2 border border-gray-800"
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
          
            
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header