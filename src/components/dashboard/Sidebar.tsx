'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RecordingsPanel() {
  // This state controls whether the panel is visible
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  return (
    // The outer container holds the panel and ensures proper positioning
    <div className="relative">
      {/* Toggle button - positioned on the right edge when panel is closed */}
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className={`fixed top-4 ${isPanelOpen ? 'left-64' : 'left-4'} z-50 bg-white border border-gray-200 
                   rounded-full p-2 shadow-sm transition-all duration-300`}
      >
        <svg
          className={`w-6 h-6 text-gray-600 transform transition-transform ${
            isPanelOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {/* The sliding panel itself */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 
                   transition-all duration-300 ease-in-out transform 
                   ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'} 
                   w-72 shadow-lg z-40`}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Recordings</h2>
          
          {/* Recordings list will go here */}
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 
                          transition-colors cursor-pointer">
              <h3 className="font-medium text-gray-800">Physics Lecture 1</h3>
              <p className="text-sm text-gray-500">Recorded 2 hours ago</p>
            </div>
            
            {/* Example recording items */}
            <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 
                          transition-colors cursor-pointer">
              <h3 className="font-medium text-gray-800">Chemistry Chapter 3</h3>
              <p className="text-sm text-gray-500">Recorded yesterday</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}