// Essential imports
import { useState } from 'react'  // If needed for state management
import Link from 'next/link'      // Next.js link component for navigation

// Header component 
const Header = () => {


  return (
    // Main header container with Tailwind classes
    <header className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              StudyBuddy
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/lectures" className="text-gray-600 hover:text-gray-900">
              Lectures
            </Link>
            {/* Will add more stuff on the way */}
          </nav>

          {/* User Authentication Section */}
          <div>
            {/* Will add login section and other porfile things here */}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header