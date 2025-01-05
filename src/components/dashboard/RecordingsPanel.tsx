'use client'

import { useState } from 'react'

export default function RecordingsPanel() {
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  return (
    <div className="absolute">
      {/* Toggle Button */}
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className="fixed top-4 left-4 z-50 p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
        aria-label="Toggle Recordings Menu"
      >
        <svg 
          className="w-6 h-6 text-[#00BFFF]" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Rest of the panel code */}
      {isPanelOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40 transition-opacity"
          onClick={() => setIsPanelOpen(false)}
        />
      )}

      <div 
        className={`fixed top-0 left-0 w-72 h-full bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isPanelOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 pt-24 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recordings</h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-3">
              {/* Recordings will be listed here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}