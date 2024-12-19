'use client'

// Import necessary dependencies
import Link from 'next/link'

/**
 * Header Component
 * Responsive header with navigation, dropdown menu, and authentication buttons
 * Fixed positioning to stay at top of screen while scrolling
 */
const Header = () => {
  return (
    // Main header container with dark background and fixed positioning
    <header className="w-full bg-[#14171F] fixed top-0 left-0 z-50">
      {/* Full width container with responsive padding */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Flex container for header layout */}
        <div className="flex justify-between items-center h-16">
          
          {/* Left Section: Logo and Brand Name */}
          <div className="flex items-center space-x-3">
            {/* Circular logo placeholder */}
            <div className="w-8 h-8 bg-white rounded-full"></div>
            {/* Brand name with hover effect */}
            <Link href="/" className="text-2xl font-bold text-[#B591B8] hover:text-[#c9a5cc]">
              StudyBuddy
            </Link>
          </div>

          {/* Middle Section: Navigation Menu */}
          <nav className="flex space-x-6">
            {/* Features Dropdown - Using group hover */}
            <div className="relative group">
              {/* Container to extend hover area */}
              <div className="flex items-center">
                <button
                  className="text-gray-300 hover:text-white font-medium flex items-center"
                  aria-expanded="false"
                >
                  Features
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Dropdown menu */}
              <div 
                className="absolute left-0 w-48 bg-[#14171F] rounded-md shadow-lg py-1 
                           opacity-0 invisible group-hover:opacity-100 group-hover:visible
                           transition-all duration-300 mt-2"
              >
                <Link href="/feature1" className="block px-4 py-2 text-gray-300 hover:bg-[#B591B8] hover:text-white">
                  Feature 1
                </Link>
                <Link href="/feature2" className="block px-4 py-2 text-gray-300 hover:bg-[#B591B8] hover:text-white">
                  Feature 2
                </Link>
                <Link href="/feature3" className="block px-4 py-2 text-gray-300 hover:bg-[#B591B8] hover:text-white">
                  Feature 3
                </Link>
                <Link href="/feature4" className="block px-4 py-2 text-gray-300 hover:bg-[#B591B8] hover:text-white">
                  Feature 4
                </Link>
                <Link href="/feature5" className="block px-4 py-2 text-gray-300 hover:bg-[#B591B8] hover:text-white">
                  Feature 5
                </Link>
              </div>
            </div>

            {/* About link */}
            <Link href="/about" 
              className="text-gray-300 hover:text-white font-medium"
            >
              About
            </Link>
          </nav>

          {/* Right Section: Authentication Buttons */}
          <div className="flex items-center space-x-4">
            {/* Login button - Text style with hover effect */}
            <Link 
              href="/login" 
              className="px-4 py-2 text-[#B591B8] hover:text-white 
                         transition-colors duration-300"
            >
              Login
            </Link>
            {/* Sign Up button - Filled style with hover effect */}
            <Link 
              href="/signup" 
              className="px-4 py-2 bg-[#B591B8] text-white 
                         rounded-md hover:bg-[#c9a5cc] 
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