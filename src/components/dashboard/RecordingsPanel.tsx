'use client'

import { useState } from 'react'

export default function RecordingsPanel() {
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  return (
    <div className="absolute">
      {/* Toggle Button */}
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className="fixed top-[20px] left-6 z-50 p-2.5 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200"
        aria-label="Toggle Recordings Menu"
      >
        <svg 
          className="w-5 h-5 text-blue-400" 
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

      {/* Blocking overlay */}
      {isPanelOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 transition-opacity pointer-events-auto"
          style={{ zIndex: 9999 }}
          onClick={() => setIsPanelOpen(false)}
        />
      )}

      {/* Panel with smooth sliding animation */}
      <div 
        className={`fixed top-0 left-0 w-72 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isPanelOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ zIndex: 10000 }}
      >
        <div className="p-4 pt-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recordings</h2>
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